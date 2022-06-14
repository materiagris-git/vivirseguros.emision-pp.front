import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { MantenimientoIngresoPrimas, LiquidacionPrima, StPensionActAFP, StDetPension, Moneda } from '../../../interfaces/mantenimientoIngresoPrimas.model';
import { MantenedorIngresoPrimasService } from 'src/providers/mantenedorIngresoPrimas.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/providers/login.service';
import { saveAs } from 'file-saver';
import { AntecedentesprimaAfpService } from 'src/providers/antecedentesprima-afp.service';
import { data } from 'jquery';
import { CANCELLED } from 'dns';

@Component({
  selector: 'app-mantenedor-ingreso-primas',
  templateUrl: './mantenedor-ingreso-primas.component.html',
  styleUrls: ['./mantenedor-ingreso-primas.component.css']
})
export class MantenedorIngresoPrimasComponent implements OnInit, AfterViewInit {

  vlBotonGrabar = false;
  txtFiltrarDetalle = '';
  hoy = new Date();
  columnasResumen = [];
  columnasDetalle = [];
  btnGuardar: boolean;
  btnEnvioPoliza: boolean;
  btnAFP: boolean;

  mensajeError = '';
  clNumeroMaximoDiasPrimerPago = 30;
  vlProxPeriodo = '';
  dataPrima: MantenimientoIngresoPrimas = {
    NumPoliza: '',
    NumIdentificacion : '',
    GlsTipoIden: '',
    Nombre: '',
    CUSPP: '',
    CodTipoPension: '',
    TipoPension: '',
    CodTipoRenta: '',
    TipoRenta: '',
    CodModalidad: '',
    Modalidad: '',
    PrcRentaEsc: 0,
    Moneda: '',
    CodMoneda: '',
    AniosDiferidos: 0,
    MesesGarantizados: 0,
    MesesEscalonados: 0,
    MesesDiferidos: 0,
    ReajusteTrim: 0,
    ReajusteMen: 0,
    FechaDevengue: '',
    FechaAceptacion: '',
    PrimaCotizada: 0,
    PensionCotizada: 0,
    FechaInfoAFP: '',
    PrimaTraspasada: 0,
    FactorVariacionRta: 0,
    TipoCambio: 0,
    PensionDefCompania: 0,
    PrimaDefCompania: 0,
    PensionDefAFP: 0,
    PrimaDefAFP: 0,
    FechaTraspasoPrima: '',
    FechaTopePrimerPago: '',
    FechaPrimerPago: '',
    FechaVigenciaPoliza: '',
    FechaFinPerDif: '',
    TipoReajuste: 0,
    MontoPension: 0,
    FechaTerPago: '',
    NumDiasPrimerPago: 0,
    MontoBono: 0,
    MontoPriUni: 0,
    MontoPensionGar: 0,
    GlsNomBen: '',
    GlsNomSegBen: '',
    GlsPatBen: '',
    GlsMatBen: '',
    MontoValMoneda: 0,
    MontoPriUniDif: 0,
    PrcRentaTMP: 0,
    CodAFP: '',
    CodParentesco: '',
    MontoSumPension: 0,
    CodTipReajuste: '',
    CodMonTipoReajuste: '',
    GlsMonTipoReajuste: '',
    MontoPensionPrima: 0,
    MontoPriCiaPrima: 0,
    MontoPensionAfpPrima: 0,
    MontoPriAfpPrima: 0,
    PrcFacVarPrima: 0,
    MontoValMonedaRecPrima: 0,
    MontoPriRecPrima: 0,
    MontoSumPensionInfPrima: 0,
    MontoSumPensionPrima: 0,
    MontoSumPensionAfpPrima: 0,
    NombreCompleto: '',
    FecEmision: '',
    FecSolicitud: '',
    NumCotizacion: '',
    Mensaje: '',
    Usuario: '',
    EstadoCalculo: '',
    FechaEfectiva: '',
    FechaNacimiento: '',
    NumOrden: 0,
    FecEfectivaActive: '',
    lstLiquidacionPrima: [],
    lstStPensionActAFP: [],
    lstStDetPension: []
  };

  monedaNS: Moneda = new Moneda();
  monedaSolDolar: Moneda = new Moneda();

  dataLiquidacionResumen: LiquidacionPrima[] = [];
  dataLiquidacion: LiquidacionPrima[] = [];

