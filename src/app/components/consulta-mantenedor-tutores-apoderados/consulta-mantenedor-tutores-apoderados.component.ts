import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConsultaMantenedorTutoresApoderadosService } from 'src/providers/ConsultaMantenedorTutoresApoderados.service';
import { mantenedorTutoresApoderados } from 'src/interfaces/mantenedorTutoresApoderados.model';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { consultaPolizaModel } from 'src/interfaces/consultaPoliza.model';
import { ConsultaPolizaServiceService } from 'src/providers/consulta-poliza-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';

declare function llenaTablatblTutoresApoderados(results: any): any;
@Component({
  selector: 'app-consulta-mantenedor-tutores-apoderados',
  templateUrl: './consulta-mantenedor-tutores-apoderados.component.html',
  styleUrls: ['./consulta-mantenedor-tutores-apoderados.component.css']
})
export class ConsultaMantenedorTutoresApoderadosComponent implements OnInit {
  public cmbTipoIdent: any;
  NumDoc = '';
  NumEndoso: '';
  mlPoliza = 10;
  mlCuspp = 12;
  mlNDoc = 15;
  mlApNom = 20;

  dataBusqueda: consultaPolizaModel = new consultaPolizaModel();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  columnas = [];

  private url = AppConsts.baseUrl + 'mantenedorTutoresApoderados';
  isDisabled = true;
  slcTipoIdent = '';
  constructor(private mantenedorTutoresApoderadosService: ConsultaMantenedorTutoresApoderadosService,
    public titleService: Title,
    private consultaPolizaServiceService: ConsultaPolizaServiceService,
    private http: HttpClient, private _router: Router,
    private serviceLog: LoginService, private cdRef: ChangeDetectorRef
  ) {
    this.columnas = ['item', 'numPol', 'numEndoso', 'nomAfiliado', 'fechaNacimiento', 'fecha', 'acciones'];

    this.mantenedorTutoresApoderadosService.getComboGeneral('SELECT_COMBOTIPOIDEN', '').then((resp: any) => {
      this.cmbTipoIdent = resp;
    });

    // this.http.get<any>(this.url + '/CmbIde').subscribe(result => {
    // this.cmbTipoIdent = result;
    // console.log(result);

    // }, error => console.error(error));
    // console.log(this.cmbTipoIdent);
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    Globales.titlePag = 'Consulta Póliza / Mantenedor de Tutores-Apoderados';
    this.titleService.setTitle(Globales.titlePag);
    // this.isDisabled;
    // this.cmbTipoIdent = this.mantenedorTutoresApoderadosService.getCombo();
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  lettersOnly(event) {
    event = (event) ? event : event;
    var charCode = (event.charCode) ? event.charCode : ((event.keyCode) ? event.keyCode :
      ((event.which) ? event.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  onlyAlphaNumeric(event) {
    if ((event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57)) {
      event.preventDefault();
    }
  }

  polizaSeleccionada(poliza: string,NumOrden: number,Parentesco: string) {
    Globales.datosTutorApoderado.NumPoliza = poliza;
    Globales.datosTutorApoderado.NumOrden = NumOrden;
    Globales.datosTutorApoderado.Parentesco = Parentesco;

    this._router.navigate(['/mantenedorTutoresApoderados']);
  }


  // Selección de combo Tipo de Documento.
  cambiarTipoDoc() {
    const tipoDoc = this.dataBusqueda.TipoDocumento;
    this.dataBusqueda.TipoDocumento = tipoDoc;
    this.dataBusqueda.NoDocumetnto = '';

    if (tipoDoc === "1") {
      this.mlNDoc = 8;
    }
    if (tipoDoc === "2" || tipoDoc === "5") {
      this.mlNDoc = 12;
    }
    if (tipoDoc === '9') {
      this.mlNDoc = 11;
    }
    if (tipoDoc === '3' || tipoDoc === '4' || (tipoDoc > '5' && tipoDoc < '9') || tipoDoc === '10') {
      this.mlNDoc = 15;
    }
  }

  // Limpiar campos de pantalla.
  limpiarFiltros() {
    this.isDisabled = true;
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataBusqueda = new consultaPolizaModel()
  }

  abilitarinput(deviceValue) {
    if (deviceValue !== '' && deviceValue !== '0') {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
  consultar() {
    if ((this.dataBusqueda.TipoDocumento !== '0' && this.dataBusqueda.NoDocumetnto === '') && (this.dataBusqueda.TipoDocumento !== '' && this.dataBusqueda.NoDocumetnto === '')) {
      Swal.fire('Error', 'Debe ingresar un número de documento.', 'error');
      return;
    }

    /*this.consultaPolizaServiceService
      .getConsultasPolizas(this.dataBusqueda)
      .then((resp: any) => {
        // console.log(resp);
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
      });*/
      if (this.dataBusqueda.NumeroPoliza != "") {
        const pad = "0000000000";
        const numPol = this.dataBusqueda.NumeroPoliza;
        const result = (pad + numPol).slice(-pad.length);
        this.dataBusqueda.NumeroPoliza = result;
      }

    this.mantenedorTutoresApoderadosService.postConsultaGnral(this.dataBusqueda)
                             .then( (resp: any) => {
                              //console.log(resp)
                              if (resp.length>0){
                                this.dataSource = new MatTableDataSource(resp);
                                this.dataSource.paginator = this.paginator;
                              }else{
                                this.dataSource = new MatTableDataSource([]);
                                this.dataSource.paginator = this.paginator;
                                Swal.fire('Error', 'No se encontró información con los filtros proporcionados.', 'error');
                                return;
                              }

                             });
  }

}
