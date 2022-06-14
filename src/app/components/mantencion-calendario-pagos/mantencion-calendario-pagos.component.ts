import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { MantencionCalendarioPagosService } from 'src/providers/mantencion-calendario-pagos.service';
import { consultaCalendarioPagosModel,Informacion_Inicio,Informacion_Tabla} from 'src/interfaces/mantencion-calendario-pagos.model';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { generarAchivoTXT } from 'src/providers/generarArchivoTXT.service';
import * as FileSaver from 'file-saver';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-mantencion-calendario-pagos',
  templateUrl: './mantencion-calendario-pagos.component.html',
  styleUrls: ['./mantencion-calendario-pagos.component.css'],
})
export class MantencionCalendarioPagosComponent implements OnInit {
  info: consultaCalendarioPagosModel = {
    Periodo: "",
    Fecha_Pago_Recurrente:"",
    Estado:""
  };

  columnas = [];
  infoTabla = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private generarAchivoTXTService: generarAchivoTXT,
    private MantencionCalendarioPagosService: MantencionCalendarioPagosService,
    public titleService: Title,
    private serviceLog:LoginService ) {
    this.columnas = [
      'item',
      'mesPago',
      'fecPagRec',
      'fecCalRec',
      'estado',
      'acciones'
    ];
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    Globales.titlePag = 'Mantenedor de Calendario de Pagos - Pagos Recurrentes';
    this.titleService.setTitle(Globales.titlePag);
    this.info.Periodo = moment(new Date()).format('YYYY');
    this.consultar();
  }
  consultar(){
    if(this.info.Periodo != ""){

      this.MantencionCalendarioPagosService.postConsulta(this.info.Periodo).then( (resp: any) => {
        //console.log(resp)
        for (let index = 0; index < resp.infoTabla.length; index++) {
          resp.infoTabla[index].Mes_Pago=  moment(resp.infoTabla[index].Mes_Pago).format('MM/YYYY')
          resp.infoTabla[index].Fecha_Pago_Recurrente_M= moment(resp.infoTabla[index].Fecha_Pago_Recurrente).format('DD/MM/YYYY')
          resp.infoTabla[index].Fecha_Calculo_Pago_Recurrente= moment(resp.infoTabla[index].Fecha_Calculo_Pago_Recurrente).format('DD/MM/YYYY')
          if (resp.infoTabla[index].Estado == 'C'){
            resp.infoTabla[index].Estado_M ='Cerrado'
          }
          if(resp.infoTabla[index].Estado == 'P'){
            resp.infoTabla[index].Estado_M ='Provisional'
          }
          if(resp.infoTabla[index].Estado == 'A'){
            resp.infoTabla[index].Estado_M ='Abierto'
          }
          resp.infoTabla[index].Editar_E =false;

          resp.infoTabla[index].Estado_Activable =resp.infoTabla[index].Estado;
          if(index-1>=0){
            if (resp.infoTabla[index-1].Estado_Activable =='C' && resp.infoTabla[index].Estado_Activable =='A' || resp.infoTabla[index].Estado_Activable =='P'){
              resp.infoTabla[index-1].Estado_Activable ='A'
            }
          }
          
        }
        this.infoTabla=resp.infoTabla;
        this.dataSource = new MatTableDataSource(this.infoTabla);
        this.dataSource.paginator = this.paginator;
        //Swal.fire({title: 'AVISO',text: "Consulta realizada", icon: 'success', allowOutsideClick: false});
      });

    }else{
      Swal.fire({title: 'ERROR',text: "Debe Ingresar el Periodo de Pago." , icon: 'error', allowOutsideClick: false});
    }

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

  onRowEditInit(data: any ) {
    for (let index = 0; index < this.infoTabla.length; index++) {
        this.infoTabla[index].Editar= false;
        this.infoTabla[index].Editar_E= false;

        this.infoTabla[index].Estado_Activable =this.infoTabla[index].Estado;
        if(index-1>=0){
          if (this.infoTabla[index-1].Estado_Activable =='C' && this.infoTabla[index].Estado_Activable =='A' || this.infoTabla[index].Estado_Activable =='P'){
            this.infoTabla[index-1].Estado_Activable ='E'
          }
        }
    }
    //´permite editar la fecha  a todos menos al cerrado
    if (data.Estado!='C'){
      data.Editar=true;
        this.info.Fecha_Pago_Recurrente=data.Fecha_Pago_Recurrente;
    }
    this.info.Estado=data.Estado;
    //si tiene estatus A permite cambiar el estado
    //console.log("valor bandera: "+data.Estado_Activable )
    if (data.Estado_Activable =='E'){
      data.Editar_E=true;
      this.info.Estado='A';//data.Estado;
      //console.log("estado mod: "+data.Estado )
      data.Editar=true;
      this.info.Fecha_Pago_Recurrente=data.Fecha_Pago_Recurrente;
    }
  }
  onRowEditSave(data: any ) {
    //console.log("valor bandera guardar: "+data.Estado )
    if (data.Estado!='C' ||data.Estado_Activable =='E'){
      data.Editar=false;
      data.Editar_E=false;
      //inicia el proceso de guardado :v
     this.MantencionCalendarioPagosService.postGuardar( data.Periodo , moment(this.info.Fecha_Pago_Recurrente ).format('YYYYMMDD') , this.info.Estado ).then( (resp: any) => {
        //console.log(resp)
        if (resp.mensaje!=null){
          Swal.fire({title: 'AVISO',text: resp.mensaje, icon: 'success', allowOutsideClick: false});
          data.Fecha_Pago_Recurrente = this.info.Fecha_Pago_Recurrente;
          data.Fecha_Pago_Recurrente_M= moment(this.info.Fecha_Pago_Recurrente ).format('DD/MM/YYYY');
          data.Estado =  this.info.Estado
          if (data.Estado == 'C'){
            data.Estado_M ='Cerrado'
          }
          if(data.Estado == 'P'){
            data.Estado_M ='Provisional'
          }
          if(data.Estado == 'A'){
            data.Estado_M ='Abierto'
          }
          for (let index = 0; index < this.infoTabla.length; index++) {
            this.infoTabla[index].Editar= false;
            this.infoTabla[index].Editar_E= false;
    
            this.infoTabla[index].Estado_Activable =this.infoTabla[index].Estado;
            if(index-1>=0){
              if (this.infoTabla[index-1].Estado_Activable =='C' && this.infoTabla[index].Estado_Activable =='A' || this.infoTabla[index].Estado_Activable =='P'){
                this.infoTabla[index-1].Estado_Activable ='E'
              }
            }
          }
        }else{
          Swal.fire({title: 'ERROR',text: resp.Error, icon: 'error', allowOutsideClick: false});
        }
      });
    }
  }
  onRowEditCancel(data: any) {
    data.Editar=false;
    data.Editar_E=false;
    //console.log("se cancela:"+data.Fecha_Pago_Recurrente);
  }
  generarArchivo() {
    Swal.showLoading();
    if(this.info.Periodo != ""){
      this.MantencionCalendarioPagosService.generaArchivoPDF(this.info.Periodo).then( (resp: any) => {
        //FileSaver.saveAs(resp.Archivo,resp.Nombre);
        var blob = this.MantencionCalendarioPagosService.downloadFile(resp.Nombre).subscribe(res=>{
          FileSaver.saveAs(res,resp.Nombre);
        }, err=>{
          console.log(err)
        });
      });
      Swal.close();
    }else{
      Swal.fire({title: 'ERROR',text: "Debe Ingresar el Periodo de Pago." , icon: 'error', allowOutsideClick: false});
    }


  }
  limpiar(){
    this.info.Periodo = "";
    this.dataSource = new MatTableDataSource([]);
  }

}
