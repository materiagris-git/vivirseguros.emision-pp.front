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
import { CorreoInicioPoliza } from 'src/interfaces/CorreoInicioPoliza';
import { CorreoInicioPolizaService } from 'src/providers/CorreoInicioPoliza.service';

@Component({
  selector: 'app-correos-inicio-poliza',
  templateUrl: './correos-inicio-poliza.component.html',
  styleUrls: ['./correos-inicio-poliza.component.css']
})
export class CorreosInicioPolizaComponent implements OnInit, AfterViewChecked {

  [x: string]: any;
  
  banderaSelect: number = 1;
  info: CalculoPagosRecurrenteModel = {
    tipoCalculo: "",//Provisionario definitivo""
    Periodo: "",//txt_Periodo
    FechaPago: "",//txt_FecPago
    vlFecPago: "",//txt_FecCalculo o vlFecPago
    vgFecIniPag: "",
    vgFecTerPag: "",
    vgPerPago: "",
    vgFecPago: "",
    Usuario: "",
    txtFiltrarDetalle: ""
  };
InfoConsulta: CorreoInicioPoliza = new CorreoInicioPoliza();
columnas=[];
FecDesde = '';
FecHasta = '';
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
@ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  constructor(private CorreoInicioPolizaService: CorreoInicioPolizaService,
    public titleService: Title,
    private router:Router,
    private cdRef:ChangeDetectorRef,
    private generarAchivoTXTService: generarAchivoTXT,
    private generarAchivoXLSXService: generarAchivoXLSX,
    private serviceLog:LoginService,
    private spinner: NgxSpinnerService)
   {
     this.columnas = ['noPoliza','numIden','nombre','fec_pripago','telefono','correo','check']
   }
   dataSourceCalculo: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    Globales.titlePag = 'Pólizas Proximas a Pagarse';
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
  volver(){
    //ruta del calendrio para generar pagos
    this.router.navigate(['/MantencionCalendario']);
  } 

  buscarPolizas(){
    let fechadesde = new Date(this.FecDesde + '-02');
    let fechaactual = new Date();
    // var fecdesdeAño = fechadesde.getFullYear().toString();
    // var fecdesdeMes = (this.FecDesde.toString().substring(5,8));

    // var fecd = fecdesdeAño + fecdesdeMes;

    var fecd = (fechadesde.getFullYear().toString()+fechadesde.getMonth().toString()).toString();
    var fech = (fechaactual.getFullYear().toString()+fechaactual.getMonth().toString()).toString();

    if( fecd <= fech)
    {
      Swal.fire('Advertencia', 'La fecha desde no puede ser igual o menor al mes actual.', 'warning');
      this.mensaje('ADVERTENCIA', 'La fecha desde no puede ser igual o menor al mes actual', 'warning');
      return;
    }
    let desde = this.FecDesde.toString();
    let hasta = this.FecHasta.toString();

    if(desde > hasta)
    { 
      Swal.fire('Advertencia', 'La fecha hasta no puede ser menor a la desde.', 'warning');
      this.mensaje('ADVERTENCIA','La fecha hasta no puede ser menor a la desde','warning');
      return;
    }
    this.CorreoInicioPolizaService.consultaPoliza(desde, hasta).then((resp:any)=>{
      this.InfoConsulta = resp;
      console.log(resp);
      this.listaRegistros  = resp;
      this.dataSourceCalculo = new MatTableDataSource(resp);
      this.dataSourceCalculo.paginator = this.paginator;
      this.busqueda =true;
      this.listaRegistros = this.listaRegistros
      var correosenviados = this.listaRegistros.filter(x => x.BanderaEnvio == 0);
      var numcorreos = correosenviados.length;
      if (numcorreos <= 0)
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
      'ENVIANDO CORREOS',
      'Espere un momento mientras se envian los correos y se guarda la información.',
      'warning'
    );
    Swal.showLoading();
    this.listaRegistros[0].Usuario = localStorage.getItem('currentUser');
    let desde = this.FecDesde.toString();
    let hasta = this.FecHasta.toString();
      this.CorreoInicioPolizaService.guardaCorreo(this.listaRegistros).then((resp:any)=>{
        if(resp == 1){
          // Swal.close();
          Swal.fire('Alerta', 'Se han enviado correctamente los correos.', 'success');
          this.CorreoInicioPolizaService.consultaPoliza(desde, hasta).then((resp:any)=>{
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
          Swal.fire('Advertencia', 'Error al enviar correos. Favor de Revisar Log', 'warning');
        }
        
      });
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
    
    this.banderaSelect = this.banderaSelect == 1 ? 0: 1;
  }

  generarReporte(){
    let fechadesde = new Date(this.FecDesde + '-02');
    let fechaactual = new Date();
    var fecd = (fechadesde.getFullYear().toString()+fechadesde.getMonth().toString()).toString();
    var fech = (fechaactual.getFullYear().toString()+fechaactual.getMonth().toString()).toString();

    if( fecd <= fech)
    {
      Swal.fire('Advertencia', 'La fecha desde no puede ser igual o menor al mes actual.', 'warning');
      this.mensaje('ADVERTENCIA', 'La fecha desde no puede ser igual o menor al mes actual', 'warning');
      return;
    }
    let desde = this.FecDesde.toString();
    let hasta = this.FecHasta.toString();

    if(desde > hasta)
    { 
      Swal.fire('Advertencia', 'La fecha hasta no puede ser menor a la desde.', 'warning');
      this.mensaje('ADVERTENCIA','La fecha hasta no puede ser menor a la desde','warning');
      return;
    }
    this.contador = 0;
    this.spinner.show();
      this.CorreoInicioPolizaService.ReporteInicioPoliza(desde, hasta)
    .then( (resp: any) => {
      let archivos;
      this.contador = this.contador + 1; 
      this.NombreZip = 'Inicio de Pólizas'
      archivos = resp.result;
      if(archivos != null){
        for(var i = 0; i < archivos.length ; i++){
          if (archivos[0] != '-1')
          {
            this.archivosDescarga.push(archivos[i])
          };
      }
        this.generarZIP();
      }
      else{
        this.spinner.hide();
        this.mensajeError = 'Error al generar archivo "Reporte Inicio Pólizas".';
        this.mostrarAlertaError('ERROR', this.mensajeError);
        return;
      }

    });
  }

  generarZIP(){
        
      var blob = this.CorreoInicioPolizaService.DescargarZIP(this.archivosDescarga).subscribe(res=>{
        FileSaver.saveAs(res,this.archivosDescarga);
        this.spinner.hide();
      }, err=>{
        this.spinner.hide();
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
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

  mostrarAlertaError(pTitle: string, pText: string) {
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'error',
      allowOutsideClick: false
    });
  }

}
