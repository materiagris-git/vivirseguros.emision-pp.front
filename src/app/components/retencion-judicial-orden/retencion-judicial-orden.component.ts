import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { MatTableDataSource } from '@angular/material/table';
import { RetencionJudicial, DatosAntecedentesRetencion, DatosTutorInfo, DatosRetencion } from 'src/interfaces/consultaRetencionJudicial.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RetencionJudicialOrdenService } from 'src/providers/retencion-judicial-orden.service';
import { ConsultaPolizaServiceService } from '../../../providers/consulta-poliza-service.service';
import { PolizaAntecedentesPensionadosService } from 'src/providers/poliza-antecedentes-pensionados.service';
import { BeneficiarioInfo } from 'src/interfaces/PolizaAntecedentesPensionado.model';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { LoginService } from 'src/providers/login.service';
import * as moment from 'moment';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import { MantenedorPrepolizasService } from 'src/providers/mantenedorPrePolizas.service';
import { AppConsts } from 'src/app/AppConst';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-retencion-judicial-orden',
  templateUrl: './retencion-judicial-orden.component.html',
  styleUrls: ['./retencion-judicial-orden.component.css']
})
export class RetencionJudicialOrdenComponent implements OnInit, AfterViewInit {

  insertar = true;
  MTO_RETMAX= 0.00;
  MTO_RET= 0.00;
  tipRenta;
  vlCodTipRet='RJ';
  vlCodModRet='PRCIM';
  vlCodDctoMto='B';
  activeTab = 'retencionJud';
  activeTab2 = 'historiaRet';
  maxLengthNumDoc = '15';
  TipoIden = 0;
  direccionStr: any;
  distritos: any = {codigo: 0, descripcion:'', ubigeo:0};
  public cmbSucursal: any[];
  public cmbViaPago: any[];
  public cmbTipoCuenta: any[];
  public cmbBanco: any[];
  public cmbDepartamento: any[];
  public cmbProvincia: any[];
  public cmbDistrito: any[];
  public cmbDistritoAll: any[];
  consulta: RetencionJudicial = new RetencionJudicial();
  comboTipRet = [];
  comboModRet = [];
  comboDctoMto = [];
  respuesta: any = {Mensaje:''};
  mensajeError = '';
  hoy = new Date();
  fechaMinima = '1900-01-01'
  vigenciaPoliza = '';
  codUbigeo = 0;
  fecTerret ='';
  fecCarta ='9999-12-31';
  pol: RetencionJudicial = {
    NumeroPoliza: '',
    CUSPP: '',
    IdTipoDoc: 0,
    TipoDocumento: '',
    NoDocumetnto: '',
    NoEndoso: 0,
    Paterno: '',
    Materno: '',
    Nombre: '',
    SegundoNombre: '',
    Titular: '',
    Documento: '',
    Fecha: '',
    Vigencia: '',
    Estatus: '',
    lstConsulta: null,
    lstInfoTutor: null,
    lstHistTutor: null,
    NumOrden: 0,
    AFP: 0,
    Periodo: '',
    lstReceptor: null,
    listaRetencion: null
  };
  listaRetenciones: DatosRetencion = {
    NUM_RETENCION: 0,
  NUM_POLIZA: '',
  COD_TIPRET: '',
  FEC_INIRET: '',
  FEC_TERRET: '',
  FEC_RESDOC: '',
  COD_MODRET: '',
  MTO_RET: 0,
  GLS_NOMJUZGADO: '',
  NUM_IDENRECEPTOR: '',
  COD_TIPOIDENRECEPTOR: 0,
  GLS_NOMRECEPTOR: '',
  GLS_NOMSEGRECEPTOR: '',
  GLS_PATRECEPTOR: '',
  GLS_MATRECEPTOR: '',
  GLS_DIRRECEPTOR: '',
  COD_DIRECCION: 0,
  GLS_FONORECEPTOR: '',
  GLS_EMAILRECEPTOR: '',
  COD_VIAPAGO: '',
  COD_TIPCUENTA: '',
  COD_BANCO: '',
  NUM_CUENTA: '',
  COD_SUCURSAL: '',
  MTO_RETMAX: 0,
  FEC_EFECTO: '',
  NUM_CUENTACCI: '',
  Cod_Region: '',
  Cod_Provincia: '',
  Cod_Comuna: '',
  GLS_FONORECEPTOR2: '',
  COD_DCTOMTO:'',
  Porcentaje: 0,
  Calculo: '',

  };
  infoRetencion: DatosTutorInfo = {
    Bandera: '',
    NumPoliza: '',
    DuracionMeses: 0,
    fechaPeriodoInicio: '',
    fechaPeriodoFin: '',
    tipRetencion: '',
    tipModalidad: '',
    MontoRet: 0,
    FechaEfecto: '',
    FechaRecepcion: '',
    MontoRetmax: 0,
    Nomjuzgado: '',
    codTipoidenben: 0,
    NUM_IDENBEN: '',
    Nombre1: '',
    Nombre2: '',
    ApellidoPat: '',
    ApellidoMat: '',
    Direccion: '',
    Telefono1: '',
    Correo1: '',
    codDireccion: 0,
    CodViaPago: '',
    CodTipCuenta: '',
    CodBanco: '',
    CodSucursal: '',
    NumCuenta: '',
    FecTerminoRetencion: '',
    GLS_FONO2: '',
    GLS_FONO3: '',
    GLSCorreo2: '',
    GLSCorreo3: '',
    NumCuentaCCI: '',
    CodRegion: '',
    CodProvincia: '',
    CodComuna: '',
    NumOrden: '',
    NumEndoso: 0,
    numRetencion: 0,
    tipDctoMto : '',
    Calculo: '',
    Porcentaje: 0,
  };
  antecedentesRep: DatosAntecedentesRetencion = new DatosAntecedentesRetencion();
  antecedentesPer: DatosTutorInfo = new DatosTutorInfo();
  beneficiariosInfo: BeneficiarioInfo = new BeneficiarioInfo();
  columnas = [];
  cmbTipoIdent = [];
  comboDistritoResp = [];

