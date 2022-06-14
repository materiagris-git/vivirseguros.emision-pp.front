//Provisionario definitivo""
import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { CalculoPagosRecurrenteModel,InfoCalculoPagosRecurrenteModel } from 'src/interfaces/CalculoPagosRecurrentes.model';
import { CalculoPagosRecurrentesService } from 'src/providers/Calculo-Pagos-Recurrentes.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { generarAchivoTXT } from 'src/providers/generarArchivoTXT.service';
import { generarAchivoXLSX } from 'src/providers/generarArchivoXLSX.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { LoginService } from 'src/providers/login.service';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-calculo-pagos-recurrentes',
  templateUrl: './calculo-pagos-recurrentes.component.html',
  styleUrls: ['./calculo-pagos-recurrentes.component.css']
})
export class CalculoPagosRecurrentesComponent implements OnInit, AfterViewChecked {
  [x: string]: any;

  info: CalculoPagosRecurrenteModel = {
    tipoCalculo: "",//Provisionario definitivo""
    Periodo: "",//txt_Periodo
    FechaPago: "",//txt_FecPago
    vlFecPago: "",//txt_FecCalculo o vlFecPago
    vgFecIniPag: "",
    vgFecTerPag: "",
    vgPerPago: "",
    vgFecPago: "",
    Usuario:"",
    txtFiltrarDetalle: ""
  };
InfoCalculo: [];
columnas=[];
busqueda:boolean = false;
@ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  constructor(private CalculoPagosRecurrentesService: CalculoPagosRecurrentesService,
    public titleService: Title,
    private router:Router,
    private cdRef:ChangeDetectorRef,
    private generarAchivoTXTService: generarAchivoTXT,
    private generarAchivoXLSXService: generarAchivoXLSX,
    private serviceLog:LoginService)
   {
     this.columnas = ['noPoliza','tipoPension','aDiferidos','aGarantizados','aEscalonados','montoTotal']
   }
   dataSourceCalculo: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    this.CalculoPagosRecurrentesService.postConsultaInfo().then( (resp: any) => {
      this.info = resp;
      this.info.tipoCalculo="P"
      if(resp.Periodo==null){
        this.volver();
      }
      Globales.titlePag = 'Cálculo de Pagos Recurrentes';
      this.titleService.setTitle(Globales.titlePag);
    });
  }
  
  Calcular(){
    this.busqueda =true;
    this.cdRef.detectChanges();
    Swal.showLoading();
    this.info.Usuario = localStorage.getItem('currentUser');
    this.CalculoPagosRecurrentesService.postCalcular(this.info).then( (resp: any) => {
      if(resp.data!="null"){
       
        this.CalculoPagosRecurrentesService.consultaCalculo(this.info).then((resp:any)=>{
          this.InfoCalculo = resp;
          this.dataSourceCalculo = new MatTableDataSource(resp);
          this.dataSourceCalculo.paginator = this.paginator;

        })
      }
       
       if (resp.mensaje!=null){
        Swal.fire({title: 'AVISO',text: resp.mensaje, icon: 'success', allowOutsideClick: false});
       }else{
        Swal.fire({title: 'ERROR',text: resp.mensajeE , icon: 'error', allowOutsideClick: false});
       }   
       
    });
  }

  GeneraReportes(){

    let archivos: string[] = null;
   
    var archivo = "";
    let fecha = moment(this.info.FechaPago).format('DD/MM/YYYY');
    let calculo = this.info.tipoCalculo;

    this.CalculoPagosRecurrentesService.CrearReportes(fecha, calculo)
    .then( (resp: any) => {
      archivos = resp.result;

      this.CalculoPagosRecurrentesService.CrearZip(archivos)
      .then( (resp: any) => {
        archivo = resp.result;
        
        var blob = this.CalculoPagosRecurrentesService.DescargarZIP(archivo).subscribe(res=>{  
          saveAs(res,archivo);
        }, err=>{
        //this.titulo = "Error";
        //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
        //this.toastr.error(this.mensaje, this.titulo);
        //console.log(err)
      });
      }); 
    });
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
  volver(){
    //ruta del calendrio para generar pagos
    this.router.navigate(['/MantencionCalendario']);
  }
  archivoTXT(){
    Swal.showLoading();
    if(this.InfoCalculo!=null){
      this.CalculoPagosRecurrentesService.consultaDocumento(this.info).then((resp:any)=>{
        this.generarAchivoTXTService.archivoCalculoPagosRecurrentes(resp,"CalculoPagosRecurrentes"+moment().format('YYYYMMDD').toString() );
      });
    }
    Swal.close();
  }
  archivoXLXS(){
    Swal.showLoading();
    if(this.InfoCalculo!=null){
      this.CalculoPagosRecurrentesService.consultaDocumento(this.info).then((resp:any)=>{
        this.generarAchivoXLSXService.generateExcelCalculoPagosRecurrentes(resp,"CalculoPagosRecurrentes"+moment().format('YYYYMMDD').toString(), this.info.tipoCalculo ,this.info.FechaPago );
      });
    }
    Swal.close();
  }
  archivoXLXSNoAceptados(){
    Swal.showLoading();
      this.CalculoPagosRecurrentesService.ConsultaNoAceptados(this.info).then((resp:any)=>{
        this.generarAchivoXLSXService.generateExcelCalculoPagosRecurrentesNoAceptados(resp,"CalculoPRnoAceptados"+moment().format('YYYYMMDD').toString(), this.info.tipoCalculo ,this.info.FechaPago );
      });
    Swal.close();
  }

  archivoPlanillaMensualRRVV(){
    Swal.showLoading();
      this.CalculoPagosRecurrentesService.ConsultaPlanillaMensualRRVV(this.info).then((resp:any)=>{
        let archivo = resp.result;
        
        var blob = this.CalculoPagosRecurrentesService.DescargarZIP(archivo).subscribe(res=>{  
          saveAs(res,archivo);
        }, err=>{
        this.titulo = "Error";
        this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
        this.toastr.error(this.mensaje, this.titulo);
        //console.log(err)
      });
      });
    Swal.close();
  }

}
