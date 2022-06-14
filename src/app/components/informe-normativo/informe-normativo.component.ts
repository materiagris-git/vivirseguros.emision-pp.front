import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { InformeNormativoService } from 'src/providers/informe-normativo-service.service';
import * as FileSaver from 'file-saver';

import * as moment from 'moment';
import Swal from 'sweetalert2';
import {ReportesEssaludService} from 'src/providers/reportesSalud.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-informe-normativo',
  templateUrl: './informe-normativo.component.html',
  styleUrls: ['./informe-normativo.component.css']
})
export class InformeNormativoComponent implements OnInit {

   selectedAll: any;
   remision = false;
   contigo = false;
   vigentes = false;
   pension65 = false;
   essalud = false;
   planilla = false;
   cotizacion = false;
   jubilacion = false;
   beneficios = false;

   Bremision = false;
   Bcontigo = false;
   Bvigentes = false;
   Bpension65 = false;
   Bessalud = false;
   Bplanilla = false;
   Bcotizacion = false;
   Bjubilacion = false;
   Bbeneficios = false;

   cotejoContigo = true;
   cotejoPension = true;
   NombreZip = "";
   contador = 0;

  archivosDescarga: string[] = [];
   
  archivo = "";
  hoy = new Date();
  mensajeError = '';
  d0Hoy =  moment(this.hoy);
  date = '';
  fecha = moment(this.hoy).subtract(1,'months').format('YYYY-MM');

  constructor(public titleService: Title,
    private cdRef: ChangeDetectorRef,
    private service: InformeNormativoService,
    private serviceRepoEssalud:ReportesEssaludService,
    private spinner: NgxSpinnerService) {

   }

  ngOnInit() {
    let d0Hoy =  moment(this.hoy);
    this.date = moment(this.hoy).subtract(1,'months').format('YYYY-MM');
  }

  ngAfterViewInit(): void {
    Globales.titlePag = 'Informe Normativo';
    this.titleService.setTitle(Globales.titlePag);
    this.cdRef.detectChanges();
  }

