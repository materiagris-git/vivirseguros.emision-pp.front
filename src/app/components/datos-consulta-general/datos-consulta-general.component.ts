import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Globales } from 'src/interfaces/globales';
import { ConsultaGeneralObj, ConsultaGeneralDatosPoliza, ConsultaGeneralDatosCalculo, ConsultaGeneralDatosGrupoFamiliar, ConsultaGeneralPagoPensiones, ConsultaGeneralLiquidaciones } from 'src/interfaces/consultaGeneral.model';
import { ConsultaGeneralService } from 'src/providers/consulta-general.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { LoginService } from 'src/providers/login.service';
import { AntecedentesprimaAfpService } from 'src/providers/antecedentesprima-afp.service';
@Component({
  selector: 'app-consulta-general',
  templateUrl: './datos-consulta-general.component.html',
  styleUrls: ['./datos-consulta-general.component.css']
})
export class DatosConsultaGeneralComponent implements OnInit {
  filtros:ConsultaGeneralObj = new ConsultaGeneralObj();
  nombreCompleto='';
  poliza:boolean = true;
  calculo:boolean;
  familiar:boolean;
  pagoPensiones:boolean;
  liquidaciones:boolean;
  documentos:boolean;
  documentosBoletas:boolean;
  fechaPago: boolean;
  columnasGpoFamiliar = [];
  columnasPagoPensiones = [];
  columnasLiquidacion = [];
  columnasFecha = [];
  datosPoliza:ConsultaGeneralDatosPoliza = new ConsultaGeneralDatosPoliza();
  datosCalculo:ConsultaGeneralDatosCalculo = new ConsultaGeneralDatosCalculo();
  datosGpoFamiliar:ConsultaGeneralDatosGrupoFamiliar = new ConsultaGeneralDatosGrupoFamiliar();
  consultaGpoFamiliar:ConsultaGeneralDatosGrupoFamiliar = new ConsultaGeneralDatosGrupoFamiliar();
  datosPensiones:ConsultaGeneralPagoPensiones = new ConsultaGeneralPagoPensiones();
  conceptos = [];
  concepto = new FormControl();
  fechaProcIni = '';
  fechaProcFin = '';
  TipoNumIdent = '';
  CodMonedaPen = '';
  listaConceptoStr = [];
  liquidacionesConsulta:ConsultaGeneralLiquidaciones = new ConsultaGeneralLiquidaciones();
  hoy = new Date();
  date = '';
  fecha = moment(this.hoy).subtract(1,'months').format('YYYY-MM');
  FecDesde = '';
  FecHasta = '';
  opcionDir = 'Exp';
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  constructor(private service:ConsultaGeneralService,
              private cdRef : ChangeDetectorRef,
              public titleService: Title,
              private router:Router,
              private serviceLog: LoginService,
              private antPrimaAFPServvice: AntecedentesprimaAfpService)
  {

    this.columnasGpoFamiliar = ['item','parentesco','tipoIdent','noIdent','nombre','estado','acciones'];
    this.columnasPagoPensiones = ['periodoVigencia','tipoRetencion','rut','nombreAfiliado','modalidad','fechaEfecto'];
    this.columnasLiquidacion = ['periodo','codigo','concepto','monto'];
    this.columnasFecha = ['numIden', 'perPago', 'montoBruto','montoEsSalud','montoTotal','Fecha', 'TipoPago']
  }
  dataSourceGpoFam: MatTableDataSource<any> = new MatTableDataSource(null);
  dataSourcePagoPensiones: MatTableDataSource<any> = new MatTableDataSource(null);
  dataSourceLiquidacion: MatTableDataSource<any> = new MatTableDataSource(null);
  dataSourceFechas: MatTableDataSource<any> = new MatTableDataSource(null);
  ngOnInit() {
    this.dataSourceGpoFam = new MatTableDataSource(null);
    this.dataSourcePagoPensiones = new MatTableDataSource(null);
    this.dataSourceFechas = new MatTableDataSource(null);
    //console.log(Globales.datosConsultaGeneral.fecha)
    this.filtros.NumeroPoliza = Globales.datosConsultaGeneral.numPoliza.toString();
    this.filtros.NoEndoso = Number( Globales.datosConsultaGeneral.numEndoso);
   //console.log(this.filtros,Globales.datosConsultaGeneral.numEndoso, Globales.datosConsultaGeneral.numPoliza)

    this.buscarDatosPoliza()

  }

