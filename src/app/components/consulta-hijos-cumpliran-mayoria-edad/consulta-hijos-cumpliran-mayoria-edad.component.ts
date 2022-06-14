import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import Swal from 'sweetalert2';
import { ConsultaHijosCumpliranMayoriaEdadService } from 'src/providers/consulta-hijos-cumpliran-mayoria-edad.service';
import { generarAchivoXLSX } from 'src/providers/generarArchivoXLSX.service';
import * as moment from 'moment';

@Component({
  selector: 'app-consulta-hijos-cumpliran-mayoria-edad',
  templateUrl: './consulta-hijos-cumpliran-mayoria-edad.component.html',
  styleUrls: ['./consulta-hijos-cumpliran-mayoria-edad.component.css']
})
export class ConsultaHijosCumpliranMayoriaEdadComponent implements OnInit {
  Periodo: string;
  columnas = [];
  infoTabla = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(
    private generarAchivoXLSX: generarAchivoXLSX,
    private ConsultaHijosCumpliranMayoriaEdadService: ConsultaHijosCumpliranMayoriaEdadService,
    public titleService: Title,
    private serviceLog:LoginService) {
    this.columnas = [
      'N_Poliza',
      'N_Orden',
      'Tipo_Doc',
      'N_Documento',
      'Parentesco',
      'Sexo',
      'Beneficiario',
      'Fec_Nacimiento',
      'Edad',
      'Sit_Inv',
      'Ind_Est',
      'Est_Pension',
      'Tiene_CS',
      'Tiene_CE',
      'Fec_Devengue',
      'Fec_Primer_Pago'
    ];
   }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    Globales.titlePag = 'Consulta de hijos que cumplirán la mayoria de edad';
    this.titleService.setTitle(Globales.titlePag);
  }

  ngAfterViewChecked() {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
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
  consultar(){
    console.log(this.Periodo)
    if(this.Periodo != undefined && this.Periodo != ""){

      this.ConsultaHijosCumpliranMayoriaEdadService.postConsulta(this.Periodo).then( (resp: any) => {
        console.log(resp)
        if (resp.length > 0){
          this.infoTabla=resp;
          this.dataSource = new MatTableDataSource(this.infoTabla);
          this.dataSource.paginator = this.paginator;
        }else{
          Swal.fire({title: 'ERROR',text: "No se ha encontro información con el Periodo ingresado" , icon: 'error', allowOutsideClick: false});
        }
        //Swal.fire({title: 'AVISO',text: "Consulta realizada", icon: 'success', allowOutsideClick: false});
      });

    }else{
      Swal.fire({title: 'ERROR',text: "Debe Ingresar el Periodo" , icon: 'error', allowOutsideClick: false});
    }

  }
  generarArchivo(){

    Swal.showLoading();
    if(this.Periodo != undefined && this.Periodo != "" ){
      if(this.infoTabla.length>0){

        this.generarAchivoXLSX.generateExcelConsultaHijosCumpliranMayoriaEdad(this.infoTabla,"ConsultaHijos"+moment().format('YYYYMMDD').toString());
        Swal.close();
      }else{
        Swal.fire({title: 'ERROR',text: "No se ha encontro información con el Periodo ingresado." , icon: 'error', allowOutsideClick: false});
      }
      
      
    }else{
      Swal.fire({title: 'ERROR',text: "Debe Ingresar el Periodo." , icon: 'error', allowOutsideClick: false});
    }
  }
  limpiar(){
    this.Periodo="";
    this.infoTabla = [];
    this.dataSource = new MatTableDataSource(this.infoTabla);
    this.dataSource.paginator = this.paginator;
  }

}