  descargar() {    
    if (this.fecha === '') {
      this.mensajeError = 'Favor de seleccionar un Periodo de Pago.';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
    }
    let d0Hoy =  moment(this.hoy).format('YYYY-MM-01');
    let d0fecha = moment(this.fecha).format('YYYY-MM-01');
    if (d0fecha >= d0Hoy)
    {
      this.mensajeError = 'Favor de seleccionar un mes anterior al actual.';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
    }
    if (this.remision == false &&
      this.contigo == false &&
      this.vigentes == false &&
      this.pension65 == false &&
      this.essalud == false &&
      this.planilla == false &&
      this.cotizacion == false &&
      this.jubilacion == false &&
      this.beneficios == false) {
        this.mensajeError = 'Favor de seleccionar un tipo de informe.';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
    }
    this.Bremision = this.remision;
    this.Bvigentes = this.vigentes;
    this.Bessalud = this.essalud;
    this.Bplanilla = this.planilla;
    this.Bbeneficios = this.beneficios;
    this.Bcontigo = this.contigo;
    this.Bpension65 = this.pension65;
    this.Bcotizacion = this.cotizacion;
    this.Bjubilacion = this.jubilacion;

    if (this.cotejoContigo == false){
      this.mensajeError = 'No ha subido el archivo de cotejo para "Programa CONTIGO".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
    }
    if ( this.cotejoPension == false){
      this.mensajeError = 'No ha subido el archivo de cotejo para "Programa PENSIÓN 65".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
    }
    this.service.BorrarArchivos()
    .then( (resp: any) => {
      if(resp.result == true){
        this.generarArchivos();
      }
      else{
        this.mensajeError = 'Error al eliminar archivos.';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }

    });
  }
  generarArchivos(){
    this.contador = 0;
    this.spinner.show();
    if (this.vigentes === true) {
      this.service.PolizasSeguroVigente(this.fecha)
    .then( (resp: any) => {
      let archivos;
      this.contador = this.contador + 1; 
      this.NombreZip = 'Polizas de seguro vigentes'
      archivos = resp.result;
      if(this.archivo != null){
        for(var i = 0; i < archivos.length ; i++){
          if (archivos[i] != '-1')
          {
            this.archivosDescarga.push(archivos[i])
          };
      }
        this.Bvigentes = false;
        this.generarZIP();
      }
      else{
        this.spinner.hide();
        this.mensajeError = 'Error al generar archivo "Información sobre pólizas de seguro vigentes".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }

    });
    }
    if (this.beneficios === true) {
      let d0fecha = this.fecha + '-01';
      this.service.EstadisticaBeneficiarios(d0fecha)
    .then( (resp: any) => {
      this.contador = this.contador + 1; 
      this.NombreZip = 'Estadistica de Beneficiarios'

      let archivos;
      archivos = resp.result;
      if(this.archivo != null){
        for(var i = 0; i < archivos.length ; i++){
          if (archivos[i] != '-1')
          {
            this.archivosDescarga.push(archivos[i])
          };
      }
        this.Bbeneficios = false;
        this.generarZIP();
      }
      else{
        this.spinner.hide();
        this.mensajeError = 'Error al generar archivo "Información estadística de beneficios".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }

    });
    }

    if (this.essalud === true) {
      this.service.ReportesEssalud(this.fecha)
    .then( (resp: any) => {
      this.contador = this.contador + 1; 
      this.NombreZip = 'Archivos EsSalud'

      this.archivo = resp;
      if(this.archivo != null){
        for(var i = 0; i < resp.length ; i++){
          this.archivosDescarga.push(resp[i]);
      }
        //this.archivosDescarga.push(this.archivo);
        this.Bessalud = false;
        this.generarZIP();
      }
      else{
        this.spinner.hide();
        this.mensajeError = 'Error al generar archivo "Archivo para Essalud".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }

    });
    }

    if (this.cotizacion === true) {
      this.service.ReportesCotizacion(this.fecha)
    .then( (resp: any) => {
      this.contador = this.contador + 1; 
      this.NombreZip = 'Planilla Pago EsSalud'
      this.archivo = resp;
      if(this.archivo != null){
        /*for(var i = 0; i < resp.length ; i++){
          this.archivosDescarga.push(resp[i]);
      }*/
        this.archivosDescarga.push(resp.result);
        this.Bcotizacion = false;
        this.generarZIP();
      }
      else{
        this.spinner.hide();
        this.mensajeError = 'Error al generar archivo "Planilla de Pago de Essalud".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }

    });
    }
    if (this.jubilacion === true) {
      this.service.ReportesJubilacion(this.fecha)
    .then( (resp: any) => {
      this.contador = this.contador + 1; 
      this.NombreZip = 'Reporte Jubilaciones'
      let archivos;
      archivos = resp.result;
      if(this.archivo != null){
        for(var i = 0; i < archivos.length ; i++){
          if (archivos[i] != '-1')
          {
            this.archivosDescarga.push(archivos[i])
          };
      }
        //this.archivosDescarga.push(resp.result);
        this.Bjubilacion = false;
        this.generarZIP();
      }
      else{
        this.spinner.hide();
        this.mensajeError = 'Error al generar archivo "Pagos a los Pensionistas de Jubilación".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }
    });
    }
    if (this.planilla === true) {
      this.service.ReportesPensionSBS(this.fecha)
    .then( (resp: any) => {
      this.contador = this.contador + 1; 
      this.NombreZip = 'Planilla Pago Pensiones'
      this.archivo = resp.result;
      if(this.archivo != ""){
        this.archivosDescarga.push(this.archivo);
        this.Bplanilla = false;
        this.generarZIP();
      }
      else{
        this.spinner.hide();
        this.mensajeError = 'Error al generar archivo "Planilla de Pago de Pensiones".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }

    });
    }
    if (this.remision === true) {
      let d0fecha = this.fecha + '-01';
      this.service.ReporteRemision(d0fecha)
    .then( (resp: any) => {
      this.contador = this.contador + 1; 
      this.NombreZip = 'Informacion de tasa de Cotizacion'
      let archivos;
      archivos = resp.result;
      if(this.archivo != null){
        for(var i = 0; i < archivos.length ; i++){
          if (archivos[i] != '-1')
          {
            this.archivosDescarga.push(archivos[i])
          };
      }
        this.Bremision = false;
        this.generarZIP();
      }
      else{
        this.spinner.hide();
        this.mensajeError = 'Error al generar archivo "Remisión de información referida a las tasas de Cotización de Pensiones".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }

    });
    }
    if (this.contigo){
      this.creaArchivoCotejo();
    }
    if (this.pension65){
      this.crearArchivoPension65();
    }
  }
  generarZIP(){
    if (this.Bremision == false &&
      this.Bcontigo == false &&
      this.Bvigentes == false &&
      this.Bpension65 == false &&
      this.Bessalud == false &&
      this.Bplanilla == false &&
      this.Bcotizacion == false &&
      this.Bjubilacion == false &&
      this.Bbeneficios == false) {

        if(this.contador > 1)
          this.NombreZip = 'Reportes';
          this.archivosDescarga.push(this.NombreZip);
          this.archivosDescarga.push(this.fecha);
        this.service.CrearZip(this.archivosDescarga)
    .then( (resp: any) => {
      this.archivo = resp.result;
      this.spinner.hide();
      this.limpiar();

      var blob = this.service.DescargarZIP(this.archivo).subscribe(res=>{
        FileSaver.saveAs(res,this.archivo);

      }, err=>{
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
    });
    });
    }
  }
  generarZIP65(){
    if (this.Bremision == false &&
      this.Bcontigo == false &&
      this.Bvigentes == false &&
      this.Bpension65 == false &&
      this.Bessalud == false &&
      this.Bplanilla == false &&
      this.Bcotizacion == false &&
      this.Bjubilacion == false &&
      this.Bbeneficios == false) {

        if(this.contador > 1)
          this.NombreZip = 'Reportes';
          this.archivosDescarga.push(this.NombreZip);
          this.archivosDescarga.push(this.fecha);
        this.service.CrearZip65(this.archivosDescarga)
    .then( (resp: any) => {
      this.archivo = resp.result;
      this.spinner.hide();
      this.limpiar();

      var blob = this.service.DescargarZIP65(this.archivo).subscribe(res=>{
        FileSaver.saveAs(res,this.archivo);

      }, err=>{
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
    });
    });
    }
  }
  selectAll() {
    this.remision = true;
    this.contigo = true;
    this.vigentes = true;
    this.pension65 = true;
    this.essalud = true;
    this.planilla = true;
    this.beneficios = true;
    this.cotizacion = true;
    this.jubilacion = true;
  }

  limpiar() {
    this.remision = false;
    this.contigo = false;
    this.vigentes = false;
    this.pension65 = false;
    this.essalud = false;
    this.planilla = false;
    this.beneficios = false;
    this.cotizacion = false;
    this.jubilacion = false;
    this.selectedAll= false;
    this.selectedFiles = null;
    this.selectedFiles2 = null;
    this.fileName = "";
    this.fileName2 = "";
    this.fileNameArch = "";
    this.fileNameArch2 = "";
    this.archivosDescarga = [];
    this.Bpension65 = false;
    this.Bcontigo = false;
    this.Bcotizacion = false;
    this.Bjubilacion = false;
    this.fecha =  moment(this.hoy).subtract(1,'months').format('YYYY-MM');
    this.cotejoContigo = true;
    this.cotejoPension = true;
  }
  limpiar2() {
    this.remision = false;
    this.contigo = false;
    this.vigentes = false;
    this.pension65 = false;
    this.essalud = false;
    this.planilla = false;
    this.beneficios = false;
    this.cotizacion  = false;
    this.jubilacion = false;
    this.selectedAll= false;
    this.selectedFiles = null;
    this.selectedFiles2 = null;
    this.fileName = "";
    this.fileName2 = "";
    this.fileNameArch = "";
    this.fileNameArch2 = "";
    this.archivosDescarga = [];
    this.Bpension65 = false;
    this.Bcontigo = false;
    this.cotejoContigo = true;
    this.cotejoPension = true;
  }
  valor(event){
    if (this.remision == true &&
      this.contigo == true &&
      this.vigentes == true &&
      this.pension65 == true &&
      this.essalud == true &&
      this.planilla == true &&
      this.cotizacion == true &&
      this.jubilacion == true &&
      this.beneficios == true) {
      this.selectedAll= true;
    }

    switch(event.target.name) {
      case "selectedAll": {
        if (event.target.checked == true)
        {
          this.remision = true;
          this.contigo = true;
          this.vigentes = true;
          this.pension65 = true;
          this.essalud = true;
          this.planilla = true;
          this.beneficios = true;
          this.cotizacion = true;
          this.jubilacion = true;
          this.Bcontigo = true;
          this.Bpension65 = true;
          this.cotejoContigo = false;
          this.cotejoPension = false;
        }
        else
        {
          this.limpiar2();
        }
        break;
      }
      case "remision": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
        }
         break;
      }
      case "contigo": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
          this.Bcontigo = false;
          this.selectedFiles = null;
          this.fileName = "";
          this.fileNameArch = "";
          this.cotejoContigo = true;
        }
        else
        {
          this.Bcontigo = true;
          this.cotejoContigo = false;
        }
         break;
      }
      case "vigentes": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
        }
         break;
      }
      case "pension65": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
          this.Bpension65 = false;
          this.selectedFiles2 = null;
          this.fileName2 = "";
          this.fileNameArch2 = "";
          this.cotejoPension = true;
        }
        else
        {
          this.Bpension65 = true;
          this.cotejoPension = false;
        }
         break;
      }
      case "essalud": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
        }
         break;
      }
      case "cotizacion": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
        }
         break;
      }
      case "jubilacion": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
        }
         break;
      }
      case "planilla": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
        }
         break;
      }
      case "beneficios": {
        if (event.target.checked==false)
        {
          this.selectedAll= false;
        }
         break;
      }
      default: {

         break;
      }
    }

    //this.actualizarConsulta();
  }
  mostrarAlertaError(pTitle: string, pText: string){
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'error',
      allowOutsideClick: false
    });
  }

  selectedFiles: FileList = null;
  fileName: string = "";
  fileNameArch: string = "";
  detectFiles(event) {
    this.spinner.show();
    this.selectedFiles = event.target.files;
    this.fileName = "";
    if (this.selectedFiles.length > 0) {
      if (this.selectedFiles[0].name.indexOf(".xls") < 0 && this.selectedFiles[0].name.indexOf(".xlsx") < 0 ) {
        this.fileNameArch = "";
        this.spinner.hide();
        Swal.fire({ title: 'ERROR', text: "El archivo seleccionado no es valido", icon: 'error', allowOutsideClick: false });
      } else {
        this.fileName = this.selectedFiles[0].name;
        var archivoCotejo = this.selectedFiles[0];

        if(archivoCotejo!=undefined){
          this.serviceRepoEssalud.ArchivoCotejo(archivoCotejo).then((resp:any)=>{
            console.log(resp.Error);
            if(resp.Error == 0){
              Swal.fire({ title: 'CARGA EXITOSA', text: resp.Msj, icon: 'success', allowOutsideClick: false });
              this.cotejoContigo = true;
            }
              else{
              Swal.fire({ title: 'ERROR', text: resp.Msj + '...  intente cargar nuevamente', icon: 'error', allowOutsideClick: false });
            this.cotejoContigo = false;
            selectedFiles: FileList = null;
            this.fileName = "";
            this.fileNameArch = "";
            }
            this.spinner.hide();

          })
        }
      }
    }
  }

  selectedFiles2: FileList = null;
  fileName2: string = "";
  fileNameArch2: string = "";
  detectFilesPension(event) {
    this.spinner.show();
    this.selectedFiles2 = event.target.files;
    this.fileName2 = "";
    if (this.selectedFiles2.length > 0) {
      if (this.selectedFiles2[0].name.indexOf(".txt") < 0 ) {
        this.fileNameArch2 = "";
        this.spinner.hide();
        Swal.fire({ title: 'ERROR', text: "El archivo seleccionado no es valido", icon: 'error', allowOutsideClick: false });
      } else {
        this.fileName2 = this.selectedFiles2[0].name;
        var archivoPension = this.selectedFiles2[0];

        if(archivoPension!=undefined){
          this.serviceRepoEssalud.ArchivoPension(archivoPension).then((resp:any)=>{
            if(resp.Error == 0){
              Swal.fire({ title: 'CARGA EXITOSA', text: resp.Msj, icon: 'success', allowOutsideClick: false });
              this.cotejoPension = true;
            }
              else{
              Swal.fire({ title: 'ERROR', text: resp.Msj + '...  intente cargar nuevamente', icon: 'error', allowOutsideClick: false });
            this.cotejoPension = false;
            selectedFiles2: FileList = null;
            this.fileName2 = "";
            this.fileNameArch2 = "";
            }
            this.spinner.hide();
          }, err=>{Swal.fire({ title: 'ERROR', text: 'Ocurrio un error al cargar el archivo...  intente cargar nuevamente', icon: 'error', allowOutsideClick: false });
            //console.log(err)
          })         
        }
      }
    }
  }

  creaArchivoCotejo(){
    if(this.fileName !== ""|| this.fileNameArch !== "" || this.selectedFiles !== null){
      this.serviceRepoEssalud.ExcelCotejo(this.fecha).then((resp:any)=>{
        this.contador = this.contador + 1; 
        this.NombreZip = 'Programa CONTIGO'
        console.log(resp);
        this.archivosDescarga.push(resp.result);
        this.Bcontigo = false;
        this.generarZIP();
      })
    }
    else{
      console.log("No");

    }

  }

  crearArchivoPension65(){
    if(this.fileName2 !== ""|| this.fileNameArch2 !== "" || this.selectedFiles2 !== null){
      this.serviceRepoEssalud.ExcelPension65(this.fecha).then((resp:any)=>{
        this.contador = this.contador + 1; 
        this.NombreZip = 'Programa PENSION 65'
      console.log(resp);
      if(resp.error == 1 )
      Swal.fire({ title: 'ERROR', text: resp.Msj + '...  ocurrio un error al descargar los archivos Intente de nuevo', icon: 'error', allowOutsideClick: false });
      else
      {
        let archivos;
        archivos = resp.result;
        for(var i = 0; i < archivos.length ; i++){
          if (archivos[i] != '-1')
            this.archivosDescarga.push(archivos[i])
        }
        this.Bpension65 = false;
        this.generarZIP65();
      }
    })
    }
    else{
      console.log("No");

    }
  }

}
