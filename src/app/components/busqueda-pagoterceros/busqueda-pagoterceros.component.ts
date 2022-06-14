import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Globales } from 'src/interfaces/globales';
import { PagoTercerosBusqueda } from 'src/interfaces/pago-terceros-model';
import { PagoTercerosService } from 'src/providers/pago-terceros.service';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-busqueda-pagoterceros',
  templateUrl: './busqueda-pagoterceros.component.html',
  styleUrls: ['./busqueda-pagoterceros.component.css']
})
export class BusquedaPagotercerosComponent implements OnInit, AfterViewInit, AfterViewChecked {

  mlPoliza=10;
  mlCuspp=12;
  mlNDoc=15;
  mlApNom=20;
  isDisabled = true;
  columnas = [];
  NumDoc = "";
  NumEndoso = "";
  TipoDoc = "";
  public cmbTipoDoc: any[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataBusqueda: PagoTercerosBusqueda = {
    NumPoliza: "",
    Cuspp: "",
    TipoDoc: "",
    NumDoc: "",
    NumEndoso: "",
    ApePaterno: "",
    ApeMaterno: "",
    Nombre: "",
    SegNombre: ""
  }

  constructor(private _pagoTerceroService: PagoTercerosService, 
              public titleService: Title, 
              private serviceLog:LoginService,
              private cdRef:ChangeDetectorRef) {
    this.columnas = ['item','numeroPoliza', 'endoso', 'nomAfiliado','fecha','acciones'];

    _pagoTerceroService.getCombos("SELECT_COMBOTIPOIDEN","").then( (resp: any) => {
      this.cmbTipoDoc = resp;
    });
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Consulta Pago a Terceros';
    this.titleService.setTitle(Globales.titlePag);
    this.isDisabled;
  }

  ngAfterViewInit() {
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

  }

  ngAfterViewChecked() {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  enableInput(value){
    if (value != ''){
      this.isDisabled=false;
    }else{
      this.isDisabled=true;
      this.dataBusqueda.NumDoc = "";
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  lettersOnly(event) {
    event = (event) ? event : event;
    var charCode = (event.charCode) ? event.charCode : ((event.keyCode) ? event.keyCode :
       ((event.which) ? event.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) &&
       (charCode < 97 || charCode > 122)) {
       return false;
    }
    return true;
  }

  zeroFill(){
    if (this.dataBusqueda.NumPoliza != ""){
      var pad = "0000000000";
      var numPol = this.dataBusqueda.NumPoliza;
      var result = (pad + numPol).slice(-pad.length);
      this.dataBusqueda.NumPoliza = result;
    }
  }

  onlyAlphaNumeric(event) {
    if ((event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57)){
      event.preventDefault();
    }
  }

  datoGlobal(NumPoliza, NumEndoso, NumOrden){
    Globales.datosAntPensionados.NumPoliza = NumPoliza;
    Globales.datosAntPensionados.NumEndoso = NumEndoso;
    Globales.datosAntPensionados.NumOrden = NumOrden;
  }

  buscarData() {
    this._pagoTerceroService.postBuscarPagoTercero(this.dataBusqueda).then( (resp:any) => {
      // console.log(resp);

      this.dataSource = new MatTableDataSource(resp.lstInfoPagoTercero);

      this.dataSource.paginator = this.paginator;
    });
  }
  limpiar(){
    this.dataBusqueda = {
      NumPoliza: "",
      Cuspp: "",
      TipoDoc: "",
      NumDoc: "",
      NumEndoso: "",
      ApePaterno: "",
      ApeMaterno: "",
      Nombre: "",
      SegNombre: ""
    }
    this.dataSource = new MatTableDataSource([]);
  }

  exportar(poliza){
    var archivo = "";
    this._pagoTerceroService.getExportar(poliza)
    .then( (resp: any) => {
      archivo = resp.result;
      
      var blob = this._pagoTerceroService.downloadFile(archivo).subscribe(res=>{  
        saveAs(res,archivo);
      }, err=>{
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
    });


    });    
 
  }

}
