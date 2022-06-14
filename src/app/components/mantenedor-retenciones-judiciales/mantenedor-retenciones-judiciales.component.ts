import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ConsultaMantenedorCertificadosSupervivenciaService } from "src/providers/ConsultaMantenedorCertificadosSupervivencia.service";
import { consultaPolizaModel } from "src/interfaces/consultaPoliza.model";
import { ConsultaPolizaServiceService } from "../../../providers/consulta-poliza-service.service";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from '@angular/router';
import { Globales } from "src/interfaces/globales";
import { MatTableDataSource } from "@angular/material/table";
import { RetencionJudicial } from 'src/interfaces/consultaRetencionJudicial.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-mantenedor-retenciones-judiciales",
  templateUrl: "./mantenedor-retenciones-judiciales.component.html",
  styleUrls: ["./mantenedor-retenciones-judiciales.component.css"]
})
export class MantenedorRetencionesJudicialesComponent
  implements OnInit, AfterViewInit {
  public cmbTipoIdent: any;
  NomComp = "";
  busqueda: consultaPolizaModel = {
    NumeroPoliza: '',
    CUSPP: '',
    IdTipoDoc: 0,
    TipoDocumento: '',
    NoDocumetnto: '',
    NoEndoso: '0',
    Paterno: '',
    Materno: '',
    Nombre: '',
    SegundoNombre: '',
    CodPension: 0,
    Fecha: '',
    Error: ''
  };
  maxLengthNumDoc = "15";
  consulta: [];
  columnas = [];
  dataPolizaSeleccionada: RetencionJudicial;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public titleService: Title,
    private consultaPolizaServiceService: ConsultaPolizaServiceService,
    private router: Router
  ) {
    this.columnas = ["item", "numPol", "nomAfiliado", "fecha", "acciones"];
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    this.getCombo();
    Globales.titlePag = 'Consulta Póliza/ Mantenedor de Retenciones Judiciales';
    this.titleService.setTitle(Globales.titlePag);
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator._intl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return "0 de " + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return startIndex + 1 + " - " + endIndex + " de " + length;
    };
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  soloLetras(e): boolean {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    const letras = 'áéíóúabcdefghijklmnñopqrstuvwxyz';
    const especiales = [8, 37, 39, 32];

    let tecla_especial = false;
    for (let i in especiales) {
        if (key === especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if ( (letras.indexOf(tecla) === -1) && (!tecla_especial) ) {
      return false;
    }
  }

  cambiarTipoDoc() {
    console.log(this.busqueda.TipoDocumento);
    
    const tipoDoc = (this.busqueda.TipoDocumento);
    this.busqueda.TipoDocumento = tipoDoc;
    this.busqueda.NoDocumetnto = '';

    if (tipoDoc == '1') {
      this.maxLengthNumDoc = '8';
    }
    if (tipoDoc == '2' || tipoDoc == '5') {
      this.maxLengthNumDoc = '12';
    }
    if (tipoDoc == '9') {
      this.maxLengthNumDoc = '11';
    }
    if (tipoDoc == '3' || tipoDoc == '4' || (tipoDoc > '5' && tipoDoc < '9') || tipoDoc == '10') {
      this.maxLengthNumDoc = '15';
    }
  }

  consultar() {
    if (this.busqueda.NumeroPoliza != "") {
      const pad = "0000000000";
      const numPol = this.busqueda.NumeroPoliza;
      const result = (pad + numPol).slice(-pad.length);
      this.busqueda.NumeroPoliza = result;
    }
    this.consultaPolizaServiceService
      .getConsultasPolizas(this.busqueda)
      .then((resp: any) => {
        this.consulta = resp;
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
      });
  }
  limpiar(){
      this.busqueda.NumeroPoliza = "";
      this.busqueda.CUSPP = "";
      this.busqueda.TipoDocumento = "";
      this.busqueda.NoDocumetnto = "";
      this.busqueda.Paterno = "";
      this.busqueda.Materno = "";
      this.busqueda.Nombre = "";
      this.busqueda.SegundoNombre = "";
      this.dataSource = new MatTableDataSource([]);
  }

  getCombo() {
    this.consultaPolizaServiceService.getCombo()
      .then((resp:any)=>{
        this.cmbTipoIdent = resp;
      });
  }

  polizaSeleccionada(poliza: RetencionJudicial) {
    this.dataPolizaSeleccionada = poliza;
    Globales.datosAntPensionados.NumPoliza = this.dataPolizaSeleccionada.NumeroPoliza;
    this.router.navigate(['/retencionJudicialOrden']);
  }
}
