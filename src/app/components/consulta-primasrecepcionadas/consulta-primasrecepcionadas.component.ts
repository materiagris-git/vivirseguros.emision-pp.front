import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PrimasRecepcionadas, ConsultaPrimasRecepcionadas } from '../../../interfaces/primasRecepcionadas.model';
import Swal from 'sweetalert2';
import { PrimasRecepcionadasService } from '../../../providers/primasRecepcionadas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-consulta-primasrecepcionadas',
  templateUrl: './consulta-primasrecepcionadas.component.html',
  styleUrls: ['./consulta-primasrecepcionadas.component.css']
})
export class ConsultaPrimasrecepcionadasComponent implements OnInit {

  dataPrima: PrimasRecepcionadas = {
    FechaDesde: '',
    FechaHasta: '',
    Traspasada: 'T',
    lstConsultaPrimas: []
  };

  validaForm = true;
  mensajeError = '';
  columnas = [];

  primas: ConsultaPrimasRecepcionadas[] = [];
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  constructor( private primasService: PrimasRecepcionadasService, public titleService: Title, ) {
    this.columnas = ['numPol','cuspp','afiliado','dni', 'direccion','distrito']
   }
   dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    Globales.titlePag = 'Consulta de Recepción de Primas';
    this.titleService.setTitle(Globales.titlePag);
    this.dataPrima.FechaDesde = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD');
    this.dataPrima.FechaHasta = moment(new Date()).format('YYYY-MM-DD');
  }

  consultarPolizas(form: NgForm) {

    if ( (new Date(this.dataPrima.FechaDesde)) > (new Date(this.dataPrima.FechaHasta)) ) {
      this.mensajeError = 'Fecha mínima incorrecta, es mayor a la Fecha máxima.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if ( (new Date(this.dataPrima.FechaDesde)) < (new Date('1900-01-01')) ) {
      this.mensajeError = 'La Fecha ingresada es menor a la mínima que se puede ingresar (01/01/1900).';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if ( form.invalid ) {
      this.validaForm = false;
      this.mensajeError = 'Información no es válida. Favor de verificar.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    this.primasService.postConsulta(this.dataPrima)
                             .then( (resp: PrimasRecepcionadas) => {
                               this.primas = resp.lstConsultaPrimas;
                               this.dataSource = new MatTableDataSource(this.primas);
                               this.dataSource.paginator = this.paginator;
                             });

  }


  mostrarAlertaError(pTitle: string, pText: string) {
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'error',
      allowOutsideClick: false
    });
  }

  limpiarFormulario() {
    this.dataPrima.FechaDesde = '';
    this.dataPrima.FechaHasta = '';
    this.dataPrima.Traspasada = 'N';

    this.primas = null;
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataPrima.FechaDesde = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD');
    this.dataPrima.FechaHasta = moment(new Date()).format('YYYY-MM-DD');
  }

  exportar(){
    var archivo = "";

    this.primasService.getExportar()
    .then( (resp: any) => {
      archivo = resp.result;
     
      var blob = this.primasService.downloadFile(archivo).subscribe(res=>{  
        saveAs(res,archivo);
      }, err=>{
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
    });


    });

     
 
  }

}

