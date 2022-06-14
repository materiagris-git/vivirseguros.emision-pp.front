import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { PagosRecurrentesConsulta, InsertarPagosRecurrentes } from 'src/interfaces/GenArContablePagosRecurrentes.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { GeneracionArchcontPagosrecurrentesservice } from 'src/providers/GeneracionArchcontPagosrecurrentes.service';
import { Globales } from 'src/interfaces/globales';
import { generarAchivoCSV } from 'src/providers/generarArchivoCSV.service';
import { generarAchivoXLSX } from 'src/providers/generarArchivoXLSX.service';
import { GenArDatosBeneficiarios } from 'src/interfaces/archivo-datos-beneficiario.model';
import { archivo_datos_beneficiario } from 'src/providers/archivo-datos-beneficiario.service';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { LoginService } from 'src/providers/login.service';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { ServiciofechaService } from 'src/providers/serviciodate.service';
GeneracionArchcontPagosrecurrentesservice
@Component({
  selector: 'app-generacion-archcont-pagosrecurrentes',
  templateUrl: './generacion-archcont-pagosrecurrentes.component.html',
  styleUrls: ['./generacion-archcont-pagosrecurrentes.component.css']
})
export class GeneracionArchcontPagosrecurrentesComponent implements OnInit {
  FechaIni: "";
  FechaFin: "";
  FecDesde = "";
  FecHasta = "";
  datosPagos: PagosRecurrentesConsulta = new PagosRecurrentesConsulta();
  datosAgregar: InsertarPagosRecurrentes = new InsertarPagosRecurrentes();
  InsertarPagosRecurrentes: InsertarPagosRecurrentes = new InsertarPagosRecurrentes();
  consulta: GenArDatosBeneficiarios = {
    tipoPension:"",
    tipoMoneda:"",
    tipoModalidad:"",
    yearDiferido:"",
    FechaActual: moment().format('YYYY-MM-DD').toString()
  };
  intervalo: any;
  constructor(
    private serviceLog:LoginService, private cdRef:ChangeDetectorRef,
    private GeneracionArchcontPagosrecurrentesservice: GeneracionArchcontPagosrecurrentesservice,
    public titleService: Title,
    private generarAchivoCSVService: generarAchivoCSV,
    private archivo_datos_beneficiarioService: archivo_datos_beneficiario,
    private _serviceFecha: ServiciofechaService, 

  ) {
    this.columnas = ['item', 'fecha', 'casosPension', 'casosSalud'];
    this.intervalo = {
      FecDesde: "",
      FecHasta: ""
    }
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  columnas = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Generación de Archivo Contable de Pagos Recurrentes';
    this.titleService.setTitle(Globales.titlePag);
    this.GeneracionArchcontPagosrecurrentesservice.postConsultaGnral().then( (resp: any) => {
      this.dataSource = new MatTableDataSource(resp);
    });
  }

  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  GuardarInfo() {
    this.InsertarPagosRecurrentes.NUM_ARCHIVO;
    this.InsertarPagosRecurrentes.COD_TIPREG;
    this.InsertarPagosRecurrentes.COD_TIPMOV;
    this.InsertarPagosRecurrentes.COD_MONEDA;
    this.InsertarPagosRecurrentes.FEC_DESDE;
    this.InsertarPagosRecurrentes.FEC_HASTA;
    this.InsertarPagosRecurrentes.COD_USUARIOCREA;
    this.InsertarPagosRecurrentes.FEC_CREA;
    this.InsertarPagosRecurrentes.HOR_CREA;


  }

  calcular(){
    console.log("calculando")
    //this.actualizarConsulta();
    console.log(this.consulta)

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
  
    this.GeneracionArchcontPagosrecurrentesservice.postGenerarArchContDiario(this.FechaIni, this.FechaFin)
    .then( (resp: any) => {
        console.log(this.FechaIni, this.FechaFin, resp.pathExcel)
        let archivoContable = resp.pathExcel;
                      
      var blob2 = this.GeneracionArchcontPagosrecurrentesservice.DescargarContables(archivoContable).subscribe(res=>{  
        saveAs(res,archivoContable);
      }, err=>{
        console.log(err)
    });
        Swal.close();
    });

  }

  ngAfterViewInit() {
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

}
