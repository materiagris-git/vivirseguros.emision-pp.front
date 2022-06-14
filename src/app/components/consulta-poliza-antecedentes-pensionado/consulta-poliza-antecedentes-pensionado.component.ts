import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PolizaAntecedentesPensionadosService } from 'src/providers/poliza-antecedentes-pensionados.service';
import { PolizaAntecedenPensionados } from 'src/interfaces/PolizaAntecedentesPensionado.model';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import Swal from 'sweetalert2';

declare function llenaTablatblAntecedemtePensionado(results: any): any;
@Component({
  selector: 'app-consulta-poliza-antecedentes-pensionado',
  templateUrl: './consulta-poliza-antecedentes-pensionado.component.html',
  styleUrls: ['./consulta-poliza-antecedentes-pensionado.component.css']
})
export class ConsultaPolizaAntecedentesPensionadoComponent implements OnInit {

  mlPoliza=10;
  mlCuspp=12;
  mlNDoc=15;
  mlApNom=20;
  isDisabled = true;
  NumDoc = "";
  NumEndoso = "";
  TipoDoc = "";
  frmPolAntPensionados: NgForm;
  public cmbTipoIdenBen: any[];
  columnas = [];
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  InfoPensionados: PolizaAntecedenPensionados = {
    NumPoliza: "",
    Cuspp: "",
    TipoDoc: "0",
    NumDoc: "",
    NumEndoso: "",
    ApePaterno: "",
    ApeMaterno: "",
    Nombre: "",
    SegNombre: ""
  }

  lstPensionados: [];

  constructor( private _polizaAntPenService: PolizaAntecedentesPensionadosService, public titleService: Title,
    private serviceLog:LoginService,
    private cdRef:ChangeDetectorRef ) {

    this.columnas = ['item','numeroPoliza', 'endoso', 'nomAfiliado','fecha','acciones'];
    _polizaAntPenService.getComboIdentificacion().then( (resp: any) => {
      this.cmbTipoIdenBen = resp;
      // console.log(resp);
      
    });
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Consulta Póliza Antecedentes del Pensionado';
    this.titleService.setTitle(Globales.titlePag);
    this.isDisabled;
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator._intl.getRangeLabel = function (page, pageSize, length) {
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

  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  enableInput(value){
    if (value != ''){
      this.isDisabled=false;
    }else{
      this.isDisabled=true;
      this.InfoPensionados.NumDoc = "";
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
    if (this.InfoPensionados.NumPoliza != ""){
      var pad = "0000000000";
      var numPol = this.InfoPensionados.NumPoliza;
      var result = (pad + numPol).slice(-pad.length);
      this.InfoPensionados.NumPoliza = result;
    }
  }

  onlyAlphaNumeric(event) {
    if ((event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57)){
      event.preventDefault();
    }
  }

   // Selección de combo Tipo de Documento.
   cambiarTipoDoc() {
    const tipoDoc = this.InfoPensionados.TipoDoc;
    this.InfoPensionados.TipoDoc = tipoDoc;
    this.InfoPensionados.NumDoc = '';

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
    this.InfoPensionados = {
      NumPoliza: "",
      Cuspp: "",
      TipoDoc: "0",
      NumDoc: "",
      NumEndoso: "",
      ApePaterno: "",
      ApeMaterno: "",
      Nombre: "",
      SegNombre: ""
    }
  }

  datoGlobal(NumPoliza, NumEndoso, NumOrden){
    Globales.datosAntPensionados.NumPoliza = NumPoliza;
    Globales.datosAntPensionados.NumEndoso = NumEndoso;
    Globales.datosAntPensionados.NumOrden = NumOrden;
  }

  buscarPensionados(){
    this._polizaAntPenService.postBuscarInfoPensionados(this.InfoPensionados).then( (resp:any) => {
      this.dataSource = new MatTableDataSource(resp.lstConsultaPrimas);
      this.dataSource.paginator = this.paginator;

      if (resp.lstConsultaPrimas == null || resp.lstConsultaPrimas == ""){
        Swal.fire({ title: 'Advertencia', text: 'No existe información para mostrar.', icon: 'warning', allowOutsideClick: false });
        return;
      }
    });
  }

}
