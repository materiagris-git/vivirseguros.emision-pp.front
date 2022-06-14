import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { CalculoPagosRecurrenteModel,InfoCalculoPagosRecurrenteModel, InfoCActualizacionFecPagosRecurrent } from 'src/interfaces/CalculoPagosRecurrentes.model';
import { FechaPagosRecurrentesService } from 'src/providers/Fecha-Pagos-Recurrentes.service';
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

@Component({
  selector: 'app-fecha-pagos-recurrentes',
  templateUrl: './fecha-pagos-recurrentes.component.html',
  styleUrls: ['./fecha-pagos-recurrentes.component.css']
})
export class FechaPagosRecurrentesComponent implements OnInit, AfterViewChecked {
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
InfoCalculo: InfoCActualizacionFecPagosRecurrent = new InfoCActualizacionFecPagosRecurrent();
columnas=[];
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
@ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  constructor(private FechaPagosRecurrentesService: FechaPagosRecurrentesService,
    public titleService: Title,
    private router:Router,
    private cdRef:ChangeDetectorRef,
    private generarAchivoTXTService: generarAchivoTXT,
    private generarAchivoXLSXService: generarAchivoXLSX,
    private serviceLog:LoginService,
    private spinner: NgxSpinnerService)
   {
     this.columnas = ['noPoliza','numIden','montoBruto','montoEsSalud','montoTotal','Fecha']
   }
   dataSourceCalculo: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    this.FechaPagosRecurrentesService.postConsultaInfo().then( (resp: any) => {
      this.info = resp;
      this.info.tipoCalculo="P"
      if(resp.Periodo==null){
        this.volver();
      }
      Globales.titlePag = 'Actualizacion Fecha de Pago';
      this.titleService.setTitle(Globales.titlePag);

      this.FechaPagosRecurrentesService.consultaCalculo(this.info).then((resp:any)=>{
        this.InfoCalculo = resp;
        console.log(resp);
        this.listaRegistros  = resp;
        this.dataSourceCalculo = new MatTableDataSource(resp);
        this.dataSourceCalculo.paginator = this.paginator;
        this.busqueda =true;

      })
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

  detectFiles(event) {
    this.spinner.show();
    this.selectedFiles = event.target.files;
    this.fileName = "";
    if (this.selectedFiles.length > 0) {
      if (this.selectedFiles[0].name.indexOf(".xls") < 0 && this.selectedFiles[0].name.indexOf(".xlsx") < 0 ) {
        this.fileNameArch = "";
        this.spinner.hide();
        Swal.fire({ title: 'ERROR', text: "El archivo seleccionado no es valido", icon: 'error', allowOutsideClick: false });
      } else {
        this.fileName = this.selectedFiles[0].name;
        var archivoCotejo = this.selectedFiles[0];

        if(archivoCotejo!=undefined){
          this.FechaPagosRecurrentesService.ArchivoCotejo(archivoCotejo).then((resp:any)=>{
            console.log(resp.Error);
            if(resp.Error == 0){
              Swal.fire({ title: 'CARGA EXITOSA', text: resp.Msj, icon: 'success', allowOutsideClick: false });
              this.cotejoContigo = true;
            }
              else{
              Swal.fire({ title: 'ERROR', text: resp.Msj + '...  intente cargar nuevamente', icon: 'error', allowOutsideClick: false });
            this.cotejoContigo = false;
            selectedFiles: FileList = null;
            this.fileName = "";
            this.fileNameArch = "";
            }
            this.spinner.hide();

          })
        }
      }
    }
  }

  archivoPlanillaMensualRRVV(){
    Swal.showLoading();
      this.FechaPagosRecurrentesService.ConsultaPlanillaMensualRRVV(this.info).then((resp:any)=>{
        let archivo = resp.result;
        
        var blob = this.FechaPagosRecurrentesService.DescargarZIP(archivo).subscribe(res=>{  
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

  guardaFecha(){
    let hoy = moment();
    //console.log(hoy);
    //console.log(this.info.FechaPago);
    //console.log(hoy.format('YYYY-MM-DD'));
    if (this.info.FechaPago > hoy.format('YYYY-MM-DD')) {
      Swal.fire('Error', 'La fecha de Pago no debe ser mayor al dia actual.', 'error');
      return;
    }
    else
    {
    Swal.fire(
      'GUARDANDO!',
      'Espere un momento mientras se guardan las fechas.',
      'warning'
    );
    Swal.showLoading();
    this.listaRegistros[0].FechaAct = this.info.FechaPago;
      this.FechaPagosRecurrentesService.guardaFecha(this.listaRegistros).then((resp:any)=>{
        if(resp == 1){
          this.FechaPagosRecurrentesService.consultaCalculo(this.info).then((resp:any)=>{
            this.listaRegistros = resp;
            console.log(resp);
            
            this.dataSourceCalculo = new MatTableDataSource(resp);
            this.dataSourceCalculo.paginator = this.paginator;

            this.banderaSelect = 1 
          });
          
           Swal.close();
        }
        
      });
    }
  }

  CambiaEstatus(bandera, iden){
    this.listaRegistros[iden -1].Bandera2 = bandera == 0 ? 1 : 0;  
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
      if(this.banderaSelect == 1)
        this.listaRegistros[i].Bandera2 = this.listaRegistros[i].Fecha == "" ? 0 : this.listaRegistros[i].Bandera2;
        else
      this.listaRegistros[i].Bandera2 = this.listaRegistros[i].Fecha == "" ? 1 : this.listaRegistros[i].Bandera2;
    }
    
    this.banderaSelect = this.banderaSelect == 1 ? 0: 1;
  }

  creaArchivoCotejo(){
    
      let fecha = this.info.Periodo;
      this.FechaPagosRecurrentesService.ExcelCotejo(fecha).then((resp:any)=>{
        this.contador = this.contador + 1; 
        this.NombreZip = 'Fechas Pago'
        console.log(resp);
        this.archivosDescarga.push(resp.result);
        //this.Bcontigo = false;
        this.generarZIP();
      })
    

  }

   generarZIP(){
    let fecha = this.info.Periodo;
        if(this.contador > 1)
          this.NombreZip = 'Reportes';
          this.archivosDescarga.push(this.NombreZip);
          this.archivosDescarga.push(fecha);
        this.FechaPagosRecurrentesService.CrearZip(this.archivosDescarga)
    .then( (resp: any) => {
      this.archivo = resp.result;
      this.spinner.hide();
      //this.limpiar();

      var blob = this.FechaPagosRecurrentesService.DescargarZIP(this.archivo).subscribe(res=>{
        FileSaver.saveAs(res,this.archivo);

      }, err=>{
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
    });
    });
    }


}
