import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { generarAchivoTXT } from 'src/providers/generarArchivoTXT.service';
import { generarAchivoXLSX } from 'src/providers/generarArchivoXLSX.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { LoginService } from 'src/providers/login.service';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { CalculoPagosRecurrenteModel,InfoCalculoPagosRecurrenteModel, InfoCActualizacionFecPagosRecurrent } from 'src/interfaces/CalculoPagosRecurrentes.model';
import { PagosSuspendidos } from 'src/interfaces/PagosSuspendidos';
import { PagosSuspendidosService } from 'src/providers/PagosSuspendidos.service';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
@Component({
  selector: 'app-pagos-suspendidos',
  templateUrl: './pagos-suspendidos.component.html',
  styleUrls: ['./pagos-suspendidos.component.css']
})
export class PagosSuspendidosComponent implements OnInit, AfterViewChecked {

  banderaSelect: number = 1;
InfoConsulta: PagosSuspendidos = new PagosSuspendidos();
columnas=[];
FecDesde = '';
FecHasta = '';
periodoMax = '';
date = '';
busqueda:boolean = false;
listaRegistros =[];
selectedFiles: FileList = null;
fileName: string = "";
fileNameArch: string = "";
cotejoContigo = true;
   cotejoPension = true;
   NombreZip = "";
   contador = 0;
   txtFiltrarDetalle = '';
   archivosDescarga: string[] = [];
   isDisabled1 = false;
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
  
@ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(private PagosSuspendidosService: PagosSuspendidosService,
    public titleService: Title,
    private router:Router,
    private cdRef:ChangeDetectorRef,
    private generarAchivoTXTService: generarAchivoTXT,
    private generarAchivoXLSXService: generarAchivoXLSX,
    private serviceLog:LoginService,
    private spinner: NgxSpinnerService,
    private _serviceFecha: ServiciofechaService) { 
      this.columnas = ['noPoliza','numIden','nombre','fec_fallecimiento','meses','monto','fec_pagoreal','check']
    }
    dataSourceCalculo: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    Globales.titlePag = 'Pólizas con Pago Suspendido';
    this.titleService.setTitle(Globales.titlePag);
    this.PagosSuspendidosService.postConsultaInfo().then( (resp: any) => {
      this.info = resp;
      this.info.tipoCalculo="P";
       this.date = resp.PeriodoMax;
      console.info(resp.Periodo);
      if(resp.Periodo==null){
        //this.volver();
      }
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

  buscarPolizas(){
    let fechadesde = new Date(this.FecDesde + '-02');
    let fechaactual = new Date();

    // var fecd = (fechadesde.getFullYear().toString()+fechadesde.getMonth().toString()).toString();
    // var fech = (fechaactual.getFullYear().toString()+fechaactual.getMonth().toString()).toString();

    // if( fecd < fech)
    // {
    //   Swal.fire('Advertencia', 'La fecha desde no puede ser igual o menor al mes actual.', 'warning');
    //   return;
    // }
    // let desde = this.FecDesde.toString();
    // let hasta = this.FecHasta.toString();

    // if(desde > hasta)
    // { 
    //   Swal.fire('Advertencia', 'La fecha hasta no puede ser menor a la desde.', 'warning');
    //   return;
    // }
    
    this.PagosSuspendidosService.consultaPoliza(this.info.Periodo).then((resp:any)=>{
      this.InfoConsulta = resp;
      //this.InfoConsulta.FechaPagoReal = this.InfoConsulta.FechaPagoReal === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.InfoConsulta.FechaPagoReal).format('LLLL')));
      console.log(resp);
      this.listaRegistros  = resp;
      this.dataSourceCalculo = new MatTableDataSource(resp);
      this.dataSourceCalculo.paginator = this.paginator;
      this.busqueda =true;
      this.listaRegistros = this.listaRegistros
      var fechasguardadas = this.listaRegistros.filter(x => x.BanderaEnvio == 0);
      var numfechas = fechasguardadas.length;
      if (numfechas <= 0)
      {
      this.isDisabled1 = true;
      }

    });
                
  }



  guardaFecha(){
    //console.log(hoy);
    //console.log(this.info.FechaPago);
    //console.log(hoy.format('YYYY-MM-DD'));
    
    Swal.fire(
      'GUARDANDO FECHAS',
      'Espere un momento mientras se guardan las Fechas de Pago Real.',
      'warning'
    );
    Swal.showLoading();
    this.listaRegistros[0].Usuario = localStorage.getItem('currentUser');
      this.PagosSuspendidosService.guardaFechas(this.listaRegistros).then((resp:any)=>{
        if(resp == 1){
          // Swal.close();
          Swal.fire('Alerta', 'Se han guardado correctamente las fechas.', 'success');
          this.PagosSuspendidosService.consultaPoliza(this.info.Periodo).then((resp:any)=>{
            this.listaRegistros = resp;
            console.log(resp);
            var correosenviados = this.listaRegistros.filter(x => x.BanderaEnvio == 0);
        var numcorreos = correosenviados.length;
        if (numcorreos <= 0)
        {
        this.isDisabled1 = true;
        }
            this.dataSourceCalculo = new MatTableDataSource(resp);
            this.dataSourceCalculo.paginator = this.paginator;

            this.banderaSelect = 1 
          });
          // Swal.close();
           
        }
        else
        {
          Swal.fire('Advertencia', 'Error al guardar las fechas de pago. Favor de Revisar Log', 'warning');
        }
        
      });
  }

  generarReporte(){
    Swal.showLoading();
      this.PagosSuspendidosService.ConsultaPlanillaMensualRRVV(this.info.Periodo).then((resp:any)=>{
        let archivo = resp.result;
        
        var blob = this.PagosSuspendidosService.DescargarZIP(archivo).subscribe(res=>{  
          saveAs(res,archivo);
        }, err=>{
          Swal.fire('Advertencia', 'Error al generar el reporte de pagos suspendidos. Favor de Revisar Log', 'warning');
        //console.log(err)
      });
      });
    Swal.close();
  }

  archivoXLXS(){
    Swal.showLoading();
    //let periodo = moment(this.info.FechaPago).format('DD/MM/YYYY');
    let tipoCalculo = "SUS";
      this.PagosSuspendidosService.consultaDocumento(tipoCalculo,this.info.Periodo).then((resp:any)=>{
        this.generarAchivoXLSXService.generateExcelCalculoPagosRecurrentes(resp,"CalculoPagosSuspendidos"+moment().format('YYYYMMDD').toString(), tipoCalculo ,this.info.FechaPago );
      });
    Swal.close();
  }

  archivoTXT(){
    Swal.showLoading();
    let periodo = moment(this.info.FechaPago).format('DD/MM/YYYY');
    let tipoCalculo = "SUS";
      this.PagosSuspendidosService.consultaDocumento(tipoCalculo,this.info.Periodo).then((resp:any)=>{
        this.generarAchivoTXTService.archivoCalculoPagosRecurrentes(resp,"CalculoPagosSuspendidos"+moment().format('YYYYMMDD').toString() );
      });
    Swal.close();
  }

  GeneraReportes(){

    let archivos: string[] = null;
   
    var archivo = "";
    let fecha = moment(this.info.FechaPago).format('DD/MM/YYYY');
    let calculo = "S";

    this.PagosSuspendidosService.CrearReportes(fecha, calculo)
    .then( (resp: any) => {
      archivos = resp.result;

      this.PagosSuspendidosService.CrearZip(archivos)
      .then( (resp: any) => {
        archivo = resp.result;
        
        var blob = this.PagosSuspendidosService.DescargarZIP(archivo).subscribe(res=>{  
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

  CambiaEstatus(bandera, iden){
    this.listaRegistros[iden -1].BanderaCheck = bandera == 1 ? 0 : 1;  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSourceCalculo.filteredData !== null && this.dataSourceCalculo.filteredData !== []) {
      this.dataSourceCalculo.filter = filterValue.trim().toLowerCase();
    }
  }

  CambiaSelect()
  {

    for (let i = 0; i < Object.keys(this.listaRegistros).length; i++) {
      if(this.listaRegistros[i].BanderaEnvio == 0)
      {
      if(this.banderaSelect == 1)
        this.listaRegistros[i].BanderaCheck = 0;
        else
      this.listaRegistros[i].BanderaCheck = 1;
    }
  }
    
    this.banderaSelect = this.banderaSelect == 0 ? 1: 0;
  }



}
