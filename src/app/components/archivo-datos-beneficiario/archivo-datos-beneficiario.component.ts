import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { archivo_datos_beneficiario } from 'src/providers/archivo-datos-beneficiario.service';
import { GenArDatosBeneficiarios } from 'src/interfaces/archivo-datos-beneficiario.model';
import { generarAchivoCSV } from 'src/providers/generarArchivoCSV.service';
import { generarAchivoXLSX } from 'src/providers/generarArchivoXLSX.service';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import Swal from 'sweetalert2';
import { LoginService } from 'src/providers/login.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-archivo-datos-beneficiario',
  templateUrl: './archivo-datos-beneficiario.component.html',
  styleUrls: ['./archivo-datos-beneficiario.component.css']
})

export class ArchivoDatosBeneficiarioComponent implements OnInit {
  jubilacion: string="04,05";
  invalidesP: string = '07';
  invalidesT: string = '06';
  sobrevivencia: string = '08,09,10,11,12';
  tipPension: string="true";
  dolaresAj: string="04";
  dolares: string="03";
  solesAj: string="02";
  solesIn: string="01";
  simple: string="1";
  garantizada: string="3";
  si: string="02";
  no: string="01";
  pensiones: any[];
  monedas: any[];
  modalidades: any[];
  diferidos: any[];
  ajuste: any[];
  consulta: GenArDatosBeneficiarios = {
    tipoPension:"04,05,06,07,08,09,10,11,12",
    tipoMoneda:"01,02,03,04",
    tipoModalidad:"1,3",
    yearDiferido:"01,02",
    FechaActual: moment().format('YYYY-MM-DD').toString()
  };
  FechaActual="";

  constructor(private archivo_datos_beneficiarioService: archivo_datos_beneficiario,
              private generarAchivoCSVService: generarAchivoCSV,
              public titleService: Title,
              private generarAchivoXLSXService: generarAchivoXLSX,
              private serviceLog:LoginService,
              private cdRef:ChangeDetectorRef
              ) { }

  ngOnInit() {
    Globales.titlePag = 'Generación de Archivo de Datos de Beneficiario';
    this.titleService.setTitle(Globales.titlePag);
    this.FechaActual = moment().format('DD-MM-YYYY').toString();
  }
  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }
  calcular(){
    if (this.consulta.tipoPension == ""){
      Swal.fire({title: 'Advertencia',text: 'Seleccionar por lo menos un Tipo de Pensión para la generacion del Archivo.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if (this.consulta.tipoMoneda == ""){
      Swal.fire({title: 'Advertencia',text: 'Seleccionar por lo menos un Tipo de Moneda para la generacion del Archivo.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if (this.consulta.tipoModalidad == ""){
      Swal.fire({title: 'Advertencia',text: 'Seleccionar por lo menos un Tipo de Modalidad para la generacion del Archivo.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if (this.consulta.yearDiferido == ""){
      Swal.fire({title: 'Advertencia',text: 'Seleccionar por lo menos un Tipo en Años Diferidos para la generacion del Archivo.' , icon: 'warning', allowOutsideClick: false});
      return;
    } 

    this.archivo_datos_beneficiarioService.postConsultaGnral(this.consulta)
                            .then( (resp: any) => {
                              var archivo = resp.result;
     
                              var blob = this.archivo_datos_beneficiarioService.downloadFile(archivo).subscribe(res=>{  
                                saveAs(res,archivo);
                              }, err=>{
                              //this.titulo = "Error";
                              //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
                              //this.toastr.error(this.mensaje, this.titulo);
                              //console.log(err)
                            });
                            });
  }


  actualizarConsulta() {
    this.tipPension ="";
    this.consulta.tipoMoneda = "";
    this.consulta.tipoModalidad = "";
    this.consulta.yearDiferido = "";
    this.pensiones=[];
    this.monedas=[];
    this.modalidades=[];
    this.diferidos=[];
    this.ajuste=[];
    if (this.jubilacion != "")
    {this.pensiones.push(this.jubilacion);}
    if (this.invalidesP != "")
    {this.pensiones.push(this.invalidesP);}
    if (this.invalidesT != "")
    {this.pensiones.push(this.invalidesT);}
    if (this.sobrevivencia != "")
    {this.pensiones.push(this.sobrevivencia);}

    if (this.solesIn != "")
    {this.monedas.push(this.solesIn);}
    if (this.solesAj != "")
    {this.monedas.push(this.solesAj);}
    if (this.dolares != "")
    {this.monedas.push(this.dolares);}
    if (this.dolaresAj != "")
    {this.monedas.push(this.dolaresAj);}

    if (this.simple != "")
    {this.modalidades.push(this.simple);}
    if (this.garantizada != "")
    {this.modalidades.push(this.garantizada);}

    if (this.si != "")
    {this.diferidos.push(this.si);}
    if (this.no != "")
    {this.diferidos.push(this.no);}

    this.consulta.tipoPension = this.pensiones.join(',');
    this.consulta.tipoMoneda = this.monedas.join(',');
    this.consulta.tipoModalidad = this.modalidades.join(',');
    this.consulta.yearDiferido = this.diferidos.join(',');

    // console.log(this.consulta);

  }

  valor(event){

    switch(event.target.name) {
      case "jubilacion": {
        if (event.target.checked==true)
        {
          this.jubilacion = event.target.value;
        }
        else{this.jubilacion=''}
         break;
      }
      case "invalidesP": {
        if (event.target.checked==true)
        {
        this.invalidesP = event.target.value;
        }
        else{this.invalidesP=''}
         break;
      }
      case "invalidesT": {
        if (event.target.checked==true)
        {
        this.invalidesT = event.target.value;
        }
        else{this.invalidesT=''}
         break;
      }
      case "sobrevivencia": {
        if (event.target.checked==true)
        {
        this.sobrevivencia = event.target.value;
        }
        else{this.sobrevivencia=''}
         break;
      }
      case "solesIn": {
        if (event.target.checked==true)
        {
        this.solesIn = event.target.value;
        }
        else{this.solesIn=''}
         break;
      }
      case "solesAj": {
        if (event.target.checked==true)
        {
        this.solesAj = event.target.value;
        }
        else{this.solesAj=''}
         break;
      }
      case "dolares": {
        if (event.target.checked==true)
        {
        this.dolares = event.target.value;
        }
        else{this.dolares=''}
         break;
      }
      case "dolaresAj": {
        if (event.target.checked==true)
        {
        this.dolaresAj = event.target.value;
        }
        else{this.dolaresAj=''}
         break;
      }
      case "simple": {
        if (event.target.checked==true)
        {
        this.simple = event.target.value;
        }
        else{this.simple=''}
         break;
      }
      case "garantizada": {
        if (event.target.checked==true)
        {
        this.garantizada = event.target.value;
        }
        else{this.garantizada=''}
         break;
      }
      case "si": {
        if (event.target.checked==true)
        {
        this.si = event.target.value;
        }
        else{this.si=''}
         break;
      }
      case "no": {
        if (event.target.checked==true)
        {
        this.no = event.target.value;
        }
        else{this.no=''}
         break;
      }
      default: {

         break;
      }
    }

    this.actualizarConsulta();
  }
}