  tipRetencion = '';
  tipModalidad = '';
  tipDctoMto= '';
  TipoDoc = 0;
  CodViaPago = '';
  CodSucursal = '';
  CodTipoCuenta = '';
  CodBanco = '';
  NumCuenta = '';
  Departamento = '';
  Distrito = '';
  Provincia = '';
  CodInter = '';

  TipoNumIdent = 0;

  mlTelefono = 10;

  isDisabledViaPago = true;
  isDisabledSucursal = true;
  isDisabledTipoCuenta = true;
  isDisabledBanco = true;
  isDisabledNumCuenta = true;
  isDisabledNumCuentaCci = true;
  isDisabledMtoFij = false;
  isDisabledPrcje = true;

  maxLengthNumCuenta = '20';
  regexNumCuenta: RegExp; // Para el número de cuenta
  arrayNumCuenta = []; // Para el número de cuenta

  private urlPrePolizas = AppConsts.baseUrl + 'mantenedorprepolizas';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private activatedRoute: ActivatedRoute,
              public titleService: Title,
              private retencionService: RetencionJudicialOrdenService,
              private consultaPolizaServiceService: ConsultaPolizaServiceService,
              private polizaAntPenService: PolizaAntecedentesPensionadosService,
              private cdRef: ChangeDetectorRef,
              private router: Router,
              private http: HttpClient,
              private serviceLog:LoginService,
              private serviceFecha: ServiciofechaService,
              private mantenedorPrepolizasService :MantenedorPrepolizasService,
              private prePolizasService: MantenedorPrepolizasService,) {
    this.columnas = [
      'item',
      'vigDesde',
      'vigHasta',
      'tipoRenta',
      'modalidad',
      'monto',
      'porcentaje',
      'tipo',
      'numIden',
      'nombre',
      'paterno',
      'materno'
    ];
    this.retencionService.getComboTipRet().then((resp: any) => {
      this.comboTipRet = resp;
      this.tipRetencion = this.comboTipRet[0].CodElemento;
    });
    this.retencionService.getComboModRet().then((resp: any) => {
      this.comboModRet = resp;
      this.vlCodModRet = '01'        
    });
    this.retencionService.getComboDctoMto().then((resp: any) => {
      this.comboDctoMto = resp;
      this.tipDctoMto = this.comboDctoMto[0].CodElemento;      
    });
    this.polizaAntPenService.getCombos('SELECT_SUCURSAL', 'S').then( (resp: any) => {
      this.cmbSucursal = resp;
    });
    this.polizaAntPenService.getComboGeneral('VPG').then( (resp: any) => {
      this.cmbViaPago = resp;
      this.CodViaPago = '00';
    });
    this.polizaAntPenService.getComboGeneral('TCT').then( (resp: any) => {
      this.cmbTipoCuenta = resp;
      this.CodTipoCuenta = '00';
    });
    this.polizaAntPenService.getComboGeneral('BCO').then( (resp: any) => {
      this.cmbBanco = resp;
      this.CodBanco = '00';
    });
    this.polizaAntPenService.getComboDepartamento().then( (resp: any) => {
      this.cmbDepartamento = resp;
    });
    this.polizaAntPenService.getComboProvincia(this.Departamento).then( (resp: any) => {
      this.cmbProvincia = resp;
    });

    // Carga todos los distritos
    this.mantenedorPrepolizasService.getComboDistritoAll().then( (resp: any) => {
      this.cmbDistritoAll = resp;
      this.comboDistritoResp = this.cmbDistritoAll.slice();
    });

  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    if (Globales.datosAntPensionados.NumPoliza === '') {
      this.router.navigate(['/retencionesJudiciales']);
    }
    this.cdRef.detectChanges();
    Globales.titlePag = 'Mantenedor de Retenciones Judiciales';
    this.titleService.setTitle(Globales.titlePag);
  }

  ngAfterViewInit() {
    this.validacionCmbViaPago('');
    this.pol.NumeroPoliza = Globales.datosAntPensionados.NumPoliza;
    this.getCombo();
    this.buscarPoliza();
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
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
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

  mostrarAlertaError(pTitle: string, pText: string){
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'error',
      allowOutsideClick: false
    });
  }

  async cambioDir() {
    await this.prePolizasService.getDireccion(this.listaRetenciones.COD_DIRECCION)
    .then((resp: any) => {
      this.direccionStr = resp.DireccionStr;
      // this.dirCorrStr = this.direccionStrs.DirCorrStr;
    });
  }
  buscarPoliza() {
    this.retencionService.getConsultaPoliza(this.pol).then((resp: any) => {
      this.consulta = resp;
      if (this.consulta != null){
        this.TipoNumIdent = resp.AFP;
        this.buscarAntecedentesRetencion();
      }
    })
  }

  getCombo()  {
    this.consultaPolizaServiceService.getCombo()
      .then((resp: any) => {
        this.cmbTipoIdent = resp;
      });
  }

  cambiarTipoIden() {
    var tipoDoc = Number(this.TipoIden);
    tipoDoc = Number(this.listaRetenciones.COD_TIPOIDENRECEPTOR); // Number(this.TipoIden);
    this.listaRetenciones.NUM_IDENRECEPTOR = '';

    if (tipoDoc === 1) {
      this.maxLengthNumDoc = '8';
    }
    if (tipoDoc === 2 || tipoDoc === 5) {
      this.maxLengthNumDoc = '12';
    }
    if (tipoDoc === 9) {
      this.maxLengthNumDoc = '11';
    }
    if (tipoDoc === 3 || tipoDoc === 4 || (tipoDoc > 5 && tipoDoc < 9) || tipoDoc === 10 || tipoDoc === 0) {
      this.maxLengthNumDoc = '15';
    }
  }

  buscarAntecedentesRetencion() {
    this.retencionService.getConsultaAntecedentesRetenciones(this.consulta).then((resp: any) => {
      this.antecedentesRep = resp.lstReceptor;
      this.consulta.lstReceptor = this.antecedentesRep;

      const array = [];
      array.push(resp.lstReceptor);

      this.dataSource = new MatTableDataSource(resp.lstReceptor);
      this.dataSource.paginator = this.paginator;

      //$("#tipRetencion option:first").attr('selected','selected');
      //$("#tipModalidad option:first").attr('selected','selected');
    }).catch(() => {
      Swal.fire('Error', 'La información no ha cargado correctamente.', 'error');
    });
  }

  cambio(tab)
  {
    this.activeTab = tab;
  }

  buscarAntecedentesPersonales(row) {
    this.insertar = false;
    this.consulta.NumRetencion = row.numRetencion;
    this.retencionService.getConsultaAntecedentesPersonales(this.consulta).then((resp: any) => {
      this.antecedentesPer = resp;
      this.TipoDoc = resp.COD_TIPOIDENRECEPTOR;
      this.listaRetenciones = resp;
      this.codUbigeo = this.listaRetenciones.COD_DIRECCION;
      this.MTO_RET = this.listaRetenciones.MTO_RET;
      this.MTO_RETMAX =  this.listaRetenciones.MTO_RETMAX;
      this.vlCodTipRet = this.listaRetenciones.COD_TIPRET;
      this.vlCodModRet = this.listaRetenciones.COD_MODRET;
      //this.vlCodDctoMto =  this.tipDctoMto;
      this.vlCodModRet = this.listaRetenciones.tipDctoMto;
      this.vlCodDctoMto =  this.listaRetenciones.Calculo;

      //this.codUbigeo = resp.lstInfoTutor.Ubigeo;
      //this.Distrito = this.codUbigeo.toString();
      this.polizaAntPenService.getComboDepartamento().then( ( resp: any) => {
        this.cmbDepartamento = resp;
      });

      // tslint:disable-next-line:no-shadowed-variable
      this.polizaAntPenService.getComboProvincia(this.listaRetenciones.Cod_Region).then( ( resp: any) => {
        this.cmbProvincia = resp;
      });

      // tslint:disable-next-line:no-shadowed-variable
      // this.polizaAntPenService.getComboDistrito(this.listaRetenciones.Cod_Provincia).then( ( resp: any) => {
      //   this.cmbDistrito = resp;
      //   this.distritos = resp;
      // });
      this.CodViaPago = this.listaRetenciones.COD_VIAPAGO;
      this.CodSucursal = this.listaRetenciones.COD_SUCURSAL;
      this.CodTipoCuenta = this.listaRetenciones.COD_TIPCUENTA;
      this.CodBanco = this.listaRetenciones.COD_BANCO;
      this.onChangeLlenaSucursal();
      this.cambioDir();
      this.activeTab = 'retencionJud';
      //this.activeTab = 'historiaRet';

    }).catch(() => {
      Swal.fire('Error', 'La información no ha cargado correctamente.', 'error');
    });
  }

  cancelarModal(){
    this.listaRetenciones.COD_DIRECCION = this.codUbigeo;
    this.Distrito = this.codUbigeo.toString();
  }
  guardarModal(){
    this.cambioDir();
    ($('#modalInfoDireccion') as any).modal('hide');
  }
  onChangeLlenaSucursal() {
    if (this.CodViaPago === '04') {
      this.polizaAntPenService.getCombos('SELECT_SUCURSAL', 'A').then( (resp: any) => {
        this.cmbSucursal = resp;
      });
    } else {
      this.CodSucursal = '0000';
      this.polizaAntPenService.getCombos('SELECT_SUCURSAL', 'S').then( (resp: any) => {
        this.cmbSucursal = resp;
      });
    }

    this.validacionCmbViaPago('');
  }

  async validacionCmbViaPago(bandera: string) {
    if (this.CodViaPago == "00") {
      this.polizaAntPenService.getCombos("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledViaPago = false;
        this.isDisabledSucursal = true;
        this.isDisabledTipoCuenta = true;
        this.isDisabledBanco = true;
        this.isDisabledNumCuenta = true;
        this.isDisabledNumCuentaCci = true;
        this.CodSucursal = "000";
        this.CodTipoCuenta = "00";
        this.CodBanco = "00";
        this.listaRetenciones.NUM_CUENTA = "";
        this.listaRetenciones.NUM_CUENTACCI = "";
      });
    } else if (this.CodViaPago == "02") {
      this.polizaAntPenService.getCombos("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledViaPago = false;
        this.isDisabledSucursal = true;
        this.isDisabledTipoCuenta = false;
        this.isDisabledBanco = false;
        this.isDisabledNumCuenta = false;
        this.isDisabledNumCuentaCci = false;
        this.CodSucursal = "000";
        this.CodTipoCuenta = bandera === 'elegir' ? '00' : this.CodTipoCuenta;
        this.cambiarBanco(bandera);
        this.CodBanco = bandera === 'elegir' ? '00' : this.CodBanco;
        this.listaRetenciones.NUM_CUENTA = bandera === 'elegir' ? '' : this.listaRetenciones.NUM_CUENTA;
        this.listaRetenciones.NUM_CUENTACCI = bandera === 'elegir' ? '' : this.listaRetenciones.NUM_CUENTACCI;
      });
    } else if (this.CodViaPago == "04") {
      this.polizaAntPenService.getCombos("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledViaPago = false;
        this.isDisabledSucursal = false;
        this.isDisabledTipoCuenta = true;
        this.isDisabledBanco = true;
        this.isDisabledNumCuenta = true;
        this.isDisabledNumCuentaCci = true;
        this.CodSucursal = bandera === 'elegir' ? '000' : this.CodSucursal;
        this.CodTipoCuenta = "00";
        this.CodBanco = "00";
        this.listaRetenciones.NUM_CUENTA = "";
        this.listaRetenciones.NUM_CUENTACCI = "";
      });
    } else if (this.CodViaPago == "05") {
      this.isDisabledViaPago = false;
      this.isDisabledSucursal = true;
      this.isDisabledTipoCuenta = true;
      this.isDisabledBanco = false;
      this.isDisabledNumCuenta = true;
      this.isDisabledNumCuentaCci = true;
      this.CodSucursal = "000";
      this.CodTipoCuenta = "00";
      this.CodBanco = bandera === 'elegir' ? '00' : this.CodBanco;
      this.listaRetenciones.NUM_CUENTA = "";
      this.listaRetenciones.NUM_CUENTACCI = "";
    }
  }

  numberDecimal(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode === 47 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  soloLetras(e): boolean {
    const key = e.keyCode || e.which;
    const tecla = String.fromCharCode(key).toLowerCase();
    const letras = 'áéíóúabcdefghijklmnñopqrstuvwxyz';
    const especiales = [8, 37, 39, 32];

    let teclaEspecial = false;
    for (const i in especiales) {
        if (key === especiales[i]) {
          teclaEspecial = true;
          break;
        }
    }

    if ( (letras.indexOf(tecla) === -1) && (!teclaEspecial) ) {
      return false;
    }
  }

  onChangeLlenaProvincia() {
    this.polizaAntPenService.getComboProvincia(this.listaRetenciones.Cod_Region).then( (resp: any) => {
      this.cmbProvincia = resp;
      this.listaRetenciones.COD_DIRECCION = 0;
    });
    this.cmbDistrito = [];
  }

  onChangeLlenaDistrito() {
    this.mantenedorPrepolizasService.getComboDistrito(this.listaRetenciones.Cod_Provincia).then( (resp: any) => {
      this.cmbDistrito = resp;
      this.distritos = resp;
      this.listaRetenciones.COD_DIRECCION = this.cmbDistrito[0].CodDireccion;
      // this.ubigeoExp();
    });
  }


  selectDistrito() {
            //this.listaRetenciones.COD_DIRECCION = Number(this.Distrito);
            //this.cambioDir();
  }

  ValidaPagoPension(fecha){
    var iFecha = moment(fecha).format("YYYYMM");
    this.infoRetencion.FecTerminoRetencion = iFecha;

    this.retencionService.getValidacionFecha(this.infoRetencion).then( (resp: any) => {
      this.respuesta = resp;
    });
    this.retencionService.getValidacionFecha(this.infoRetencion).then( (resp: any) => {
      this.respuesta = resp;
    });

    if (this.respuesta.Mensaje === 'FALSE')
    {
      this.mensajeError = 'Ya se ha Realizado el Proceso de Cálculo de Pensión para la Fecha Ingresada.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
  }
  cancelar(){
    this.router.navigate(['/retencionesJudiciales']);
  }
  async fechaEfecto() {
    await this.retencionService.getValidacionFecha(this.infoRetencion)
    .then((resp: any) => {
      this.respuesta = resp;
      if (this.respuesta.Mensaje === 'TRUE')
    {
      this.listaRetenciones.FEC_EFECTO = moment(this.listaRetenciones.FEC_INIRET).format("YYYY-MM-01");
    }
    else
    {
      let mes = this.respuesta.Mensaje.substr(-2);
      let FechaEfecto =  moment(this.listaRetenciones.FEC_INIRET).format("YYYY-"+mes+"-01");
      this.listaRetenciones.FEC_EFECTO = FechaEfecto;
    }
    });
  }
  cambioRecepcion(){
    
  }
  focusOutFunction(){
    if (this.listaRetenciones.FEC_INIRET === '')
    {
      this.mensajeError = 'Fecha de Inicio Vigencia Inválida.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    else
    {
      var iFecha = moment(this.listaRetenciones.FEC_INIRET).format("YYYYMM");
      this.infoRetencion.fechaPeriodoInicio = iFecha;
      this.fechaEfecto();
    }

  }
  callType(value){
    console.log(value);
    this.listaRetenciones.COD_TIPRET=value;
  }
  validar_email( email ) {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }
  GuardarInfo() {
    //this.ValidaPagoPension(this.fecTerret);
    if (this.listaRetenciones.FEC_INIRET == '' ) {
      this.mensajeError = 'Debe ingresar una fecha de inicio vigencia.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    if (this.listaRetenciones.FEC_TERRET == '' ) {
      this.mensajeError = 'Debe ingresar una fecha de termino vigencia.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    if (this.listaRetenciones.FEC_TERRET < this.listaRetenciones.FEC_INIRET) {
      this.mensajeError = 'La fecha de inicio vigencia no puede ser mayor a la fecha de termino vigencia.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    if (this.listaRetenciones.FEC_RESDOC == '' ) {
      this.mensajeError = 'Debe ingresar una Fecha de Recepción.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    this.infoRetencion.MontoRet = Number(this.MTO_RET);
    if (this.infoRetencion.MontoRet == 0 && (this.vlCodModRet == 'MIXIM' || this.vlCodModRet == 'PRCIM')) {
      this.mensajeError = 'Debe ingresar el Porcentaje de la Retención.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    this.infoRetencion.MontoRetmax = Number(this.MTO_RETMAX);
    if (this.infoRetencion.MontoRetmax == 0 && (this.vlCodModRet == 'MIXIM' || this.vlCodModRet == 'MTOIM')) {
      this.mensajeError = 'Debe ingresar el Monto de la Retención.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    let d0FechaInicioVigencia =  moment(this.listaRetenciones.FEC_INIRET);
    let d0fechaMinima =  moment(this.fechaMinima);
    this.vigenciaPoliza = this.consulta.Vigencia.substr(0,4) + '-' + this.consulta.Vigencia.substr(4,2) +  '-' + this.consulta.Vigencia.substr(-2);
    let d0VigenciaPoliza = moment(this.vigenciaPoliza);
    let d0FecgaRecepcion = moment(this.listaRetenciones.FEC_RESDOC);
    let d0Hoy = moment(this.hoy);
    let d0FechaFinVigencia = moment(this.listaRetenciones.FEC_TERRET);

    //this.antecedentesRep.fecEfecto = moment(this.antecedentesRep.fecIniret).format("YYYY-MM-01");

    if (d0FechaInicioVigencia.year < d0fechaMinima.year ) {
      this.mensajeError = 'La Fecha Ingresada es Inferior a la Fecha Mínima de Ingreso (1900).';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if (d0FechaInicioVigencia < d0VigenciaPoliza ) {
      this.mensajeError = 'La Fecha Ingresada es Anterior a la Fecha de Vigencia de la Póliza.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if (d0FecgaRecepcion > d0Hoy ) {
      this.mensajeError = 'La Fecha de Recepción es Mayor a la Fecha Actual.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if (d0FecgaRecepcion.year < d0fechaMinima.year ) {
      this.mensajeError = 'La Fecha de Recepción es Inferior a la Fecha Mínima de Ingreso (1900).';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }
    if (d0FechaFinVigencia < d0FechaInicioVigencia ) {
      this.mensajeError = 'La Fecha de Fin Vigencia es Menor a la Fecha de Inicio de Vigencia.';
      this.mostrarAlertaError('ERROR', this.mensajeError);
      return;
    }

    if (this.insertar ===  true)
    {
      this.infoRetencion.Bandera = 'INSERT';
    }
    else
    {
      this.infoRetencion.Bandera = 'UPDATE';
      this.infoRetencion.numRetencion = this.consulta.NumRetencion;
    }
    Swal.fire({
      title: '¿Desea guardar cambios?',
      text: 'Los cambios se guardarán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

      this.infoRetencion.NumPoliza = this.consulta.NumeroPoliza;
      this.infoRetencion.NumEndoso = this.consulta.NoEndoso;
      this.infoRetencion.NumOrden = this.consulta.NumOrden.toString();
      this.infoRetencion.numIdenreceptor = this.listaRetenciones.NUM_IDENRECEPTOR;
      this.infoRetencion.codTipoidenreceptor = this.listaRetenciones.COD_TIPOIDENRECEPTOR;
      this.infoRetencion.codDireccion = this.listaRetenciones.COD_DIRECCION;
      //this.infoRetencion.Ubigeo = this.codUbigeo.toString();
      //this.infoRetencion.codMonedaretmax = this.antecedentesRep.codMonedaretmax;

        // Antecedentes recepcion
      this.infoRetencion.fechaPeriodoInicio = this.listaRetenciones.FEC_INIRET;
      this.infoRetencion.fechaPeriodoFin = this.listaRetenciones.FEC_TERRET;
      this.infoRetencion.tipRetencion = this.vlCodTipRet;
      this.infoRetencion.tipModalidad = this.vlCodModRet;
      this.infoRetencion.tipDctoMto = this.vlCodModRet; 
      this.infoRetencion.MontoRet = Number(this.MTO_RET);
      this.infoRetencion.FechaEfecto = this.listaRetenciones.FEC_EFECTO;
      this.infoRetencion.FechaRecepcion = this.listaRetenciones.FEC_RESDOC;
      this.infoRetencion.MontoRetmax = Number(this.MTO_RETMAX);
      this.infoRetencion.Nomjuzgado = this.listaRetenciones.GLS_NOMJUZGADO;
      this.infoRetencion.FecTerminoRetencion = this.fecCarta;
      this.infoRetencion.Calculo = this.vlCodDctoMto;
      this.infoRetencion.Porcentaje = Number(this.MTO_RET);


      // Antecedentes Pensionado
      //this.infoRetencion.codTipoidenben = this.TipoDoc;
      //this.infoRetencion.NUM_IDENBEN = this.antecedentesPer.NUM_IDENBEN;

      this.infoRetencion.ApellidoPat = this.listaRetenciones.GLS_PATRECEPTOR;
      this.infoRetencion.ApellidoMat = this.listaRetenciones.GLS_MATRECEPTOR;
      this.infoRetencion.Nombre1 = this.listaRetenciones.GLS_NOMRECEPTOR;
      this.infoRetencion.Nombre2 = this.listaRetenciones.GLS_NOMSEGRECEPTOR;
      this.infoRetencion.Telefono1 = this.listaRetenciones.GLS_FONORECEPTOR;
      this.infoRetencion.GLS_FONO2 = this.listaRetenciones.GLS_FONORECEPTOR2;
      this.infoRetencion.Correo1 = this.listaRetenciones.GLS_EMAILRECEPTOR;
      this.infoRetencion.Direccion = this.listaRetenciones.GLS_DIRRECEPTOR;

      //'Validar Ingreso de Datos para Pago, según Via de Pago Seleccionada
      if (this.CodViaPago == "00") {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar Forma de Pago.', icon: 'warning', allowOutsideClick: false });
        return;
      }
      if ((this.CodViaPago == "01" || this.CodViaPago == "04") && (this.CodSucursal == "000")) {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar la Sucursal de la Vía de Pago.', icon: 'warning', allowOutsideClick: false });
        return;
      }
      if ((this.CodViaPago === "02" || this.CodViaPago === "03" || this.CodViaPago === "05") && (this.CodBanco === "00")) {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Banco.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      if (this.CodViaPago == "02") {
        if (this.CodTipoCuenta == "00") {
          Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Tipo de Cuenta.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if (!this.validaNumCuenta(this.listaRetenciones.NUM_CUENTA) || this.listaRetenciones.NUM_CUENTA.length !== Number(this.maxLengthNumCuenta)) {
          Swal.fire('Advertencia', 'Número de cuenta inválido.', 'warning');
          return;
        }       

        if(this.CodBanco == '40')
        {
          if (this.listaRetenciones.NUM_CUENTACCI == "") {
            Swal.fire({ title: 'Advertencia', text: 'Debe ingresar los Números de Cuenta CCI.', icon: 'warning', allowOutsideClick: false });
            return;
          }
        }
        else
        {
          if (this.listaRetenciones.NUM_CUENTA == "") {
            Swal.fire({ title: 'Advertencia', text: 'Debe ingresar los Números de Cuenta.', icon: 'warning', allowOutsideClick: false });
            return;
          }
        }
      }

      // Forma de Pago de Pensión
      this.infoRetencion.CodViaPago = this.CodViaPago;
      this.infoRetencion.CodSucursal = this.CodSucursal;
      this.infoRetencion.CodTipCuenta = this.CodTipoCuenta;
      this.infoRetencion.CodBanco = this.CodBanco;
      this.infoRetencion.NumCuenta = this.listaRetenciones.NUM_CUENTA;
      this.infoRetencion.NumCuentaCCI = this.listaRetenciones.NUM_CUENTACCI;
      // console.log(this.infoRetencion);
      this.infoRetencion.Usuario = localStorage.getItem('currentUser');
      this.retencionService.guardarOrdenJudicial(this.infoRetencion).then((resp: any) => {
          if (resp.Mensaje === 'EXITO') {
            this.buscarAntecedentesRetencion();
            Swal.fire(
              'Guardado',
              'La Orden Judicial se ha guardado.',
              'success'
            );
            this.limpiar();
            this.router.navigate(['/retencionesJudiciales']);
          }
          else if (resp.Mensaje === 'ERRORCAL') {
            Swal.fire(
              'Error',
              'No se puede guadar la retencion ya que el monto sumado con otras retenciones es mayor al 60% de la pension',
              'error'
            );
          }
          else if (resp.Mensaje === 'FALSE')
          {
            Swal.fire(
              'Error',
              'Ya se ha Realizado el Proceso de Cálculo de Pensión para la Fecha Ingresada.',
              'error'
            );
          }
          else if (resp.Mensaje === 'ERROR') {
            Swal.fire(
              'Error',
              'Error al intentar guardar la Orden Judicial.',
              'error'
            );
          }
          else {
            Swal.fire(
              'Error',
              'Error al intentar guardar la Orden Judicial. ' + resp.Mensaje,
              'error'
            );
          }
      })
    }
    });
  }
  cerrarModalTel(){

    this.validarTelefonos();
    (<any>$('#modalTelefonos')).modal('hide');
  }


  validarTelefonos(){
    if(this.beneficiariosInfo.GlsFono2 == '' || this.beneficiariosInfo.GlsFono2 == null){}
    else{
      if (this.beneficiariosInfo.GlsFono2.length < 7) {
        this.beneficiariosInfo.GlsFono2 = "";

      }
      if (this.beneficiariosInfo.GlsFono2.length > 9) {
        this.beneficiariosInfo.GlsFono2 = "";

      }
    }

    if (this.antecedentesPer.Telefono1 == '' || this.antecedentesPer.Telefono1 == null) {}
    else{
      if (this.antecedentesPer.Telefono1.length < 7) {
        this.antecedentesPer.Telefono1 = "";

      }
      if (this.antecedentesPer.Telefono1.length > 9) {
        this.antecedentesPer.Telefono1 = "";

      }
    }

  }
  aceptarModalEmail(){
    var valido = true;

    if (this.listaRetenciones.GLS_EMAILRECEPTOR !== '') {
      const valEmail = this.validar_email(this.listaRetenciones.GLS_EMAILRECEPTOR);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico no tiene formato válido.', 'error');
        valido = false;
      }
    }
    if(valido == true){
      (<any>$('#modalEmail')).modal('hide');
    }
  }
  aceptarModalTel(){
    var valido = true;

    if (this.listaRetenciones.GLS_FONORECEPTOR2 !== '') {
      if (this.listaRetenciones.GLS_FONORECEPTOR2.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.listaRetenciones.GLS_FONORECEPTOR2.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.listaRetenciones.GLS_FONORECEPTOR !== '') {
      if (this.listaRetenciones.GLS_FONORECEPTOR.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 1 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.listaRetenciones.GLS_FONORECEPTOR.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 1 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }
    if(valido == true){
      (<any>$('#modalTelefonos')).modal('hide');
    }
  }
  limpiar ()
  {
    this.listaRetenciones.FEC_TERRET = '';
    this.tipDctoMto = this.comboDctoMto[0].CodElemento;
    this.vlCodModRet = '01'
    this.tipRetencion = this.comboTipRet[0].CodElemento; 
    this.fecCarta ='9999-12-31';

    this.listaRetenciones.NUM_IDENRECEPTOR = '';
    this.listaRetenciones.COD_TIPOIDENRECEPTOR  = 0;
    this.listaRetenciones.COD_DIRECCION = 0;

      // Antecedentes recepcion
    this.listaRetenciones.FEC_INIRET = '';
    this.listaRetenciones.COD_TIPRET = '';
    this.listaRetenciones.COD_MODRET = '';
    this.listaRetenciones.MTO_RET = 0;
    this.listaRetenciones.FEC_EFECTO = '';
    this.listaRetenciones.FEC_RESDOC = '';
    this.listaRetenciones.MTO_RETMAX = 0;
    this.listaRetenciones.GLS_NOMJUZGADO = '';

    this.MTO_RET = 0.00;
    this.MTO_RETMAX = 0.00;

    // Antecedentes Pensionado
    this.listaRetenciones.GLS_PATRECEPTOR = '';
    this.listaRetenciones.GLS_MATRECEPTOR = '';
    this.listaRetenciones.GLS_NOMRECEPTOR = '';
    this.listaRetenciones.GLS_NOMSEGRECEPTOR = '';
    this.listaRetenciones.GLS_FONORECEPTOR = '';
    this.listaRetenciones.GLS_FONORECEPTOR2 = '';
    this.listaRetenciones.GLS_EMAILRECEPTOR = '';
    this.listaRetenciones.GLS_DIRRECEPTOR = '';
    this.direccionStr = '';

    // Forma de Pago de Pensión
    this.CodViaPago = '';
    this.CodSucursal = '';
    this.CodTipoCuenta = '';
    this.CodBanco = '';
    this.NumCuenta = '';
    this.CodInter = '';

    this.listaRetenciones.NUM_CUENTA = '';
    this.listaRetenciones.NUM_CUENTACCI = '';

    this.isDisabledMtoFij = false;
    this.isDisabledPrcje = true;
    this.isDisabledSucursal = true;
    this.isDisabledTipoCuenta = true;
    this.isDisabledBanco = true;
    this.isDisabledNumCuenta = true;
    this.isDisabledNumCuentaCci = true;
  }

  getInfo(codDir) {
    this.listaRetenciones.COD_DIRECCION = codDir;

    this.mantenedorPrepolizasService.getComboProvinciaAll(codDir).then( (resp: any) => {
       const listaLlenado = [];
       for(const i in resp) {
         if(resp.length > 0) {
          const object = {
            codigo: resp[i].CodProvincia,
            descripcion: resp[i].GlsProvincia
          };
          listaLlenado.push(object);
         }
       }
       this.cmbProvincia = listaLlenado;
    });

    this.mantenedorPrepolizasService.getProvinciaUnica(codDir).then( (resp: any) => {
      this.listaRetenciones.Cod_Provincia = resp[0].CodProvincia;
      this.listaRetenciones.Cod_Region = resp[0].CodRegion.toString();
      // this.ubigeoExp();
    });
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  // Función para validar los formatos de Números de Cuenta según el Tipo de Cuenta seleccionado al momento de Guardar.
  validaNumCuenta(pNumCuenta) {
    return this.regexNumCuenta.test(pNumCuenta) ? true : false;
  }

  // Función para Bancos(llena el combo de Tipos de Cuenta según el Banco seleccionado y limpia campos si la bandera es 'elegir').
  cambiarBanco(bandera: string) {
    this.CodTipoCuenta = bandera === 'elegir' ? '00' : this.CodTipoCuenta;
    this.listaRetenciones.NUM_CUENTA = bandera === 'elegir' ? '' : this.listaRetenciones.NUM_CUENTA;
    this.listaRetenciones.NUM_CUENTACCI = bandera === 'elegir' ? '' : this.listaRetenciones.NUM_CUENTACCI;

    this.http.get<any[]>(this.urlPrePolizas + '/CmbTipoCuenta?pCodBanco=' + this.CodBanco).subscribe(result => {
      this.cmbTipoCuenta = result;
      this.cambiarTipoCuenta(bandera)
    }, error => console.error(error));

  }

  // Función para Tipos de Cuenta(genera y valida los formatos de cada Tipo de Cuenta y limpia campos si la bandera es 'elegir').
  cambiarTipoCuenta(bandera: string) {
    let contX = 0;
    this.listaRetenciones.NUM_CUENTA = bandera === 'elegir' ? '' : this.listaRetenciones.NUM_CUENTA;
    this.listaRetenciones.NUM_CUENTACCI = bandera === 'elegir' ? '' : this.listaRetenciones.NUM_CUENTACCI;

    if (this.CodTipoCuenta !== '' && this.CodTipoCuenta !== '00') {

      this.maxLengthNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.CodTipoCuenta).NUM_DIGITOS;
      this.arrayNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.CodTipoCuenta).NUM_CUENTA.split('X');

      for (let i = 0; i <= this.arrayNumCuenta.length - 1; i++) {
        if (this.arrayNumCuenta[i] === '') {
          contX++;
        }
      }

      if ((contX - 1) === Number(this.maxLengthNumCuenta)) {
        this.regexNumCuenta = new RegExp(`\\d{${contX - 1}}`);
      }

      if (this.arrayNumCuenta[0] !== '' && this.arrayNumCuenta[this.arrayNumCuenta.length - 1] === '') {
        this.regexNumCuenta = new RegExp(`^(${this.arrayNumCuenta[0]})+(\\d{${contX}})$`);
      }

      if (this.arrayNumCuenta[0] !== '' && this.arrayNumCuenta[this.arrayNumCuenta.length - 1] !== '') {
        this.regexNumCuenta = new RegExp(`^(${this.arrayNumCuenta[0]})+(\\d{${contX + 1}})+(${this.arrayNumCuenta[this.arrayNumCuenta.length - 1]})$`);
      }

      if (this.arrayNumCuenta[0] === '' && this.arrayNumCuenta[this.arrayNumCuenta.length - 1] !== '') {
        this.regexNumCuenta = new RegExp(`^(\\d{${contX + 1}})+(${this.arrayNumCuenta[this.arrayNumCuenta.length - 1]})$`);
      }
    }
  }

  comboModalidad(codModalidad){

    if(codModalidad == '03')
    {
      this.isDisabledMtoFij = false;
      this.isDisabledPrcje = false;

    }

    if(codModalidad == '02')
    {
      this.isDisabledMtoFij = true;
      this.isDisabledPrcje = false;
      this.MTO_RETMAX  = 0.00;

    }

    if(codModalidad == '01')
    {
      this.isDisabledMtoFij = false;
      this.isDisabledPrcje = true;
      this.MTO_RET = 0.00;
    }    
  }

}