  @ViewChild('PaginadorResumen', {static: true}) paginator: MatPaginator;
  @ViewChild('PaginadorDetalle', {static: true}) paginator2: MatPaginator;
  constructor( private ingresoPrimasService: MantenedorIngresoPrimasService,
               public titleService: Title,
               private activatedRoute: ActivatedRoute,
               private serviceFecha: ServiciofechaService,
               private serviceLog:LoginService,
               private _antPrimaAFPServvice: AntecedentesprimaAfpService,
               private cdRef:ChangeDetectorRef ) {
    this.columnasResumen = ['tipoIden', 'numIden', 'parentesco', 'fechaIni', 'fechaTer', 'mtoPension', 'desctoSalud', 'mtoLiquidacion'];
    this.columnasDetalle = ['tipoIden', 'numIden', 'parentesco', 'fechaIni', 'fechaTer', 'mtoPension', 'desctoSalud', 'mtoLiquidacion'];
    this.dataPrima.NumPoliza = this.activatedRoute.snapshot.paramMap.get('poliza');
    this.buscarPoliza(this.dataPrima.NumPoliza);
  }
  dataSourceResumen: MatTableDataSource<any> = new MatTableDataSource(null);
  dataSourceDetalle: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Mantenedor de Ingreso de Primas';
    this.titleService.setTitle(Globales.titlePag);
    this.btnGuardar = false;
    this.btnEnvioPoliza = true;
    this.btnAFP = true;
  }

  ngAfterViewInit() {
    // Tabla de Resumen de Primeros Pagos.
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

  }

  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  seleccionarFilaPoliza(numeroPoliza: string) {
    this.dataPrima.NumPoliza = numeroPoliza;
  }

  async calcular() {
    if ( this.dataPrima.NumPoliza === '' ) {
      this.mensajeError = 'Campo de póliza vacío, no se ha realizado el calculo.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    if (this.dataPrima.MontoPriUni === 0 || this.dataPrima.MontoSumPension === 0 ) {
      this.mensajeError = 'No se encuentran especificados los valores Originales de la Póliza.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    if ( this.dataPrima.FechaTraspasoPrima === '' ) {
      this.mensajeError = 'Debe ingresar la Fecha de Traspaso de la Prima.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if ( this.dataPrima.FechaTopePrimerPago === '' ) {
      this.mensajeError = 'Debe ingresar la Fecha del Primer Pago.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    let d0FechaPrimerPago =  moment(this.dataPrima.FechaPrimerPago);
    let d1FechaTopePrimerPago = moment(this.dataPrima.FechaTopePrimerPago);
    let d2FechaAct = moment();
    let d3FechaInfoAFP = moment(this.dataPrima.FechaInfoAFP);// dato fijo de fecha informaccion AFP
    let d4FechaTraspasoPrima = moment(this.dataPrima.FechaTraspasoPrima);
    let today = moment(this.hoy);

    if ( d4FechaTraspasoPrima > today ) {
      this.mensajeError = 'La Fecha Traspaso Prima no puede ser mayor al dia de hoy.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if ( this.dataPrima.MesesDiferidos === 0 ) {
          if ( d0FechaPrimerPago.format('YYYY-MM-DD')  < d2FechaAct.format('YYYY-MM-DD') ) {
                this.mensajeError = 'La Fecha Ingresada es Menor a la Fecha Actual';
                this.mostrarAlertaError('ERROR', this.mensajeError);
                return;
          }
          d2FechaAct.add(this.clNumeroMaximoDiasPrimerPago,'days');
          if ( d0FechaPrimerPago.format('YYYY-MM-DD')  > d2FechaAct.format('YYYY-MM-DD') ) {

                this.mensajeError = 'Fecha de Primer Pago es Mayor a la Fecha Actual por más de ' + this.clNumeroMaximoDiasPrimerPago + '  días';
                this.mostrarAlertaError('ERROR', this.mensajeError);
                return;
          }
    } else {
        if (this.dataPrima.FechaTopePrimerPago !== this.dataPrima.FechaPrimerPago ) {
          if ( d0FechaPrimerPago.format('YYYY-MM-DD')  < d2FechaAct.format('YYYY-MM-DD') ) {
                this.mensajeError = 'La Fecha de Primer Pago Ingresada es Menor a la Fecha Actual';
                this.mostrarAlertaError('ERROR', this.mensajeError);
                return;
          }
          d2FechaAct.add(this.clNumeroMaximoDiasPrimerPago,'days');
          if ( d0FechaPrimerPago.format('YYYY-MM-DD')  > d2FechaAct.format('YYYY-MM-DD')) {

                this.mensajeError = 'Fecha de Primer Pago es Mayor a la Fecha Actual por más de  ' + this.clNumeroMaximoDiasPrimerPago + '  días';
                this.mostrarAlertaError('ERROR', this.mensajeError);
                return;
          }
        } else {
                if ( d0FechaPrimerPago.format('YYYY-MM-DD')  < d2FechaAct.format('YYYY-MM-DD') ) {
                  this.mensajeError = 'La Fecha de Primer Pago Ingresada no debe ser Menor al Mes Actual';
                  this.mostrarAlertaError('ERROR', this.mensajeError);
                  return;
                }
                if ( d1FechaTopePrimerPago.format('YYYY-MM-DD') > d0FechaPrimerPago.format('YYYY-MM-DD') ) {
                  this.mensajeError = 'La Fecha de Tope del Primer Pago definida no debe ser Mayor a la Fecha de Primer Pago (o Inicio del Pago Diferido)';
                  this.mostrarAlertaError('ERROR', this.mensajeError);
                  return;
                }
                // 'Validar Fecha de Primer Pago (El mes será un pago en régimen, validar que no esté cerrado)
                this.flValidaPeriodoPagoRegimen(this.dataPrima.FechaPrimerPago);
        }

    }
    if (d3FechaInfoAFP.format('YYYY-MM-DD') > d4FechaTraspasoPrima.format('YYYY-MM-DD')) {
      this.mensajeError = 'La Fecha de Traspaso es menor que la Fecha de Solicitud a la AFP';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    this.dataPrima.FechaVigenciaPoliza = this.serviceFecha.formatGuion(new Date());
    // this.dataPrima.FecEmision = this.serviceFecha.formatBD(new Date(moment(this.dataPrima.FecEmision).format('LLLL')));
    await this.ingresoPrimasService.postCalculo(this.dataPrima)
            .then( (resp: any) => {
              // console.log(resp);
    
              if (resp.mjeError === 'Error Periodo Regimen') {
                this.dataPrima.FechaVigenciaPoliza = '';
                this.dataLiquidacion = [];
                this.dataLiquidacionResumen = [];
                this.dataPrima.lstLiquidacionPrima = this.dataLiquidacion;
                this.dataPrima.lstStPensionActAFP = resp.lstStPensionActAFP;
                this.dataPrima.lstStDetPension = resp.lstStDetPension;
                Swal.fire('Error', resp.Mensaje, 'error');
                return;
              }
              
              if ((resp.Mensaje === 'No se genera Primer Pago de Pensiones.') || (resp.lstLiquidacionPrima.length === 0)) {
                this.dataPrima.FechaVigenciaPoliza = resp.FechaVigenciaPoliza.substring(0, 10);
                this.dataLiquidacion = [];
                this.dataLiquidacionResumen = [];
                this.dataPrima.lstLiquidacionPrima = this.dataLiquidacion;
                this.dataPrima.lstStPensionActAFP = resp.lstStPensionActAFP;
                this.dataPrima.lstStDetPension = resp.lstStDetPension;
                Swal.fire('Alerta', 'No se genera Primer Pago de Pensiones.', 'info');
                return;
              }
    
              if (resp.Mensaje === 'Error al calcular Primeros Pagos.') {
                this.dataPrima.FechaVigenciaPoliza = '';
                this.dataLiquidacion = [];
                this.dataLiquidacionResumen = [];
                this.dataPrima.lstLiquidacionPrima = this.dataLiquidacion;
                this.dataPrima.lstStPensionActAFP = resp.lstStPensionActAFP;
                this.dataPrima.lstStDetPension = resp.lstStDetPension;
                Swal.fire('Error', resp.Mensaje, 'error');
                return;
              }

              this.dataPrima.FechaVigenciaPoliza = resp.FechaVigenciaPoliza.substring(0, 10);
              this.dataLiquidacion = resp.lstLiquidacionPrima === [] || resp.lstLiquidacionPrima === null ? [] : resp.lstLiquidacionPrima;
              this.dataPrima.lstLiquidacionPrima = this.dataLiquidacion;
              this.dataPrima.lstStPensionActAFP = resp.lstStPensionActAFP;
              this.dataPrima.lstStDetPension = resp.lstStDetPension;
              this.dataSourceDetalle = new MatTableDataSource(this.dataLiquidacion);
              this.dataSourceDetalle.paginator = this.paginator2;
              this.llenarTablaResumen();
              Swal.fire('Alerta', resp.Mensaje, 'info');
            });

  }

  llenarTablaResumen() {
    let NumOrden = '';
    let NumIden = '';
    this.dataLiquidacionResumen = [];
    for (const item of this.dataLiquidacion) {
      if (item.NumOrden !== NumOrden || item.NumIdenPensionado !== NumIden) {
        NumOrden = item.NumOrden;
        NumIden = item.NumIdenPensionado;

        this.dataLiquidacionResumen.push(this.dataLiquidacion.find( pago => pago.NumOrden === NumOrden && pago.NumIdenPensionado === NumIden ));
      }
    }
    this.dataSourceResumen = new MatTableDataSource(this.dataLiquidacionResumen);
    this.dataSourceResumen.paginator = this.paginator;
  }

  async buscarPoliza(numPoliza: string) {
    if (numPoliza === '') {
      this.mensajeError = 'Favor de ingresar el número de pólizas a buscar.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    await this.ingresoPrimasService.getPoliza(numPoliza)
            .then( (resp: any) => {
              if (resp.Mensaje !== 'EXITOSO') {
                this.mostrarAlertaError('ERROR', resp.Mensaje);
                return;
              } else {
                resp.FechaAceptacion = resp.FechaAceptacion === '' ? '' : this.serviceFecha.formatGuion(new Date(moment(resp.FechaAceptacion).format('LLLL')));
                resp.FechaInfoAFP = resp.FechaInfoAFP === '' ? '' : this.serviceFecha.formatGuion(new Date(moment(resp.FechaInfoAFP).format('LLLL')));
                resp.FechaDevengue = resp.FechaDevengue === '' ? '' : this.serviceFecha.formatGuion(new Date(moment(resp.FechaDevengue).format('LLLL')));
                resp.FechaTraspasoPrima = resp.FechaTraspasoPrima === '' ? '' : this.serviceFecha.formatGuion(new Date(moment(resp.FechaTraspasoPrima).format('LLLL')));
                resp.FechaTopePrimerPago = resp.FechaTopePrimerPago === '' ? '' : this.serviceFecha.formatGuion(new Date(moment(resp.FechaTopePrimerPago).format('LLLL')));
                resp.FechaPrimerPago = resp.FechaPrimerPago === '' ? '' : this.serviceFecha.formatGuion(new Date(moment(resp.FechaPrimerPago).format('LLLL')));
                resp.FechaVigenciaPoliza = ''; // resp.FechaVigenciaPoliza === '' ? '' : this.serviceFecha.formatGuion(new Date(moment(resp.FechaVigenciaPoliza).format('LLLL')));
                resp.FecSolicitud = resp.FecSolicitud === '' ? '' : this.serviceFecha.format(new Date(moment(resp.FecSolicitud).format('LLLL')));
                //console.log(resp.MontoPensionGar)
                // console.log(resp);
                this.dataPrima = resp;
                //console.log(this.dataPrima);
                this.dataPrima.FechaTraspasoPrima = resp.FechaTopePrimerPago === '2001-01-01' ? '' : this.serviceFecha.formatGuion(new Date());
                this.dataPrima.FechaPrimerPago = resp.FechaTopePrimerPago === '2001-01-01' ? '' : resp.FechaPrimerPago;
                this.dataPrima.FechaTopePrimerPago = resp.FechaTopePrimerPago === '2001-01-01' ? '' : resp.FechaTopePrimerPago;

                this._antPrimaAFPServvice.getCodMoneda("NS").then((resp: any) => {
                  this.monedaNS = resp;
                });
        
                this._antPrimaAFPServvice.getCodMoneda(this.dataPrima.CodMoneda).then((resp: any) => {
                  this.monedaSolDolar = resp;
                });
              }
            });
  }

  async validacionForm( numpoliza: string, fecVigencia: string, fecTraspasoPrima: string, fecPrimerPago: string ) {
    if ( numpoliza === '' || fecVigencia === '' || fecTraspasoPrima === '' || fecPrimerPago === '' ) {
      this.mensajeError = 'Información no es válida. Favor de verificar.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
//console.log(this.dataPrima.MontoPensionGar)
this.btnGuardar = true;
this.dataPrima.Usuario =  localStorage.getItem('currentUser');
    await this.ingresoPrimasService.postGrabar(this.dataPrima)
            .then( (resp: any) => {
              if (resp.Mensaje !== 'EXITOSO.') {
                this.mensajeError = resp.Mensaje;
                this.mostrarAlertaError('ERROR', this.mensajeError);
                return;
              } else {
                this.mensajeError = 'Los datos se han actualizado satisfactoriamente';
                if(resp.Parametro == 'TRUE')
                {
                  this.btnEnvioPoliza = false;
                }
                this.btnAFP = false;
                this.vlBotonGrabar = true;
                this.mostrarAlertaExitosa('AVISO', this.mensajeError);

                let archivos: string[] = null;   
                var archivo = "";

                if(this.dataLiquidacion.length > 0)
                {
                  
                  let poliza = this.dataPrima.NumPoliza;
                  let moneda = this.dataPrima.CodMoneda;
                  let tipoPension = this.dataPrima.CodTipoPension
              
                  this.ingresoPrimasService.CrearReportes(poliza, moneda, tipoPension)
                  .then( (resp: any) => {
                    archivos = resp.result;
              
                    this.ingresoPrimasService.CrearZip(archivos)
                    .then( (resp: any) => {
                      archivo = resp.result;
                      
                      var blob = this.ingresoPrimasService.DescargarZIP(archivo).subscribe(res=>{  
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

                let pathArchivos = resp.PathZIP;
                this.ingresoPrimasService.GenerarZIPPrimas(pathArchivos)
                    .then( (resp: any) => {
                      let archivoPoliza = resp.result;
                      
                      var blob2 = this.ingresoPrimasService.DescargarPDFPrimas(archivoPoliza).subscribe(res=>{  
                        saveAs(res,archivoPoliza);
                      }, err=>{
                        console.log(err)
                    });
                });
                
              }
            });
  }

  async FechaPrimerPagoEst() {
    if (this.dataPrima.FechaTopePrimerPago === '') {
      this.dataPrima.FechaVigenciaPoliza = this.serviceFecha.formatGuion(new Date());
      this.dataPrima.FechaPrimerPago = this.serviceFecha.formatGuion(new Date());
      this.dataPrima.FechaTopePrimerPago = this.serviceFecha.formatGuion(new Date());
      await this.ingresoPrimasService.fgCalcularFechaPrimerPagoEst(this.dataPrima)
            .then( (resp: any) => {
              this.dataPrima.FechaPrimerPago = this.serviceFecha.formatGuion(new Date(moment(resp.FechaPrimerPago).format('LLLL')));
              this.dataPrima.FechaTopePrimerPago = this.serviceFecha.formatGuion(new Date(moment(resp.FechaTopePrimerPago).format('LLLL')));
              this.dataPrima.FechaVigenciaPoliza = '';
            });
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

  mostrarAlertaExitosa(pTitle: string, pText: string) {
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'success',
      allowOutsideClick: false
    });
  }
  flValidaPeriodoPagoRegimen(iPeriodo: string) {
    this.ingresoPrimasService.flValidaPeriodoPagoRegimen(iPeriodo)
                             .then( (resp: any) => {
                                 if ( resp.Fecha !== '' ) {
                                  this.mensajeError = 'Fecha de Primer Pago se encuentra definida para un Periodo de Pago de Pensiones ya Cerrado. Próximo Pago Recurrente se realizará en el Periodo ' + resp.Fecha;
                                  this.mostrarAlertaError('ERROR', this.mensajeError);
                                  return;
                                }
                             });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSourceDetalle.filteredData !== null && this.dataSourceDetalle.filteredData !== []) {
      this.dataSourceDetalle.filter = filterValue.trim().toLowerCase();
    }
  }

  exportar(){
    var archivo = "";

    this.ingresoPrimasService.getExportar(this.dataPrima.NumPoliza)
    .then( (resp: any) => {
      archivo = resp.result;
      
      var blob = this.ingresoPrimasService.DescargarPDF(archivo).subscribe(res=>{  
        saveAs(res,archivo);
      }, err=>{
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
    });


    });    
 
  }

  enviarPoliza(){
    var archivo = "";

    this.ingresoPrimasService.getEnviarPoliza(this.dataPrima.NumPoliza)
    .then( (resp: any) => {
      archivo = resp.result;
      if(archivo != null)
      {
        for(let poliza of archivo)
        {
          if(poliza != 'True')
          {
            this.mostrarAlertaError('ERROR', "Ocurrio un error al encriptar póliza.");
            return;
          }
          else
          {this.mostrarAlertaExitosa('Mensaje', "Las pólizas fuerón encriptadas correctamente.");
          }
        }
          
      }
      else
      {
        this.mostrarAlertaError('ERROR', "Error la póliza no se encuentra generada.");
        return;
      }
    });    
 
  }

}
