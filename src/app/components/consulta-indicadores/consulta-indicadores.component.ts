import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { ConsultaIndicadoresService } from 'src/providers/consultaIndicadores.service';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ServiciofechaService } from 'src/providers/serviciodate.service';
import * as moment from 'moment';
@Component({
  selector: 'app-consulta-indicadores',
  templateUrl: './consulta-indicadores.component.html',
  styleUrls: ['./consulta-indicadores.component.css']
})
export class ConsultaIndicadoresComponent implements OnInit {
  FechaIni: "";
  FechaFin: "";
  FecDesde = "";
  FecHasta = "";
  polizas:boolean = true;
  primas:boolean;
  pagos:boolean;
  columnasPorEmitir = [];
  columnasEmitida = [];
  columnasPorRecibir = [];
  columnasRecibida = [];
  columnasPorRealizar = [];
  columnasRealizado = [];
  //@ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  //@ViewChild(MatPaginator, {static:true}) paginator2: MatPaginator;
  //@ViewChild(MatPaginator, {static:true}) paginator3: MatPaginator;
  //@ViewChild(MatPaginator, {static:true}) paginator4: MatPaginator;
  //@ViewChild(MatPaginator, {static:true}) paginator5: MatPaginator;
  //@ViewChild(MatPaginator, {static:true}) paginator6: MatPaginator;
  @ViewChild('PaginadorPorEmitir', {static: true}) paginator: MatPaginator;
  @ViewChild('PaginadorEmitida', {static: true}) paginator2: MatPaginator;
  @ViewChild('PaginadorPorRecibir', {static: true}) paginator3: MatPaginator;
  @ViewChild('PaginadorRecibida', {static: true}) paginator4: MatPaginator;
  @ViewChild('PaginadorPorRealizar', {static: true}) paginator5: MatPaginator;
  @ViewChild('PaginadorRealizado', {static: true}) paginator6: MatPaginator;
  constructor(public titleService: Title,
    private cdRef: ChangeDetectorRef, private service:ConsultaIndicadoresService,
    private spinner: NgxSpinnerService,
    private _serviceFecha: ServiciofechaService) { 

    this.columnasPorEmitir = ['numCot','fecAcepta','diasTranscurridos'];
    this.columnasEmitida = ['numPoliza','fecAcepta','fecEmision', 'diasTranscurridos'];
    this.columnasPorRecibir = ['numPoliza','fecAfp','diasTranscurridos'];
    this.columnasRecibida = ['numPoliza','fecTraspaso','fecAfp', 'diasTranscurridos'];
    this.columnasPorRealizar = ['numPoliza','fecTraspaso', 'nombreBen','diasTranscurridos'];
    this.columnasRealizado = ['numPoliza','fecTraspaso','fecPagoReal','nombreBen','diasTranscurridos'];
    }
  
    dataSourcePorEmitir: MatTableDataSource<any> = new MatTableDataSource(null);
    dataSourceEmitida: MatTableDataSource<any> = new MatTableDataSource(null);
    dataSourcePorRecibir: MatTableDataSource<any> = new MatTableDataSource(null);
    dataSourceRecibida: MatTableDataSource<any> = new MatTableDataSource(null);
    dataSourcePorRealizar: MatTableDataSource<any> = new MatTableDataSource(null);
    dataSourceRealizado: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    this.dataSourcePorEmitir = new MatTableDataSource(null);
    this.dataSourceEmitida = new MatTableDataSource(null);
    this.dataSourcePorRecibir = new MatTableDataSource(null);
    this.dataSourceRecibida = new MatTableDataSource(null);
    this.dataSourcePorRealizar = new MatTableDataSource(null);
    this.dataSourceRealizado = new MatTableDataSource(null);
    