  ngAfterViewChecked() {
    if (Globales.datosConsultaGeneral.numPoliza == 0 && Globales.datosConsultaGeneral.numEndoso == 0 && Globales.datosConsultaGeneral.fecha == "") {
      this.router.navigate(['/consultaGeneral'])
    }
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  conceptosCmb(concepto){

    if(concepto.value.length>0){
      this.listaConceptoStr = [];
      for (let i = 0; i < this.concepto.value.length; i++) {
        this.listaConceptoStr.push(this.concepto.value[i].CodigoStr);

       }

     }
     else{
       this.listaConceptoStr = [];
     }

  }
  changeTab(tab){
    this.poliza = false;
    this.calculo = false;
    this.familiar = false;
    this.pagoPensiones = false;
    this.liquidaciones = false;
    this.documentos = false;
    this.documentosBoletas = false;
    this.fechaPago = false;
    if(tab=='datosPoliza'){
      this.poliza = true;
    }
    else if(tab=='datosCalculo'){
      this.calculo  = true;
    }
    else if(tab=='grupoFamiliar'){
      this.familiar = true;
    }
    else if(tab=='pagoPensiones'){
      this.pagoPensiones = true;
    }
    else if(tab=='liquidaciones'){
      this.liquidaciones = true;
    }
    else if(tab=='documentos'){
      this.documentos = true;
    }
    else if(tab=='documentosBoletas'){
      this.documentosBoletas = true;
    }
    else if(tab=='FechaPago'){
      this.fechaPago = true;
    }


  }
  buscarDatosPoliza(){
    if(this.filtros.IdTipoDoc == null){
      this.filtros.IdTipoDoc = 0;
    }
    if(Globales.datosConsultaGeneral.numPoliza!=0){
      this.service.getDatosPoliza(this.filtros).subscribe(res=>{
        //console.log(res)
        this.filtros = res.DatosGenerales;
        this.filtros.NoDocumetnto = res.DatosGenerales.NoDocumetnto;
        this.filtros.Fecha = Globales.datosConsultaGeneral.fecha;
        this.dataSourceGpoFam = new MatTableDataSource(res.LstBeneficiarios)
        this.datosPoliza = res.DatosPoliza;

        this.antPrimaAFPServvice.getCodMoneda(this.datosPoliza.CodMoneda).then((resp: any) => {
          this.CodMonedaPen = resp.SimboloMoneda;
        });

        this.datosCalculo = res.DatosCalculo;
        this.datosGpoFamiliar = res.DatosGpoFamiliar;
        this.datosPensiones = res.DatosPagoPensiones;     
        this.TipoNumIdent = res.DatosGenerales.TipoDocumento + '-' + res.DatosGenerales.NoDocumetnto;
        if(res.DatosPagoPensiones.RetencionJudicial){
            this.dataSourcePagoPensiones = new MatTableDataSource(res.DatosPagoPensiones.RetencionJudicial);
          }

          this.dataSourceFechas = new MatTableDataSource(res.LstFechaPago);
          this.dataSourceFechas.paginator = this.paginator;

        this.conceptos = res.LstConceptos;

        //console.log(this.datosPoliza)
        //console.log(this.dataSourceGpoFam)
        //console.log(this.filtros)
        this.nombreCompleto = this.filtros.Nombre+" "+this.filtros.Paterno+" "+ this.filtros.Materno;
        // this.listaPolizas = res;
        // this.dataSource = new MatTableDataSource(this.listaPolizas);
        // this.dataSource.paginator = this.paginator;
        if(this.filtros.IdTipoDoc ==0){
          this.filtros.IdTipoDoc = null;
        }
      }
        , err=>{})
    }

   }
   buscarFamiliar(datos){
        //console.log(datos);
        this.consultaGpoFamiliar.NoPoliza = Globales.datosConsultaGeneral.numPoliza.toString();
        this.consultaGpoFamiliar.Endoso = Globales.datosConsultaGeneral.numEndoso;
        this.consultaGpoFamiliar.Orden = datos.Orden;
        this.consultaGpoFamiliar.MontoPension = this.datosPoliza.MontoPension;



       this.service.getDatosFamiliar(this.consultaGpoFamiliar).subscribe(res=>{
        //console.log(res)
        this.datosGpoFamiliar = res.DatosGpoFamiliar;
        this.datosPensiones = res.DatosPagoPensiones;
        this.dataSourceFechas = new MatTableDataSource(res.LstFechaPago);
        this.dataSourceFechas.paginator = this.paginator;
       },
       err=>{}
       )

   }

   procesar(){


     var noOrden = this.consultaGpoFamiliar.Orden;
     if(noOrden == 0){
       noOrden = 1;
     }

     this.liquidacionesConsulta.NoPoliza = Globales.datosConsultaGeneral.numPoliza.toString();
     this.liquidacionesConsulta.Orden = noOrden;
     this.liquidacionesConsulta.FechaIni = new Date(moment(this.fechaProcIni).format('LLLL'));
     this.liquidacionesConsulta.FechaFin = new Date(moment(this.fechaProcFin).format('LLLL'));
     this.liquidacionesConsulta.LstCodigos = this.listaConceptoStr;

     //console.log(this.liquidacionesConsulta)

     if(moment(this.datosPoliza.FechaIniVigencia) > moment(this.fechaProcIni) || moment(this.datosPoliza.FechaFinVigencia) < moment(this.fechaProcFin)){
       this.mensaje('ADVERTENCIA','No puedes ingresar fechas fuera del periodo de vigencia','warning')

     }
     else{
      this.service.getConsultaLiquidacion(this.liquidacionesConsulta).subscribe(res=>{
        //console.log(res);
        this.dataSourceLiquidacion = new MatTableDataSource(res);
        this.dataSourceLiquidacion.paginator = this.paginator;

      },
        err=>{})
     }


   }
   mensaje(titulo,texto,icono){
    Swal.fire({title: titulo,text: texto, icon: icono, allowOutsideClick: false});
   }

   volverConsulta() {
    this.router.navigate(['/consultaGeneral']);
  }
  generarArchivos(bandera, boletasMes){
    let archivos: string[] = null;   
    var archivo = "";
    let poliza = Globales.datosConsultaGeneral.numPoliza.toString();
    let pension = '';
    pension = this.datosPoliza.CodPension;
    let endoso = Globales.datosConsultaGeneral.numEndoso.toString();
    let desde = this.FecDesde.toString();
    let hasta = this.FecHasta.toString();

    if(desde > hasta)
    { 
      this.mensaje('ADVERTENCIA','La fecha hasta no puede ser mayor a la desde','warning');
      return;
    }
    this.service.CrearReportes(poliza, bandera, pension, endoso, desde, hasta, boletasMes)
                  .then( (resp: any) => {
                    if(bandera ==='boletas')
                    {
                      if(resp == null)
                      {this.mensaje('ADVERTENCIA','Error en la generación de boletas','warning')
                        return;
                      }
                      if(resp.result == '-1')
                      {this.mensaje('ADVERTENCIA','La póliza no tiene fechas de pago registradas','warning')
                        return;
                      }
                      if(resp.result == '-2')
                      {this.mensaje('ADVERTENCIA','No se encontraron pagos para la póliza solicitada.','warning')
                        return;
                      }
                      if(resp.result == '-3')
                      {this.mensaje('ADVERTENCIA','La póliza a generar se encuentra en Emisión no es posible generar Boleta por Mes.','warning')
                        return;
                      }
                      if(resp.result == null)
                      {this.mensaje('ADVERTENCIA','La póliza no tiene fecha de pago registradas para los meses seleccionados','warning')
                      return;
                      }
                      else{
                    let archivos = resp.result;
              
                    this.service.CrearZip(archivos)
                    .then( (resp: any) => {
                      archivo = resp.result;
                      if(archivo !== null){
                      var blob = this.service.DescargarZIP(archivo).subscribe(res=>{  
                        saveAs(res,archivo);
                      }, err=>{
                      //this.titulo = "Error";
                      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
                      //this.toastr.error(this.mensaje, this.titulo);
                      //console.log(err)
                      this.mensaje('ADVERTENCIA','No se han generado las boletas anteriormente o la póliza no generó pagos','warning')
                    });}
                    }); 
                  }}
                if(bandera === 'polizas')
                {
                  let pathArchivos = resp.result;
                  this.service.GenerarZIPPolizas(pathArchivos)
                    .then( (resp: any) => {
                      let archivoPoliza = resp.result;
                      
                      var blob2 = this.service.DescargarPDFPolizas(archivoPoliza).subscribe(res=>{  
                        saveAs(res,archivoPoliza);
                      }, err=>{
                        console.log(err)
                    });
                });
                }
                  });
                
  }

  selectDirecciones(valor: string) {
    this.opcionDir = valor;
  }

}
