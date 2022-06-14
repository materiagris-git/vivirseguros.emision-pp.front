import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Globales } from 'src/interfaces/globales';
import { LoginService } from 'src/providers/login.service';
import { BusquedaEstadisticas } from 'src/interfaces/estadisticas.model';
import Swal from 'sweetalert2';
import { EstadisticasService } from '../../../providers/estadisticas.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, AfterViewInit, AfterViewChecked {

  //Objeto de info de búsqueda.
  datosBusqueda: BusquedaEstadisticas = new BusquedaEstadisticas();

  //Variable para columnas de la tabla de resultados.
  columnasTblResultados = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(public titleService: Title, private http: HttpClient, private _router: Router, private cdRef: ChangeDetectorRef, private serviceLog: LoginService, 
              private _serviceEstadisticas: EstadisticasService) {
    this.columnasTblResultados = ['numPoliza', 'numEndoso', 'nomProceso', 'descripEstado', 'fecRegistro', 'fecCierre', 'numDocumento', 'nomEmpresa', 'fecEnvioNotif', 'fecFirmaDigital', 'fecRecepNotif', 'fecVisualizaContrato', 'nomUsuario', 'tipoUsuario','correo','comentario'];
  }
  dataSourceTblResultados: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Estadísticas';
    this.titleService.setTitle(Globales.titlePag);
    this.dataSourceTblResultados = new MatTableDataSource([]);
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
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
      return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };
  }

  ngAfterViewChecked() {
    if (!localStorage.getItem('currentUser')) {
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  //Función para validar campos de texto con solo números enteros.
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //Función para botón de búscar.(Realizar la búsqueda de la información).
  btnBuscar() {
    if (this.datosBusqueda.NumPoliza == '' && this.datosBusqueda.NumEndoso == '' && this.datosBusqueda.FecInicio == '' && this.datosBusqueda.FecFin == '') {
      Swal.fire('Error', 'Campos vacíos, favor de ingresar algún valor de búsqueda.', 'error');
      return;
    }

    if (this.datosBusqueda.NumPoliza !='' && this.datosBusqueda.NumPoliza.length < 10) {
      this.datosBusqueda.NumPoliza = this.datosBusqueda.NumPoliza.padStart(10, '0');
    }
    
    this._serviceEstadisticas.postBusquedaEstadisticas(this.datosBusqueda).then( (resp: any) => {
      if (resp.Mensaje != 'Ok.') {
        Swal.fire('Error', resp.Mensaje, 'error');
        this.dataSourceTblResultados = new MatTableDataSource([]);
        return;
      } else {
        this.dataSourceTblResultados = new MatTableDataSource(resp.data);
      }
    });
  }

}
