import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import Swal from 'sweetalert2';
import { Calcular } from 'src/interfaces/informecontrol-retencionjudicial.model';
import { InformecontrolRetjudicialService } from 'src/providers/informecontrol-retjudicial.service';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-informe-control-retencion-judicial',
  templateUrl: './informe-control-retencion-judicial.component.html',
  styleUrls: ['./informe-control-retencion-judicial.component.css']
})

export class InformeControlRetencionJudicialComponent implements OnInit {

  columnas = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  calculo: Calcular = new Calcular();
  FechaActual: "";
  listaConsulta = [];

  constructor(public titleService: Title,
              private _infControlRJService : InformecontrolRetjudicialService,
              private serviceLog:LoginService,
              private cdRef:ChangeDetectorRef) {
    this.columnas = ['numPol', 'tipPension', 'anniosDif', 'anniosGar', 'anniosEsc', 'documento', 'nombre', 'mtoTotal'];
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    Globales.titlePag = 'Informe Control Retención Judicial';
    this.titleService.setTitle(Globales.titlePag);
  }
  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  calcular(){
    if (this.FechaActual == undefined){
      Swal.fire({title: 'Advertencia',text: 'No es posible calcular con la fecha vacía.' , icon: 'warning', allowOutsideClick: false});
      return;
    }
    var fechaM = moment(this.FechaActual).format('YYYYMM').toString();
    if (fechaM == "Invalid date"){
      Swal.fire({title: 'Advertencia',text: 'No es posible calcular con la fecha vacía.' , icon: 'warning', allowOutsideClick: false});
      return;
    }

    this.calculo.Fecha = fechaM;
    this.calculo.Usuario = localStorage.getItem('currentUser');

    this._infControlRJService.postCalcular(this.calculo).then((resp: any) => {
      if (resp.data == "1"){
        Swal.fire({title: 'Error',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "2"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "3"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "4"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "5"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "6"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "7"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "8"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "9"){
        Swal.fire({title: 'Error',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "10"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "11"){
        Swal.fire({title: 'Error',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "12"){
        Swal.fire({title: 'Error',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "13"){
        Swal.fire({title: 'Error',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "14"){
        Swal.fire({title: 'Error',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "15"){
        Swal.fire({title: 'Error',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "16"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "17"){
        Swal.fire({title: 'Advertencia',text: resp.mensaje , icon: 'warning', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "18"){
        Swal.fire({title: 'Error',text: resp.mensaje , icon: 'error', allowOutsideClick: false});
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        return;
      } else if (resp.data == "19"){
        Swal.fire({title: 'Éxito',text: resp.mensaje , icon: 'success', allowOutsideClick: false});

        //Información de la tabla
        this._infControlRJService.getConsultaInfoTabla(this.calculo.Fecha).then((res: any) => {
          this.listaConsulta = res;
          
          if (this.listaConsulta.length == 0){
            this.dataSource = new MatTableDataSource([]);
            this.dataSource.paginator = this.paginator;
            setTimeout(function () {
              Swal.fire({title: 'Advertencia',text: "No se tienen retenciones Judiciales en la fecha ingresada.", icon: 'warning', allowOutsideClick: false});
           }, 3000);
          }else{
            this.dataSource = new MatTableDataSource(this.listaConsulta);
            this.dataSource.paginator = this.paginator;
          }
    
        });

        return;
      }
    });
    
  }

}
