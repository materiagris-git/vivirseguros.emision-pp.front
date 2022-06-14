import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { ReporteHerederosService } from 'src/providers/reporte-herederos.service';
import * as FileSaver from 'file-saver';

import * as moment from 'moment';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-reporte-herederos',
  templateUrl: './reporte-herederos.component.html',
  styleUrls: ['./reporte-herederos.component.css']
})
export class ReporteHerederosComponent implements OnInit {
  selectedAll: any;
  remision = false;
  contigo = false;
  vigentes = false;
  pension65 = false;
  essalud = false;
  planilla = false;
  cotizacion = false;
  beneficios = false;

  Bremision = false;
  Bcontigo = false;
  Bvigentes = false;
  Bpension65 = false;
  Bessalud = false;
  Bplanilla = false;
  Bcotizacion = false;
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
    private service: ReporteHerederosService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    Globales.titlePag = 'Reporte Herederos';
    this.titleService.setTitle(Globales.titlePag);
    this.cdRef.detectChanges();
  }

  descargar() {
    
    this.Bcontigo = this.contigo;
   
    if (this.cotejoContigo == false){
      this.mensajeError = 'No ha subido el archivo de cotejo para "Programa CONTIGO".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
    }
    
     
        this.generarArchivos();
      

    
  }

  generarArchivos(){

    this.spinner.show();
      this.creaArchivoCotejo();
  }

  generarZIP(){
        if(this.contador >= 1)
          this.NombreZip = 'Reportes';
          this.archivosDescarga.push(this.NombreZip);
      this.archivo = this.archivosDescarga[0];
      this.spinner.hide();
      this.limpiar();

      var blob = this.service.DescargarZIP(this.archivo[0]).subscribe(res=>{
        FileSaver.saveAs(res,this.archivo[0]);

      }, err=>{
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
    });
  }

  limpiar() {
    this.contigo = false;
    this.selectedAll= false;
    this.selectedFiles = null;
    this.fileName = "";
    this.fileNameArch = "";
    this.archivosDescarga = [];
    this.Bcontigo = false;
    this.cotejoContigo = true;
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
          this.service.ArchivoCotejo(archivoCotejo).then((resp:any)=>{
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

  creaArchivoCotejo(){
    if(this.fileName !== ""|| this.fileNameArch !== "" || this.selectedFiles !== null){
      this.service.ExcelCotejo().then((resp:any)=>{
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
}
