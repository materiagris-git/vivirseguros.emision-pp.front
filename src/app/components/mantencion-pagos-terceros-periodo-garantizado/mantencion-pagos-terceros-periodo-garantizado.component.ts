import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { MantPTPGService } from 'src/providers/mant-pt-pg.service';
import { ConsultaPolizaServiceService } from '../../../providers/consulta-poliza-service.service';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../../AppConst';
import { PGInfo, DetallePagoDatos, DetallePagoTabla, detallePago } from 'src/interfaces/mant-pt-pg-model';
import { MatTableDataSource } from '@angular/material/table';
import { cMantenedorTutoresApoderadosService } from 'src/providers/cMantenedorTutoresApoderados.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ConsultaObtencionImagenesService } from 'src/providers/consulta-obtencion-imagenes.service';
import * as $AB from 'jquery';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import { LoginService } from 'src/providers/login.service';
@Component({
  selector: 'app-mantencion-pagos-terceros-periodo-garantizado',
  templateUrl: './mantencion-pagos-terceros-periodo-garantizado.component.html',
  styleUrls: ['./mantencion-pagos-terceros-periodo-garantizado.component.css']
})
export class MantencionPagosTercerosPeriodoGarantizadoComponent implements OnInit {

  public cmbDepartamento: any[];
  public cmbProvincia: any[];
  public cmbDistrito: any[];
  public cmbSexo: any[];
  public cmbViaPago: any[];
  public cmbSucursal: any[];
  public cmbBanco: any[];
  public cmbTipoCta: any[] = [];
  arrayNoCuenta = [] = []; // Para el formato del número de cuenta en Forma de Pago según el Tipo de cuenta seleccionado.
  regexNoCuenta: RegExp; // Para el formato del número de cuenta en Forma de Pago según el Tipo de cuenta seleccionado.
  maxLengthNoCuenta = '20';
  TipoDoc = 0;
  cmbTipoIdent = [];
  Departamento = '';
  Provincia = '';
  Distrito = '';
  ViaPago = '00';
  Sucursal = '000';
  Banco = '00';
  TipoCta = '00';
  Direccion = '';
  desde;
  sucursal: boolean;
  tipoCta: boolean;
  banco: boolean;
  noCuenta: boolean;
  datosDir;
  columnas = [];
  dataSource: MatTableDataSource<unknown>;
  fechaPago;
  fechaRecepcion;
  tasaInteres = 0;
  infoPensionado: PGInfo = new PGInfo();
  detallePagoDatos: DetallePagoDatos = new DetallePagoDatos();
  detallePagoTabla: DetallePagoTabla = new DetallePagoTabla();
  detallePago: detallePago = new detallePago();
  imagenLoading: any;
  titleLoading: string;

  private url = AppConsts.baseUrl + 'mantenedorprepolizas';
  private urlPrePolizas = AppConsts.baseUrl + 'mantenedorprepolizas'; // Url para llenar combo de Tipo de Cuentas en Forma de Pago.