    //this.llenarTablas();
  }
   ngAfterViewInit() {
    Globales.titlePag = 'Consulta Indicadores';
    this.titleService.setTitle(Globales.titlePag);
    this.cdRef.detectChanges();
    //this.spinner.show();
    // Tabla Por Emitir
    this.paginator._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator._intl.getRangeLabel = (page, pageSize, length) => {
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
    // Tabla Emitida
    this.paginator2._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator2._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator2._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator2._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator2._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator2._intl.getRangeLabel = (page, pageSize, length) => {
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
    // Tabla por recibir
    this.paginator3._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator3._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator3._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator3._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator3._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator3._intl.getRangeLabel = (page, pageSize, length) => {
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
    // Tabla Recibidas
    this.paginator4._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator4._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator4._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator4._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator4._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator4._intl.getRangeLabel = (page, pageSize, length) => {
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
    // Tabla Por Realizar
    this.paginator5._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator5._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator5._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator5._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator5._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator5._intl.getRangeLabel = (page, pageSize, length) => {
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
    // Tabla Realizadas
    this.paginator6._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator6._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator6._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator6._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator6._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator6._intl.getRangeLabel = (page, pageSize, length) => {
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
  changeTab(tab){
    this.polizas = false;
    this.primas = false;
    this.pagos = false;
    if(tab=='datosPolizas'){
      this.polizas = true;
    }
    else if(tab=='datosPrimas'){
      this.primas  = true;
    }
    else if(tab=='datosPagos'){
      this.pagos = true;
    }
  }

  llenarTablas(FechaIni: string, FechaFin: string)
  {
    
    this.service.getDatosTablas(this.FechaIni, this.FechaFin).then((res: any)=>{
      //console.log(res)
      this.dataSourcePorEmitir = new MatTableDataSource(res.ListaPorEmitir)
      this.dataSourcePorEmitir.paginator = this.paginator;
      this.dataSourceEmitida = new MatTableDataSource(res.ListaEmitida);
      this.dataSourceEmitida.paginator = this.paginator2;
      this.dataSourcePorRecibir = new MatTableDataSource(res.ListaPorRecibir);
      this.dataSourcePorRecibir.paginator = this.paginator3;
      this.dataSourceRecibida = new MatTableDataSource(res.ListaRecibida);
      this.dataSourceRecibida.paginator = this.paginator4;
      this.dataSourcePorRealizar = new MatTableDataSource(res.ListaPorRealizar);
      this.dataSourcePorRealizar.paginator = this.paginator5;
      this.dataSourceRealizado = new MatTableDataSource(res.ListaRealizado);
      this.dataSourceRealizado.paginator = this.paginator6;

    }
      , err=>{})
      this.spinner.hide();
  }

  calcular(){
    console.log("Generando")
    //this.actualizarConsulta();

    Swal.showLoading();
    /*this.archivo_datos_beneficiarioService.postConsultaGnral(this.consulta)
                            .then( (resp: any) => {
                                console.log(resp)
                                //this.generarAchivoXLSXService.generateExcelArchivoBeneficiarios(resp.infoBeneficiario);
                                this.generarAchivoCSVService.archivoDatosBeneficiario(resp.infoBeneficiario,"ArchivoContabledePagosRecurrentes_"+moment().format('YYYYMMDD').toString());
                                Swal.close();
                            });*/
  let fecDesde;
  let fecHasta;
  fecDesde = this._serviceFecha.format(new Date(moment(fecDesde, 'DD-MM-YYYY').format()));
  fecHasta = this._serviceFecha.format(new Date(moment(fecHasta, 'DD-MM-YYYY').format()));
  this.FecDesde = fecDesde;
  this.FecHasta = fecHasta;  

  let FechaIni = this.FecDesde;
  let FechaFin = this.FecHasta;
  
    this.dataSourcePorEmitir = new MatTableDataSource(null);
    this.dataSourceEmitida = new MatTableDataSource(null);
    this.dataSourcePorRecibir = new MatTableDataSource(null);
    this.dataSourceRecibida = new MatTableDataSource(null);
    this.dataSourcePorRealizar = new MatTableDataSource(null);
    this.dataSourceRealizado = new MatTableDataSource(null);
    
    this.llenarTablas(FechaIni, FechaFin);
    Swal.close();
  }

  crearReportes()
  {
    this.spinner.show();
    let fecDesde;
    let fecHasta;
    fecDesde = this._serviceFecha.format(new Date(moment(fecDesde, 'DD-MM-YYYY').format()));
    fecHasta = this._serviceFecha.format(new Date(moment(fecHasta, 'DD-MM-YYYY').format()));
    this.FecDesde = fecDesde;
    this.FecHasta = fecHasta;  
  
    let FechaIni = this.FecDesde;
    let FechaFin = this.FecHasta;
    let archivos: string[] = null;   
    var archivo = "";
    this.service.CrearReportes(this.FechaIni, this.FechaFin)
                  .then( (resp: any) => {
                    archivos = resp.result;
                    this.spinner.hide();
                    this.service.CrearZip(archivos)
                    .then( (resp: any) => {
                      archivo = resp.result;
                      
                      var blob = this.service.DescargarZIP(archivo).subscribe(res=>{  
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
}
