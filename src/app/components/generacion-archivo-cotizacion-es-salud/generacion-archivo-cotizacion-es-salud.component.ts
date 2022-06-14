import { Component, OnInit } from '@angular/core';
import { generarAchivoTXT } from 'src/providers/generarArchivoTXT.service';
import { GeneracionArchivoCotizacionEsSaludService } from 'src/providers/generacion-archivo-cotizacion-es-salud.service';
import { LoginService } from 'src/providers/login.service';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-generacion-archivo-cotizacion-es-salud',
  templateUrl: './generacion-archivo-cotizacion-es-salud.component.html',
  styleUrls: ['./generacion-archivo-cotizacion-es-salud.component.css']
})
export class GeneracionArchivoCotizacionEsSaludComponent implements OnInit {
  tipoProceso: string;
  tipoPago: string;
  periodoDesde: string;
  periodoHasta: string;
  constructor(
    private generarAchivoTXT: generarAchivoTXT,
    private GeneracionArchivoCotizacionEsSaludService: GeneracionArchivoCotizacionEsSaludService,
    public titleService: Title,
    private serviceLog:LoginService
    ) { 

    }

  ngOnInit() {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.tipoProceso="D";
    this.tipoPago="R";
    this.periodoDesde="";
    this.periodoHasta="";
  }
  generarArchivo(){
    if(this.periodoDesde ==""){
        Swal.fire({title: 'ERROR',text: "Falta Ingresar Fecha Desde." , icon: 'error', allowOutsideClick: false}); 
        return;
    }
    if(this.periodoHasta ==""){
      Swal.fire({title: 'ERROR',text: "Falta Ingresar Fecha Hasta." , icon: 'error', allowOutsideClick: false}); 
      return;
    }
    if (moment(this.periodoDesde ) > moment(this.periodoHasta ) ){
      Swal.fire({title: 'ERROR',text: "La fecha inicio no puede ser mayor a la fecha fin." , icon: 'error', allowOutsideClick: false}); 
      return;
    }

    this.GeneracionArchivoCotizacionEsSaludService.postConsulta(this.tipoProceso,this.tipoPago,this.periodoDesde,this.periodoHasta).then( (resp: any) => {
      console.log(resp)      
      if (resp.mensaje == ""){
        this.generarAchivoTXT.archivoGeneracionArchivoCotizacionEsSalud(resp.info,"CotizacionEsSalud"+moment(this.periodoDesde).format('YYYYMMDD').toString());
        Swal.fire({title: 'AVISO',text: "La Exportación de Datos al Archivo ha sido Finalizada Exitosamente.", icon: 'success', allowOutsideClick: false})
      }else{
        Swal.fire({title: 'ERROR',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
      }
      //Swal.fire({title: 'AVISO',text: "Consulta realizada", icon: 'success', allowOutsideClick: false});
    });

  }
  limpiar(){
    this.tipoProceso="D";
    this.tipoPago="R";
    this.periodoDesde="";
    this.periodoHasta="";
  }

}