  constructor(private cdRef: ChangeDetectorRef,
              private router: Router,
              private _serviceFecha: ServiciofechaService,
              public titleService: Title,
              private _mantPTPGService: MantPTPGService,
              private consultaPolizaServiceService: ConsultaPolizaServiceService,
              private polizaAntPenService: cMantenedorTutoresApoderadosService,
              private http: HttpClient,
              private serviceLog:LoginService,
              private sanitizer: DomSanitizer,
              private consultaImagen: ConsultaObtencionImagenesService) {
    const objectURL = 'data:image/png;base64,' ;
    this.imagenLoading = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    this.columnas = ['item', 'parentesco', 'dni', 'nIdent','asegurado', 'estPension', 'estPagoGar', 'porPension', 'mtoPension', 'mesesPag', 'mesesNoDe', 'pensionNoP', 'fechaPago'];

    // Combos
    this.polizaAntPenService.getComboGeneral("SELECT_REGION", "").then((resp: any) => {
      this.cmbDepartamento = resp;
    });
    this.polizaAntPenService.getComboGeneral("SELECT_PROVINCIA", this.Departamento).then((resp: any) => {
      this.cmbProvincia = resp;
    });
    this.polizaAntPenService.getComboGeneral("SELECT_DISTRITO", this.Provincia).then((resp: any) => {
      this.cmbDistrito = resp;
      this.Distrito = '0';
    });
    this.http.get<any[]>(this.url + '/Comb?combo=SE').subscribe(result => {
      this.cmbSexo = result;
    }, error => console.error(error));

    this._mantPTPGService.getCombos("SELECT_COMBOGENERAL", "VPG").then((resp: any) => {
      this.cmbViaPago = resp;
    });

    this._mantPTPGService.getCombos("SELECT_COMBOGENERAL", "AF").then((resp: any) => {
      this.cmbSucursal = resp;
    });

    this._mantPTPGService.getCombos("SELECT_COMBOGENERAL", "BCO").then((resp: any) => {
      this.cmbBanco = resp;
    });
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if (this.detallePagoTabla) {
      if (this.ViaPago == "00") {
        this.sucursal = true;
        this.tipoCta = true;
        this.banco = true;
        this.noCuenta = true;
        this.Sucursal = "000";
        this.TipoCta = "00";
        this.Banco = "00";
        this.detallePagoTabla.num_cuenta = "";
      }
      if (this.ViaPago == "01") {
        this.sucursal = false;
        this.tipoCta = true;
        this.banco = true;
        this.noCuenta = true;
        this.TipoCta = "00";
        this.Banco = "00";
        this.detallePagoTabla.num_cuenta = "";
      }
      if (this.ViaPago == "02") {
        this.sucursal = true;
        this.tipoCta = false;
        this.banco = false;
        this.noCuenta = false;
        this.Sucursal = "000";
      }
      if (this.ViaPago == "04") {
        this.sucursal = false;
        this.tipoCta = true;
        this.banco = true;
        this.noCuenta = true;
        this.TipoCta = "00";
        this.Banco = "00";
        this.detallePagoTabla.num_cuenta = "";
      }
      if (this.ViaPago == "05") {
        this.sucursal = true;
        this.tipoCta = true;
        this.banco = false;
        this.noCuenta = true;
        this.Sucursal = "000";
        this.TipoCta = "00";
        //this.Banco = "00";
        this.detallePagoTabla.num_cuenta = "";
      }
    }
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this._mantPTPGService.getPGInfo(Globales.datosMantPT_PG.NumPoliza, Globales.datosMantPT_PG.CodTipoIdenBen, Globales.datosMantPT_PG.NumIdenBen, Globales.datosMantPT_PG.NumEndoso).then((resp: any) => {
      if(resp.detallePago){
        if(resp.detallePago.Mensaje=="Error"){
          Swal.fire({ title: 'Advertencia', text: ' La Póliza Seleccionada No tiene Derecho al Pago de una Pensión Garantizada.', icon: 'warning', allowOutsideClick: false }).then(
            (result)=>{
              this.router.navigate(['/consultaPagoTercerosPG'])
            }
          )
        }
        else{
          this.infoPensionado = resp.info_PG;
          this.detallePago = resp.detallePago;
          this.detallePagoDatos = resp.detallePagoDatos;
          this.dataSource = new MatTableDataSource(resp.detallePagoTabla);
        }
      }
    });

    this.consultaImagen.getLoadingImagen().then( (resp: any) => {
      const objectURL = 'data:image/png;base64,' + resp.Data;
      this.imagenLoading = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.titleLoading = resp.Nombre;
    });

  }

  ngAfterViewInit(): void {
    if (Globales.datosMantPT_PG.NumPoliza == "" && Globales.datosMantPT_PG.CodTipoIdenBen == 0 && Globales.datosMantPT_PG.NumIdenBen == "" && Globales.datosMantPT_PG.NumEndoso == 0) {
      this.router.navigate(['/consultaPagoTercerosPG']);
    }
    Globales.titlePag = 'Mantención de Pagos a Terceros - Periodo Garantizado';
    this.titleService.setTitle(Globales.titlePag);
    this.cdRef.detectChanges();
    this.getCombo();
  }

