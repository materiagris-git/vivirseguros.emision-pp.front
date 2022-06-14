import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultaTraspaso, PolizasTrasp } from '../../models/ConsultaTraspaso';
import { ConsultaPolizastraspasadasService } from '../../../providers/consulta-polizastraspasadas.service';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { LoginService } from 'src/providers/login.service';
import * as moment from 'moment';
import { ReportePolizasTraspService } from 'src/providers/reporte-polizas-trasp.service';
import { generarAchivoXLSX } from 'src/providers/generarArchivoXLSX.service';

declare function limpiarTablaConsulta(): any;

@Component({
  selector: 'app-consultapolizas-traspasadas',
  templateUrl: './consultapolizas-traspasadas.component.html',
  styleUrls: ['./consultapolizas-traspasadas.component.css']
})
export class ConsultapolizasTraspasadasComponent implements OnInit, AfterViewInit, AfterViewChecked {

  fechaBusqueda: ConsultaTraspaso;
  results: any;
  fechaLimite: Date;
  d1: Date;
  d2: Date;
  formBusqueda: FormGroup;
  columnas = [];
  TipoPension = [];
  TipoRenta = [];
  TipoModalidad = [];
  fecDesde;
  fecHasta;
  _polizasTrasp: PolizasTrasp[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    public titleService: Title,
    private generarAchivoXLSX: generarAchivoXLSX,
    private apiService: ConsultaPolizastraspasadasService,
    private _repPolizasTrasp: ReportePolizasTraspService,
    private serviceLog: LoginService,
    private cdRef: ChangeDetectorRef
  ) {
    this.columnas = [
      'item',
      'poliza',
      'fecTrasPrim',
      'mtoTrasPrim',
      'fecTrasPP',
      'fecVige',
      'CUSPP',
      'nombre'
    ];
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    this.formBusquedaPolizas();
    this.fechaLimite = new Date('1900-01-01');
    Globales.titlePag = 'Consulta de Pólizas Traspasadas';
    this.titleService.setTitle(Globales.titlePag);
    this.fecDesde = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD');
    this.fecHasta = moment(new Date()).format('YYYY-MM-DD');
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator._intl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return '0 de ' + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };
  }

  ngAfterViewChecked() {
    if (!localStorage.getItem('currentUser')) {
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  formBusquedaPolizas() {
    this.formBusqueda = this.fb.group({
      fechaDesde: ['',],
      fechaHasta: ['',]
    });
  }

  get fechaHasta() {
    return this.formBusqueda.get('fechaHasta').invalid && this.formBusqueda.get('fechaHasta').touched;
  }

  get fechaDesde() {
    return this.formBusqueda.get('fechaDesde').invalid && this.formBusqueda.get('fechaDesde').touched;
  }

  consPolTras() {
    const fechaHasta = (<HTMLInputElement>document.getElementById('fechaHasta')).value;
    const fechaDesde = (<HTMLInputElement>document.getElementById('fechaDesde')).value;

    if (fechaDesde === '') {
      this.validarFechaDesde();
      Swal.fire('Falta de Información', 'Debe Ingresar una Fecha para el Valor Desde.', 'error');
    } else {
      if (fechaHasta === '') {
        this.validarFechaHasta();
        Swal.fire('Falta de Información', 'Debe Ingresar una Fecha para el Valor Hasta.', 'error');
      } else {
        this.d1 = new Date(fechaDesde);
        this.d2 = new Date(fechaHasta);
        if (this.d1.getTime() > this.d2.getTime()) {
          Swal.fire('Error de Información', '"La Fecha Ingresada es Mayor a la Fecha Actual.', 'error');
        } else {
          if (this.d1.getTime() < this.fechaLimite.getTime()) {
            Swal.fire('Error de Información', 'La Fecha Ingresada es Inferior a la Fecha Mínima de Ingreso (1900).', 'error');
          } else {
            this.fechaBusqueda = new ConsultaTraspaso();
            this.fechaBusqueda.FechaDesde = fechaDesde;
            this.fechaBusqueda.FechaHasta = fechaHasta;
            // tslint:disable-next-line:variable-name
            this.apiService.getFechas(this.fechaBusqueda).then(any => {
              this.formBusqueda.controls.fechaDesde.disable();
              this.formBusqueda.controls.fechaHasta.disable();
              this.results = any;
              this.dataSource = new MatTableDataSource(this.results);
              this.dataSource.paginator = this.paginator;

              //Datos de reporte
              this._repPolizasTrasp.getCombos().then((resp: any) => {
                this.TipoModalidad = resp.LstTipoModalidad;
                this.TipoPension = resp.LstTipoPension;
                this.TipoRenta = resp.LstTipoRenta;
              });

              this._repPolizasTrasp.getRepInfo(this.fechaBusqueda).then((resp: any) => {
                this._polizasTrasp = resp;
              });
            }
            ).catch(() => {
              console.log('Ocurrio un error');
            });

          }
        }
      }
    }
  }

  validarFechaDesde() {
    this.formBusqueda.get('fechaDesde').setValidators([Validators.required]);
    this.formBusqueda.get('fechaDesde').updateValueAndValidity();
    this.formBusqueda.controls.fechaDesde.markAsTouched();
  }

  validarFechaHasta() {
    this.formBusqueda.get('fechaHasta').setValidators([Validators.required]);
    this.formBusqueda.get('fechaHasta').updateValueAndValidity();
    this.formBusqueda.controls.fechaHasta.markAsTouched();
  }

  limpiarFormulario() {
    this.results = [];
    limpiarTablaConsulta();
    this.formBusqueda.controls.fechaDesde.enable();
    this.formBusqueda.controls.fechaHasta.enable();
    this.dataSource = new MatTableDataSource(this.results);
    this.dataSource.paginator = this.paginator;

    this.formBusqueda.get('fechaDesde').setValue(moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD'));
    this.formBusqueda.get('fechaHasta').setValue(moment(new Date()).format('YYYY-MM-DD'));
  }

  imprimirFormulario() {
    Swal.fire(
      'Imprimiendo',
      'La consulta se esta imprimiendo.',
      'success'
    );
  }

  generarArchivo(){

    const fechaHasta = (<HTMLInputElement>document.getElementById('fechaHasta')).value;
    const fechaDesde = (<HTMLInputElement>document.getElementById('fechaDesde')).value;

    if (fechaDesde === '') {
      this.validarFechaDesde();
      Swal.fire('Falta de Información', 'Debe Ingresar una Fecha para el Valor Desde.', 'error');
    }else{
      if (fechaHasta === '') {
        this.validarFechaHasta();
        Swal.fire('Falta de Información', 'Debe Ingresar una Fecha para el Valor Hasta.', 'error');
      } else{
        this.d1 = new Date(fechaDesde);
        this.d2 = new Date(fechaHasta);

        if (this.d1.getTime() > this.d2.getTime()) {
          Swal.fire('Error de Información', '"La Fecha Ingresada es Mayor a la Fecha Actual.', 'error');
        } else{
          if (this.d1.getTime() < this.fechaLimite.getTime()) {
            Swal.fire('Error de Información', 'La Fecha Ingresada es Inferior a la Fecha Mínima de Ingreso (1900).', 'error');
          } else{
            //Generación de archivo Excel
            Swal.showLoading();
            if(this._polizasTrasp.length > 0){
              this.d1 = new Date(moment(fechaDesde).toString());
              this.d2 = new Date(moment(fechaHasta).toString());
              this.generarAchivoXLSX.generateExcelPolizasTrasp(this._polizasTrasp, this.TipoPension, this.TipoRenta, this.TipoModalidad, this.d1, this.d2);
              Swal.close();
            }else{
              Swal.fire({title: 'ERROR',text: "No se ha encontro información con el Periodo ingresado." , icon: 'error', allowOutsideClick: false});
            }
          }
        }

      }
    }
  }

}
