import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConsultaGeneralService } from 'src/providers/consulta-general.service';
import { ConsultaGeneralObj } from 'src/interfaces/consultaGeneral.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-general',
  templateUrl: './consulta-general.component.html',
  styleUrls: ['./consulta-general.component.css']
})
export class ConsultaGeneralComponent implements OnInit {
  filtros:ConsultaGeneralObj = new ConsultaGeneralObj();
  comboTipoDoc=[];
  mlPoliza=10;
  mlCuspp=12;
  mlNDoc=15;
  mlApNom=20;

  isDisabled = true;
  listaPolizas = [];
  columnas = [];
  idTipoDoc = "";
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  constructor(private service:ConsultaGeneralService, public titleService: Title, private serviceLog:LoginService, private cdRef:ChangeDetectorRef)
  {
    this.columnas = ['item','numPol','cuspp','doc','endoso', 'nomAfiliado','fecha','acciones']
    this.service.getCombo().subscribe(res=>{
      this.comboTipoDoc = res;
    }
      , err=>{})
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    Globales.titlePag = 'Consulta General';
    this.titleService.setTitle(Globales.titlePag);
    this.isDisabled;

  }
  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
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

  enableInput(value){

    if (value != -1){
      this.isDisabled=false;
    }else{
      this.isDisabled=true;
      this.filtros.NoDocumetnto = "";
    }
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

  zeroFill(){
    if (this.filtros.NumeroPoliza != ""){
      var pad = "0000000000";
      var numPol = this.filtros.NumeroPoliza;
      var result = (pad + numPol).slice(-pad.length);
      this.filtros.NumeroPoliza = result;
    }
  }

  onlyAlphaNumeric(event) {
    if ((event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57)){
      event.preventDefault();
    }
  }

  soloLetras(e): boolean {
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

  buscarPolizas(){
    if(this.filtros.NumeroPoliza==''){
      this.filtros.NumeroPoliza = null;
    }
    else if (this.filtros.CUSPP ==''){
      this.filtros.CUSPP = null;
    }
    else if (this.filtros.NoDocumetnto ==''){
      this.filtros.NoDocumetnto = null;
    }
    else if (this.filtros.Paterno== ''){
      this.filtros.Paterno = null;
    }
    else if (this.filtros.Materno== ''){
      this.filtros.Materno = null;
    }
    else if (this.filtros.Nombre== ''){
      this.filtros.Nombre = null;
    }
    else if (this.filtros.SegundoNombre== ''){
      this.filtros.SegundoNombre = null;
    }
    this.service.getPolizas(this.filtros).subscribe(res=>{
      this.listaPolizas = res;
      this.dataSource = new MatTableDataSource(this.listaPolizas);
      this.dataSource.paginator = this.paginator;
      if (res == "" || this.listaPolizas == null){
        Swal.fire({ title: 'Advertencia', text: 'No existe información para mostrar.', icon: 'info', allowOutsideClick: false });
        return;
      }
    }
      , err=>{})
  }
  cambioEndoso(event){
    if(event == ''){
      this.filtros.NoEndoso = 0;
    }
  }

  datosConsulta(datos){
    Globales.datosConsultaGeneral.numPoliza = datos.NumeroPoliza;
    Globales.datosConsultaGeneral.numEndoso = datos.NoEndoso;
    Globales.datosConsultaGeneral.fecha = datos.Fecha;

  }

  // Selección de combo Tipo de Documento.
  cambiarTipoDoc() {
    const tipoDoc = Number(this.filtros.IdTipoDoc);
    this.filtros.IdTipoDoc = tipoDoc;
    this.filtros.NoDocumetnto = '';

    if (tipoDoc === 1) {
      this.mlNDoc = 8;
    }
    if (tipoDoc === 2 || tipoDoc === 5) {
      this.mlNDoc = 12;
    }
    if (tipoDoc === 9) {
      this.mlNDoc = 11;
    }
    if (tipoDoc === 3 || tipoDoc === 4 || (tipoDoc > 5 && tipoDoc < 9) || tipoDoc === 10) {
      this.mlNDoc = 15;
    }
  }

  limpiar(){
    this.filtros.NumeroPoliza = null;
    this.filtros.CUSPP = null;
    this.filtros.NoEndoso = 0;
    this.filtros.IdTipoDoc = -1;
    this.isDisabled=true;
    this.filtros.NoDocumetnto = null;
    this.filtros.Paterno = null;
    this.filtros.Materno = null;
    this.filtros.Nombre = null;
    this.filtros.SegundoNombre = null;
    this.dataSource = new MatTableDataSource([]);
  }
}