  getCombo() {
    this.consultaPolizaServiceService.getCombo()
      .then((resp: any) => {
        this.cmbTipoIdent = resp;
      });
  }

  onChangeLlenaProvincia() {
    this.polizaAntPenService.getComboGeneral("SELECT_PROVINCIA", this.Departamento).then((resp: any) => {
      this.cmbProvincia = resp;
    });
    this.cmbDistrito = [];
  }

  onChangeLlenaDistrito() {
    this.polizaAntPenService.getComboGeneral("SELECT_DISTRITO", this.Provincia).then((resp: any) => {
      this.cmbDistrito = resp;
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  lettersOnly(event) {
    event = (event.toUpperCase()) ? event.toUpperCase() : event.toUpperCase();
    var charCode = (event.charCode) ? event.charCode : ((event.keyCode) ? event.keyCode :
      ((event.which) ? event.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  onlyAlphaNumeric(event) {
    if ((event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57)) {
      event.preventDefault();
    }
  }

  onlyDecimalNumberKey(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }


  async datosRow(row) {
    this.detallePagoTabla = row;

    this.ViaPago = this.detallePagoTabla.cod_viapago === '' ? '00' : this.detallePagoTabla.cod_viapago;
    this.Sucursal = this.detallePagoTabla.cod_sucursal;
    this.Banco = this.detallePagoTabla.cod_banco;
    this.TipoCta = this.detallePagoTabla.cod_tipcuenta;
    await this.cambiarBanco('');

    //se valida si ya se modificacaron las fechas y la taza
    if (this.detallePagoTabla.fechaRecepcion == "" || this.detallePagoTabla.fechaRecepcion == null || this.detallePagoTabla.fechaPago==null|| this.detallePagoTabla.fechaPago=="") {
      this.fechaRecepcion = "";
      this.fechaPago = "";
      this.tasaInteres = 0.00;
    } else {
      this.fechaPago = this.detallePagoTabla.fechaPago.split("/").reverse().join("-");
      this.fechaRecepcion = this.detallePagoTabla.fechaRecepcion.split("/").reverse().join("-");
      this.tasaInteres = this.detallePagoTabla.tasaInteres;

      if(this.fechaPago == null || this.fechaPago == ""){
        this.detallePagoTabla.vlTipCambio = 0;
      }else{
        this.fechaPagoChange(this.fechaPago);
      }
    }

    this.datosDir;
    this.Departamento = this.detallePagoTabla.datosDire[0].Cod_Region;
    this.Provincia = this.detallePagoTabla.datosDire[0].Cod_Provincia;
    this.Distrito = this.detallePagoTabla.datosDire[0].Cod_Comuna;
    this.Direccion = this.detallePagoTabla.datosDire[0].GLS_DIRECCION;
    this.onChangeLlenaProvincia();
    this.onChangeLlenaDistrito();
    // this.cambiarTipoCuenta();
  }

  nuevaDireccion(dep, prov, dis) {
    this._mantPTPGService.nuevaDireccion(dep, prov, dis).then((resp: any) => {
      this.Direccion = resp.gls_dirben;
      this.detallePagoTabla.cod_direccion = resp.cod_direccion;

      this.datosDir;
      this.detallePagoTabla.datosDire[0].Cod_Region = this.Departamento;
      this.detallePagoTabla.datosDire[0].Cod_Provincia = this.Provincia;
      this.detallePagoTabla.datosDire[0].Cod_Comuna = this.Distrito;
      this.detallePagoTabla.datosDire[0].GLS_DIRECCION = this.Direccion;
    })
  }
  aceptarModalDir() {
    if (this.Departamento != "" && this.Provincia != "" && this.Distrito != "") {
      this.nuevaDireccion(this.Departamento, this.Provincia, this.Distrito);
    }
    else {
      this.Departamento = "";
      this.Provincia = "";
      this.Distrito = "";
      this.Direccion = "";
    }
    (<any>$('#modalDirecciones')).modal('hide');
  }

  aceptarModalTel(){
    var valido = true;
    if (this.detallePagoTabla.GLS_FONO3 !== '') {
      if (this.detallePagoTabla.GLS_FONO3.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.detallePagoTabla.GLS_FONO3.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.detallePagoTabla.GLS_FONO2 !== '') {
      if (this.detallePagoTabla.GLS_FONO2.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.detallePagoTabla.GLS_FONO2.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.detallePagoTabla.gls_fonoben !== '') {
      if (this.detallePagoTabla.gls_fonoben.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.detallePagoTabla.gls_fonoben.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }
    if(valido == true){
      (<any>$('#modalTelefonos')).modal('hide');
    }
  }

  fechaPagoChange(event) {
    var fecha = event === '' ? '' : this._serviceFecha.formatBD(new Date(moment(event).format('LLLL')))

    this._mantPTPGService.tipoCambio(fecha, this.detallePagoDatos.CodMoneda).then((resp: any) => {
      this.detallePagoDatos.vlTipCambio = resp.MtoMoneda;
      this.detallePagoTabla.vlTipCambio = resp.MtoMoneda;
    })
  }

  validar_email( email ) {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  calcular() {
    var calculo: boolean = true;

    if (this.detallePagoTabla.num_orden == 0) {
      Swal.fire({ title: 'Advertencia', text: 'Debe Seleccionar un beneficiario a calcular.', icon: 'warning', allowOutsideClick: false });
      calculo = false;
      return;
    }
    if (this.detallePagoTabla.vlEstPago == "Pagado") {
      Swal.fire({ title: 'Advertencia', text: 'No se Puede Calcular ya que el Periodo Garantizado se Encuentra Pagado.', icon: 'warning', allowOutsideClick: false });
      calculo = false;
      return;
    }
    if (this.fechaPago == null || this.fechaPago == "") {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar la Fecha de Pago.', icon: 'warning', allowOutsideClick: false });
      calculo = false;
      return;
    }
    if (this.tasaInteres == null || this.tasaInteres.toString() == "") {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar la Tasa de Interés Anual del Pago.', icon: 'warning', allowOutsideClick: false });
      calculo = false;
      return;
    }
    if (this.tasaInteres == 0 || this.tasaInteres == 0.00) {
      Swal.fire({ title: 'Advertencia', text: 'Debe ingresar un valor distinto de Cero para la Tasa de Interés.', icon: 'warning', allowOutsideClick: false });
      calculo = false;
      return;
    }
    if (this.detallePagoTabla.cod_estpension == "10") {
      Swal.fire({ title: 'Advertencia', text: 'Este Beneficiario no tiene Derecho a Pago de Pensiones.', icon: 'warning', allowOutsideClick: false });
      calculo = false;
      return;
    }

    if (this.detallePagoTabla.fec_inipagopen.split("/").reverse().join("") > this.fechaPago.split("-").join("")) {
      Swal.fire({ title: 'Advertencia', text: 'La Fecha de Pago es anterior a la Fecha de Inicio del Pago Garantizado.', icon: 'warning', allowOutsideClick: false });
      calculo = false;
      return;
    }


    //validaciones de flValidaDatos
    if (this.fechaRecepcion == "") {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar la Fecha de Recepción del Pago.', icon: 'warning', allowOutsideClick: false });
      return;
    } else {
      if (moment(new Date(this.fechaRecepcion)).format('YYYY') < moment(new Date("1900-01-01")).format('YYYY')) {
        Swal.fire({ title: 'Advertencia', text: 'La Fecha de Recepción ingresada es menor a la mínima que se puede ingresar (1900).', icon: 'warning', allowOutsideClick: false });
        return;
      }
    }

    if (moment(new Date(this.fechaPago)).format('YYYY') < moment(new Date("1900-01-01")).format('YYYY')) {
      Swal.fire({ title: 'Advertencia', text: 'La Fecha de Pago ingresada es menor a la mínima que se puede ingresar (1900).', icon: 'warning', allowOutsideClick: false });
      return;
    }

    if (new Date(this.fechaRecepcion) > new Date(this.fechaPago)) {
      Swal.fire({ title: 'Advertencia', text: 'La Fecha de Pago debe ser mayor a la Fecha de Recepción', icon: 'warning', allowOutsideClick: false });
      return;
    }

    //'Valida información del Beneficiario
    if (this.detallePagoTabla.gls_dirben == "") {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar la Dirección del Beneficiario.', icon: 'warning', allowOutsideClick: false });
      return;
    }
    if (this.Direccion == "") {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar la Ubicación del Beneficiario.', icon: 'warning', allowOutsideClick: false });
      return;
    }
    if (this.detallePagoTabla.gls_correoben == "") {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar el Email del Beneficiario.', icon: 'warning', allowOutsideClick: false });
      return;
    }

    
    //'Valida la Forma de Pago
    var vlCodViaPgo = this.ViaPago;
    var vlCodSucursal = this.Sucursal;
    var vlCodTipCuenta = this.TipoCta;
    var vlCodBco = this.Banco;
    if (vlCodViaPgo == "00") {
      Swal.fire({ title: 'Advertencia', text: 'Debe Seleccionar Forma de Pago.', icon: 'warning', allowOutsideClick: false });
      return;
    }
    if ((vlCodViaPgo === "01" || vlCodViaPgo === '04') && vlCodSucursal === '') {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar la Sucursal de la Vía de Pago', icon: 'warning', allowOutsideClick: false });
        return;
    }
    if (vlCodViaPgo === "02" || vlCodViaPgo === "03") {
      if (vlCodBco == "00") {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Banco', icon: 'warning', allowOutsideClick: false });
        return;
      }
      if (vlCodTipCuenta == "00") {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Tipo de Cuenta', icon: 'warning', allowOutsideClick: false });
        return;
      }
      if (this.detallePagoTabla.num_cuenta == "") {
        Swal.fire({ title: 'Advertencia', text: 'Debe ingresar el Número de Cuenta', icon: 'warning', allowOutsideClick: false });
        return;
      }

      if (!this.validaNoCuenta(this.detallePagoTabla.num_cuenta) || this.detallePagoTabla.num_cuenta.length !== Number(this.maxLengthNoCuenta)) {
        Swal.fire('Error', 'Número de cuenta inválido.', 'error');
        return;
      }
    }

    if (calculo == true) {
      (<any>$('#modalConfirmar')).modal('show');
    }
  }

  calculoCorr() {
    this.tasaInteres;
    this.detallePagoTabla.fec_terpagopengar = this.detallePagoDatos.FecFinpergar;
    var FactorVA = 0;
    var MtoVA = 0;
    var MesesTranscurridos = 0;
    var MesesNodevengados = 0;

    var Pension = this.detallePagoTabla.mto_pensiongar;
    var FInicioPG = this.detallePagoDatos.FecInipagopen.split("/").reverse().join("");

    var FFinPG = this.detallePagoTabla.fec_terpagopengar.split("/").reverse().join("");
    var FCalculo = this._serviceFecha.formatBD(new Date(moment(this.fechaPago).format('LLLL')));

    var iab = Number(FCalculo.substring(0, 4));
    var imb = Number(FCalculo.substring(4, 6));
    var idb = Number(FCalculo.substring(6, 8));

    var iaIpG: number = Number(FInicioPG.substring(0, 4));
    var imIpG: number = Number(FInicioPG.substring(4, 6));
    var idIpG: number = Number(FInicioPG.substring(6, 8));

    var iaFpG: number = Number(FFinPG.substring(0, 4));
    var imFpG: number = Number(FFinPG.substring(4, 6));
    var idFpG: number = Number(FFinPG.substring(6, 8));

    var MesesTranscurridos = ((iab * 12 + imb) - (iaIpG * 12 + imIpG)) + 1;
    this.detallePagoTabla.num_mesespag = ((iab * 12 + imb) - (iaIpG * 12 + imIpG)) + 1;

    var MesesNodevengados = ((iaFpG * 12 + imFpG) - (iab * 12 + imb));
    this.detallePagoTabla.num_mesesnodev = ((iaFpG * 12 + imFpG) - (iab * 12 + imb));

    var tasaAnual = this.tasaInteres / 100;
    var TasaMensual = Math.pow((1 + tasaAnual), (1 / 12)) - 1;

    FactorVA = (1 - (1 / Math.pow((1 + TasaMensual), this.detallePagoTabla.num_mesesnodev))) / TasaMensual;


    var MtoVA = Pension * (1 - (1 / Math.pow((1 + TasaMensual), MesesNodevengados))) / TasaMensual;
    this.detallePagoTabla.mto_pago = Number(MtoVA.toFixed(2));
    this.detallePagoTabla.vlTipCambio = this.detallePagoDatos.vlTipCambio;
    this.detallePagoTabla.vlEstPago = "Calculado"
    //inicia metodo del botn de actualizar info
    this.detallePagoTabla.fechaRecepcion = this.fechaRecepcion;
    this.detallePagoTabla.fechaPago = moment(this.fechaPago).format('DD/MM/YYYY');
    this.detallePagoTabla.tasaInteres = this.tasaInteres;

    this.detallePagoTabla.cod_viapago = this.ViaPago;
    this.detallePagoTabla.cod_sucursal = this.Sucursal;
    this.detallePagoTabla.cod_banco = this.Banco;
    this.detallePagoTabla.cod_tipcuenta = this.TipoCta;
  }

  Guardar(buffer: any) {
    var valida = false;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i].vlEstPago == "Calculado") {
        valida = true;
      }
    }
    if (valida) {
      var obj = { info_PG: this.infoPensionado, detallePagoDatos: this.detallePagoDatos, detallePagoTabla: buffer, detallePago: this.detallePago, Usuario: localStorage.getItem('currentUser')}
      this._mantPTPGService.GrabarInfo(obj).then((resp: any) => {
        if (resp.Mensaje == "error1") {
          Swal.fire({ title: 'Error', text: 'Problemas al tratar de generar el Nuevo Número de Endoso de la Póliza seleccionada.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if (resp.Mensaje == "Exito") {
          Swal.fire({ title: 'Éxito', text: 'Se ha registrado correctamente el Pago Garantizado.', icon: 'success', allowOutsideClick: false });
          this.ngOnInit();
          return;
        } else {
          Swal.fire({ title: 'Error', text: resp.Mensaje, icon: 'error', allowOutsideClick: false });
          return;
        }
      });
    }
    else {
      Swal.fire({ title: 'Advertencia', text: 'No Existen Beneficiarios a Grabar.', icon: 'warning', allowOutsideClick: false });
      return;
    }
  }

  // Función para consultar los Tipos de Cuenta según el Banco seleccionado.
  async cambiarBanco(bandera: string) {
    let vlCodBanco = this.Banco === '' ? '' : this.Banco;
    this.TipoCta = bandera === 'combo' ? '' : this.TipoCta;
    this.detallePagoTabla.num_cuenta = bandera === 'combo' ? '' : this.detallePagoTabla.num_cuenta;

    await this.http.get<any[]>(this.urlPrePolizas + '/CmbTipoCuenta?pCodBanco=' + vlCodBanco).subscribe(result => {
      this.cmbTipoCta = result;
      this.cambiarTipoCuenta();
    }, error => console.error(error));
  }

  // Funcion para validar el formado del número de cuenta.
  validaNoCuenta(pNumCuenta) {
    return this.regexNoCuenta.test(pNumCuenta) ? true : false;
  }

  async cambiarTipoCuenta() {
    let contX = 0;

    if (this.TipoCta !== '' && this.TipoCta !== '00') {
      this.maxLengthNoCuenta = this.cmbTipoCta.find(item => item.COD_CUENTA === this.TipoCta).NUM_DIGITOS;
      this.arrayNoCuenta = this.cmbTipoCta.find(item => item.COD_CUENTA === this.TipoCta).NUM_CUENTA.split('X');

      for (let i = 0; i <= this.arrayNoCuenta.length - 1; i++) {
        if (this.arrayNoCuenta[i] === '') {
          contX++;
        }
      }

      if ((contX - 1) === Number(this.maxLengthNoCuenta)) {
        this.regexNoCuenta = new RegExp(`\\d{${ contX - 1 }}`);
      }

      if (this.arrayNoCuenta[0] !== '' && this.arrayNoCuenta[this.arrayNoCuenta.length - 1] === '') {
        this.regexNoCuenta = new RegExp(`^(${ this.arrayNoCuenta[0] })+(\\d{${ contX }})$`);
      }

      if (this.arrayNoCuenta[0] !== '' && this.arrayNoCuenta[this.arrayNoCuenta.length - 1] !== '') {
        this.regexNoCuenta = new RegExp(`^(${ this.arrayNoCuenta[0] })+(\\d{${ contX + 1 }})+(${ this.arrayNoCuenta[this.arrayNoCuenta.length - 1] })$`);
      }

      if (this.arrayNoCuenta[0] === '' && this.arrayNoCuenta[this.arrayNoCuenta.length - 1] !== '') {
        this.regexNoCuenta = new RegExp(`^(\\d{${ contX + 1 }})+(${ this.arrayNoCuenta[this.arrayNoCuenta.length - 1 ] })$`);
      }
    }
  }

  cerrarModalTel(){

    this.validarTelefonos();
    (<any>$('#modalTelefonos')).modal('hide');
  }


  validarTelefonos(){

    if (this.detallePagoTabla.GLS_FONO3 !== '') {
      if (this.detallePagoTabla.GLS_FONO3.length < 7) {
        this.detallePagoTabla.GLS_FONO3 = "";

      }
      if (this.detallePagoTabla.GLS_FONO3.length > 9) {
        this.detallePagoTabla.GLS_FONO3 = "";

      }
    }

    if (this.detallePagoTabla.GLS_FONO2 !== '') {
      if (this.detallePagoTabla.GLS_FONO2.length < 7) {
        this.detallePagoTabla.GLS_FONO2 = "";

      }
      if (this.detallePagoTabla.GLS_FONO2.length > 9) {
        this.detallePagoTabla.GLS_FONO2 = "";

      }
    }

    if (this.detallePagoTabla.gls_fonoben !== '') {
      if (this.detallePagoTabla.gls_fonoben.length < 7) {
        this.detallePagoTabla.gls_fonoben = "";

      }
      if (this.detallePagoTabla.gls_fonoben.length > 9) {
        this.detallePagoTabla.gls_fonoben = "";

      }
    }

  }

  cerrarModalCorreos() {
    this.validarCorreos();
    (<any>$('#modalCorreos')).modal('hide');
  }
  
  validarCorreos() {
    if (this.detallePagoTabla.gls_correoben !== '') {
      const valEmail = this.validar_email(this.detallePagoTabla.gls_correoben);
      if (!valEmail) {
        this.detallePagoTabla.gls_correoben = "";
      }
    }

    if (this.detallePagoTabla.GLS_CORREO2 !== '') {
      const valEmail = this.validar_email(this.detallePagoTabla.GLS_CORREO2);
      if (!valEmail) {
        this.detallePagoTabla.GLS_CORREO2 = "";
      }
    }

    if (this.detallePagoTabla.GLS_CORREO3 !== '') {
      const valEmail = this.validar_email(this.detallePagoTabla.GLS_CORREO3);
      if (!valEmail) {
        this.detallePagoTabla.GLS_CORREO3 = "";
      }
    }
  }

  aceptarModalCorreos() {
    var valido = true;
    if (this.detallePagoTabla.gls_correoben !== '') {
      const valEmail = this.validar_email(this.detallePagoTabla.gls_correoben);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 1 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.detallePagoTabla.GLS_CORREO2 !== '') {
      const valEmail = this.validar_email(this.detallePagoTabla.GLS_CORREO2);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 2 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.detallePagoTabla.GLS_CORREO3 !== '') {
      const valEmail = this.validar_email(this.detallePagoTabla.GLS_CORREO3);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 3 no tiene formato válido.', 'error');
        valido = false;
      }
    }
    if (valido == true) {
      (<any>$('#modalCorreos')).modal('hide');
    }
  }

}
