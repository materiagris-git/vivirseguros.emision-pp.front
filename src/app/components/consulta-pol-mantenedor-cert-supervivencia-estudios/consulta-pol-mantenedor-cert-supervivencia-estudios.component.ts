import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { AppConsts } from "src/app/AppConst";
import { mantenedorCertificadosSupervivencia } from "src/interfaces/mantenedorCertificadosSupervivencia.model";
import { ConsultaMantenedorCertificadosSupervivenciaService } from "src/providers/ConsultaMantenedorCertificadosSupervivencia.service";
import { MatPaginator } from "@angular/material/paginator";
import { Globales } from "src/interfaces/globales";
import { MatTableDataSource } from "@angular/material/table";
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: "app-consulta-pol-mantenedor-cert-supervivencia-estudios",
  templateUrl:
    "./consulta-pol-mantenedor-cert-supervivencia-estudios.component.html",
  styleUrls: [
    "./consulta-pol-mantenedor-cert-supervivencia-estudios.component.css"
  ]
})
export class ConsultaPolMantenedorCertSupervivenciaEstudiosComponent
  implements OnInit, AfterViewInit {

    mlPoliza=10;
    mlCuspp=12;
    mlNDoc=15;
    mlApNom=20;
    isDisabled = true;

  busqueda: mantenedorCertificadosSupervivencia = {
    NumPoliza: "",
    CUSPP: "",
    TipoDoc: "0",
    NumDoc: "",
    NumEndoso: "",
    ApellidoPat: "",
    ApellidoMat: "",
    Nombre1: "",
    Nombre2: ""
  };

  columnas = [];
  public cmbTipoIdent: any[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  private url = AppConsts.baseUrl + "mantenedorTutoresApoderados";

  constructor(
    private serviceLog:LoginService, private cdRef:ChangeDetectorRef,
    private _MantCertSupService: ConsultaMantenedorCertificadosSupervivenciaService, public titleService: Title ) {
    this.columnas = ["item", "numPol", "nomAfiliado", "fecha", "acciones"];

    this._MantCertSupService.getCombos("SELECT_COMBOTIPOIDEN","").then( (resp: any) => {
      this.cmbTipoIdent = resp;
    });
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    this.isDisabled;
    Globales.titlePag = 'Consulta Póliza/ Mantenedor de Certificados de Supervivencia/Certificado de Estudios';
    this.titleService.setTitle(Globales.titlePag);
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator._intl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return "0 de " + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return startIndex + 1 + " - " + endIndex + " de " + length;
    };
  }
  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  enableInput(value){
    // console.log(this.cmbTipoIdent);
    
    if (value != ''){
      this.isDisabled=false;
    }else{
      this.isDisabled=true;
      this.busqueda.NumDoc = "";
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  lettersOnly(e): boolean {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    const letras = 'áéíóúabcdefghijklmnñopqrstuvwxyz';
    const especiales = [8, 37, 39, 32];

    let tecla_especial = false;
    for (let i in especiales) {
        if (key === especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if ( (letras.indexOf(tecla) === -1) && (!tecla_especial) ) {
      return false;
    }
  }

  zeroFill(){
    if (this.busqueda.NumPoliza != ""){
      var pad = "0000000000";
      var numPol = this.busqueda.NumPoliza;
      var result = (pad + numPol).slice(-pad.length);
      this.busqueda.NumPoliza = result;
    }
  }

  onlyAlphaNumeric(event) {
    if ((event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57)){
      event.preventDefault();
    }
  }

  // Selección de combo Tipo de Documento.
  cambiarTipoDoc() {
    const tipoDoc = this.busqueda.TipoDoc;
    this.busqueda.TipoDoc = tipoDoc;
    this.busqueda.NumDoc = '';

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

  datoGlobal(NumPoliza, NumEndoso, NumOrden){
    Globales.datosAntPensionados.NumPoliza = NumPoliza;
    Globales.datosAntPensionados.NumEndoso = NumEndoso;
    Globales.datosAntPensionados.NumOrden = NumOrden;
  }

  consultar() {
    this._MantCertSupService.postConsultaGnral(this.busqueda).then( (resp: any) => {
      this.dataSource = new MatTableDataSource(resp.listConsulta);
      this.dataSource.paginator = this.paginator;

      if (resp.listConsulta == null || resp.listConsulta == ""){
        Swal.fire({ title: 'Advertencia', text: 'No existe información para mostrar.', icon: 'warning', allowOutsideClick: false });
        return;
      }
    });
  }
  limpiar(){
    this.busqueda = {
      NumPoliza: "",
      CUSPP: "",
      TipoDoc: "0",
      NumDoc: "",
      NumEndoso: "",
      ApellidoPat: "",
      ApellidoMat: "",
      Nombre1: "",
      Nombre2: ""
    };
    this.dataSource = new MatTableDataSource([]);
    this.isDisabled=true;
  }
}
