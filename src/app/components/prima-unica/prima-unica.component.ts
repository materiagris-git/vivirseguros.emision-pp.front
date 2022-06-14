import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {NgForm} from '@angular/forms';
import { GenArPrimaUnica } from 'src/app/models/GenArPrimaUnica';
import Swal from 'sweetalert2';
import {ArchivosPrimaUnicaService } from 'src/providers/archivos-prima-unica.service';
import { GeneracionArchivoPrimaUnica } from '../../../interfaces/generacionArchivoPrimaUnica.model';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ServiciofechaService } from 'src/providers/serviciodate.service';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-prima-unica',
  templateUrl: './prima-unica.component.html',
  styleUrls: ['./prima-unica.component.css']
})
export class PrimaUnicaComponent implements OnInit, AfterViewChecked {

  FecDesde = "";
  FecHasta = "";
  FechaIni:"";
  FechaFin:"";
  archivos: GeneracionArchivoPrimaUnica[] = [{
    NUM_CASOS: 0,
    FEC_DESDE: '',
    FEC_HASTA: '',
    COD_USUARIOCREA: '',
    FEC_CREA: '',
    NUM_ARCHIVO: 0,
    HOR_CREA: ''
  }];
  fechasBusqueda: GenArPrimaUnica = new GenArPrimaUnica();
  hoy = new Date();

  @ViewChild('formFechas', {static: false}) formFechas: NgForm;

  intervalo: any;
  mensajeError = '';
  constructor(private _archivosPrimaUnicaService: ArchivosPrimaUnicaService,
              public titleService: Title,
              private _serviceFecha: ServiciofechaService, 
              private serviceLog:LoginService,
              private cdRef:ChangeDetectorRef) {
    this.intervalo = {
      FecDesde: "",
      FecHasta: ""
    }

  }
  ngOnInit() {
    this._archivosPrimaUnicaService.getArchivos()
                            .then( (resp: any) => {
                               this.archivos = resp;
                             });
    Globales.titlePag = 'Generación de Archivo Contable de Prima Única';
    this.titleService.setTitle(Globales.titlePag);
  }

  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  seleccionarFila(fecDesde: string, fecHasta: string) {
    fecDesde = this._serviceFecha.format(new Date(moment(fecDesde, 'DD-MM-YYYY').format()));
    fecHasta = this._serviceFecha.format(new Date(moment(fecHasta, 'DD-MM-YYYY').format()));
    this.FecDesde = fecDesde;
    this.FecHasta = fecHasta;

  }
  onSubmit(form: NgForm) {

    if ((new Date(this.fechasBusqueda.FecDesde)) > (new Date(this.fechasBusqueda.FecHasta))) {
      this.mensajeError = 'Fecha minima incorrecta, es mayor a la Fecha máxima.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if ((new Date(this.fechasBusqueda.FecDesde)) < (new Date('1900-01-01'))){
      this.mensajeError = 'La fecha ingresada es menor a la minima que se puede ingresar (01/01/1900).';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    
    this.calcular();
  }

  mostrarAlertaError(pTitle: string, pText: string){
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'error',
      allowOutsideClick: false
    });
  }

  clear() { this.formFechas.reset(); }

  calcular(){
    console.log("calculando")
    //this.actualizarConsulta();

    Swal.showLoading(); 
    let FechaIni = this.FecDesde;
    let FechaFin = this.FecHasta;
    this._archivosPrimaUnicaService.postGenerarArchContDiario(this.FechaIni, this.FechaFin)
    .then( (resp: any) => {
      let archivoContable = resp.pathExcel;
                      
      var blob2 = this._archivosPrimaUnicaService.DescargarContables(archivoContable).subscribe(res=>{  
        saveAs(res,archivoContable);
      }, err=>{
        console.log(err)
    });
        Swal.close();
    });

  }

}
