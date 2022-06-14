import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ConsultaMantenedorCertificadosSupervivenciaService } from "src/providers/ConsultaMantenedorCertificadosSupervivencia.service";
import { mantenedorCertificadosSupervivencia } from "src/interfaces/mantenedorCertificadosSupervivencia.model";
import { ConsultaPolizaServiceService } from "../../../providers/consulta-poliza-service.service";
import { MatPaginator } from "@angular/material/paginator";
import { Globales } from "src/interfaces/globales";
import { MatTableDataSource } from "@angular/material/table";
import { consultaPolizaModel } from 'src/interfaces/consultaPoliza.model';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: "app-consulta-poliza",
  templateUrl: "./consulta-poliza.component.html",
  styleUrls: ["./consulta-poliza.component.css"]
})
export class ConsultaPolizaComponent implements OnInit, AfterViewInit, AfterViewChecked {
  cmbTipoIdent = [];
  NomComp = "";
  busqueda: consultaPolizaModel = new consultaPolizaModel();
  consulta: [];
  columnas = [];
  columnasMovimientosPoliza = [];
  varEditar = true;
  pol = "200";

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
              private consultaPolizaServiceService: ConsultaPolizaServiceService,
              public titleService: Title,
              private serviceLog:LoginService,
              private cdRef:ChangeDetectorRef,
              private service: ConsultaPolizaServiceService,
  ) {
    this.columnas = ["item", "numPol",'cuspp','documento','endoso', "nomAfiliado", "fecha","estatus", "acciones"];
    this.columnasMovimientosPoliza = ["item","usuario","endoso", "fecha", "hora", "descripcion", "acciones"];
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  dataSourceMovimientos:MatTableDataSource<any> = new MatTableDataSource([]);

  ngOnInit() {
    this.getCombo();
    Globales.titlePag = 'Consulta Póliza';
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

  ngAfterViewChecked() {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  cambiarTipoDoc() {
    this.varEditar = this.busqueda.TipoDocumento == "" ? true : false;
    this.busqueda.NoDocumetnto = this.busqueda.TipoDocumento == "" ? "" : this.busqueda.NoDocumetnto;
  }

  consultar() {

    if (this.busqueda.NumeroPoliza != "") {
      const pad = "0000000000";
      const numPol = this.busqueda.NumeroPoliza;
      const result = (pad + numPol).slice(-pad.length);
      this.busqueda.NumeroPoliza = result;
    }

    if (this.busqueda.NoEndoso == "") {
      this.busqueda.NoEndoso = "0";
    }


    console.log(this.busqueda)
    this.consultaPolizaServiceService
      .getConsultasPolizas(this.busqueda)
      .then((resp: any) => {
        console.log(resp)
        this.consulta = resp;
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
      });
  }
  getCombo(){
    this.consultaPolizaServiceService.getCombo()
      .then((resp:any)=>{
        console.log(resp);
        this.cmbTipoIdent = resp;
      })
  }

  mantenedorEndososSimplesActuariales(data){
    Globales.datosEndososSimplesActuariales.NumeroPoliza = data.NumeroPoliza;
    Globales.datosEndososSimplesActuariales.NoEndoso = data.NoEndoso;
  }


  MovimientosEndoso(data){
    this.pol = data;

    this.consultaPolizaServiceService
      .getMovimientosEndoso(data)
      .then((resp: any) => {
        console.log(resp)
        this.dataSourceMovimientos = new MatTableDataSource(resp.LstEndosos);
        this.dataSourceMovimientos.paginator = this.paginator;
      });
    
  }

  limpiar(){
    this.busqueda.NumeroPoliza = "";
    this.busqueda.CUSPP = "";
    this.busqueda.TipoDocumento = "";
    this.busqueda.NoDocumetnto = "";
    this.busqueda.TipoDocumento ;
    this.busqueda.Materno = "";
    this.busqueda.Paterno = "";
    this.busqueda.Nombre = "";
    this.busqueda.SegundoNombre = "";
    this.varEditar = true;
    this.dataSource = new MatTableDataSource([]);
  }

  generarPreEndoso(poliza, endoso){
          /*Swal.close();
          Swal.fire(
            'GENERANDO PDF!',
            'Espere un momento mientras se genera documento.',
            'warning'
          )
           Swal.showLoading();*/
    
      this.service.generaPreEndosoAcc(poliza, endoso).then((resp: any) => {
        console.log(resp);
        
          //var archivo = res.result;
          var archivo = resp.result;
          
          var blob = this.service.Descargar(archivo).subscribe(res=>{  
            saveAs(res,archivo);
            Swal.close();
          }, err=>{
            Swal.close();
          //this.titulo = "Error";
          //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
          //this.toastr.error(this.mensaje, this.titulo);
          //console.log(err)
        }); 
      })
  }
}
