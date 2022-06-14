import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {GenArPrimerosPagos} from 'src/app/models/GenArPrimerosPagos';
import Swal from 'sweetalert2';
import {NgForm, FormsModule} from '@angular/forms';
import { ArchivosPrimerosPagosService } from 'src/providers/archivos-primeros-pagos.service';
import { GeneracionArchivoPrimerosPagos } from '../../../interfaces/generacionArchivoPrimerosPagos.model';
import * as moment from 'moment';
import { Globales } from 'src/interfaces/globales';
import { ServiciofechaService } from 'src/providers/serviciodate.service';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import { generarAchivoXLSX } from 'src/providers/generarArchivoXLSX.service';

@Component({
  selector: 'app-archivoscontables-primerospagos',
  templateUrl: './archivoscontables-primerospagos.component.html',
  styleUrls: ['./archivoscontables-primerospagos.component.css']
})
export class ArchivoscontablesPrimerospagosComponent implements OnInit, AfterViewChecked {

  FecDesde = '';
  FecHasta = '';

  fechaActual = '';
  archivos=[];

  fechasBusqueda: GenArPrimerosPagos = new GenArPrimerosPagos();
  hoy = new Date();
  mensajeError = '';

  @ViewChild('formFechas', {static: false}) formFechas: NgForm;

  constructor(private _archivosPrimerosPagosService: ArchivosPrimerosPagosService,
    public titleService: Title,
    private _serviceFecha: ServiciofechaService, 
    private serviceLog:LoginService,
    private cdRef:ChangeDetectorRef,
    private generarAchivoXLSXService: generarAchivoXLSX) { }

  ngOnInit() {
    Globales.titlePag = 'Reporte de Vencimientos';
    this.titleService.setTitle(Globales.titlePag);
  }

  ngAfterViewChecked() {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  onSubmit(form: NgForm) {

    if (this.FecDesde == null || this.FecDesde=='') {
      this.mensajeError = 'Debe introducir la fecha de desde.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    else if(this.FecHasta == null || this.FecHasta=='')
    {
      this.mensajeError = 'Debe introducir la fecha de hasta.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    else if(this.FecHasta < this.FecDesde)
    {
      this.mensajeError = 'La fecha desde no puede ser mayor a la fecha hasta';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    else{
      console.log(this.FecDesde);
      Swal.showLoading();

      this._archivosPrimerosPagosService.consultaDocumento(this.FecDesde, this.FecHasta).then((resp:any)=>{
        //"CalculoPagosRecurrentes"+moment().format('YYYYMMDD').toString(), this.info.tipoCalculo ,this.info.FechaPago 

        this.archivos= resp.infoReporte;
        console.log(resp);
        console.log(resp.infoReporte);
        console.log(moment(this.FecDesde).format('dd-MM-YYYY').toString());
        this.generarAchivoXLSXService.generateExcelValidaciones(moment(this.FecDesde).format('dd-MM-YYYY').toString(),moment(this.FecHasta).format('dd-MM-YYYY').toString(),resp.infoReporteEstudios,resp.infoReporteHijos , resp.infoReporteSupervivencia, resp.infoReporteTutores, resp.FechaInicio, resp.FechaFin);
        //(periodo:any ,dataListEstudios: any,dataListHijos: any,dataListSupervivencia: any,dataListTutores: any)
      });
      Swal.close();


      
    }

  }

  mostrarAlertaError(pTitle: string, pText: string){
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'error',
      allowOutsideClick: false
    });
  }

  clear() {
    this.formFechas.reset();
    this.archivos=[];
  }
}
