import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MantenedorPrepolizasService } from 'src/providers/mantenedorPrePolizas.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {MantenedorPrePolizas, PrePolizasBen} from 'src/interfaces/mantenedorprepolizas.model';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../../AppConst';
import { ActivatedRoute } from '@angular/router';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import { MatTableDataSource } from '@angular/material/table';
import { Globales } from 'src/interfaces/globales';
import { MatPaginator } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import * as $AB from 'jquery';
import { saveAs } from 'file-saver';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-mantenedor-prepolizas',
  templateUrl: './mantenedor-prepolizas.component.html',
  styleUrls: ['./mantenedor-prepolizas.component.css']
})
export class MantenedorPrepolizasComponent implements OnInit, AfterViewInit, AfterViewChecked {

  botonGeneraPDF = false;
  regexNumCuenta: RegExp; // Para el Afiliado
  arrayNumCuenta = []; // Para el Afiliado
  regexNumCuentaTut: RegExp; // Para el Tutor
  arrayNumCuentaTut = []; // Para el Tutor
  formSearch: FormGroup;
  primDefNs = 0;
  fecTras = '2020-02-02';
  sep2 = ' ';
  sep = ' - ';
  pNumPoliza = 0;
  mensajeError = '';
  maxLengthNumDoc = '15';
  maxLengthNumDocBen = '15';
  maxLengthNumCuenta = '20';
  maxLengthNumCuentaTut = '20';
  valorBtnCancelar = false;
  validaBeneficiarios = false;
  primerslap = false;
  segundoslap = false;
  banderaNumerica = false;
  columnasBen = [];
  regOriginal;

  TipoIden = 0;
  TipoVejez = '';
  EstCivil = '';
  InsSalud = '';
  ViaPago = '';
  Sucursal = '';
  TipoCuenta = '';
  Banco = '';
  Distrito = 0;
  Departamento = '';
  DepartamentoBen = '';
  Provincia = '';
  Distrito2 = 0;
  Departamento2 = '';
  Provincia2 = '';
  ProvinciaBen = '';
  Distrito2Ben = 0;
  DistritoBen = 0;
  Departamento2Ben = '';
  Provincia2Ben = '';
  codSexoSelect = '';
  codCausInvSelect = '';
  TipoPension = '';
  AFP = '';
  Nacionalidad = '';

  isDisabled1 = false;
  isDisabled2 = false;
  tipPen = true;
  sitInvalidez = false;
  public cmbTipoIdent: any;
  public cmbVejez: any[];
  public cmbCivil: any[];
  public cmbInsSalud: any[];
  public cmbViaPago: any[];
  public cmbSucursal: any[];
  public cmbTipoCuenta: any[];
  public cmbBanco: any[];
  public cmbNCuenta: any[];
  public cmbDistrito: any[];
  public cmbDistritoBen: any[];
  public cmbDepartamento: any[];
  public cmbDepartamentoBen: any[];
  public cmbProvincia: any[];
  public cmbDistrito2: any[];
  public cmbDepartamento2: any[];
  public cmbProvincia2: any[];
  public cmbProvinciaBen: any[];
  public cmbDistrito2Ben: any[];
  public cmbDepartamento2Ben: any[];
  public cmbProvincia2Ben: any[];
  public cmbPension: any[];
  public cmbAfp: any[];
  public CmbNacionalidad: any[];

  // Combos de pestaña de Beneficiarios.
  public cmbTipoIdenBen: any[];
  public cmbDerPen: any[];
  public cmbCausInv: any[];
  public cmbSexo: any[];
  public cmbParentesco: any[];
  public cmbGruFam: any[];
  public cmbDistritoAll: any[];
  public cmbDistritoAll2: any[];
  public cmbDistritoAllBen: any[];
  public cmbDistritoAll2Ben: any[];
  public lista: any[];
  public lista2: any[];
  public listaBen: any[];
  public lista2Ben: any[];
  public listaTutor: any[];
  public cmbDistritoAllTutor: any[];

  // Combos y variables para modal de tutor.
  displayModalTutor = 'block';
  public cmbTipoIdenTutor: any[];
  public cmbTipoCuentaTutor: any[];
  public cmbBancoTutor: any[];
  public cmbViaPagoTutor: any[];
  public cmbSucursalTutor: any[];
  public cmbDistritoTutor: any[];
  public cmbDepartamentoTutor: any[];
  public cmbProvinciaTutor: any[];
  public el: ElementRef;
  codIdenTutorSelect = 0;
  maxLengthNumDocTutor = '15';
  DistritoTutor = 0;
  DepartamentoTutor = '';
  ProvinciaTutor = '';

  isDisabledViaPagoTutor = false;
  isDisabledSucursalTutor = true;
  isDisabledTipoCuentaTutor = true;
  isDisabledBancoTutor = true;
  isDisabledNumCuentaTutor = true;
  isDisabledNumCuentaCciTutor = true;
  isDisabledEst = true;
  isDisabledFecInv = true;
  isDisabledDiv = false;
  isDisabledDivActive = true;
  isActiveDiv = true;
  isDisabledCauInv = true;
  isDisabledFecFall = true;
  // Combos y variables para modal de tutor.

  direccionStr: any;
  dirCorrStr: any;
  direccionStrs: any = {
    DireccionStr: '',
    DirCorrStr: ''
  };

  direccionStrBen: any;
  dirCorrStrBen: any;
  direccionStrsBen: any = {
    DireccionStrBen: '',
    DirCorrStrBen: ''
  };
  codIdenBenSelect = 0;
  codDerPenBenSelect = '';
  codCausInvBenSelect = '';
  codSexoBenSelect = '';
  codParBenSelect = '';
  codGruFamBenSelect = '';
  codSitInvBenSelect = '';
  tipoBusqueda = 'P';
  pantalla = '0';
  opcionDir = 'Exp';
  opcionTelefonos = 'Afiliado';
  opcionCorreos = 'Afiliado';
  fec_valida = "";
  private url = AppConsts.baseUrl + 'mantenedorprepolizas';
  // private url = localStorage.getItem('url') + 'mantenedorprepolizas';

  dataConsulta: MantenedorPrePolizas = {
    NumPoliza: '',
    NumCot: '',
    FecVigencia: '',
    CodTipoidenafi: 0,
    NumIdenafi: '',
    NumCargas: 0,
    NumOperacion: 0,
    NumCorrelativo: 0,
    CodTippension: '',
    CodEstcivil: '',
    CodAfp: '',
    CodIsapre: '',
    GlsDireccion: '',
    CodDireccion: 0,
    GlsFono: '',
    GlsCorreo: '',
    CodViapago: '',
    CodSucursal: '',
    CodTipcuenta: '',
    CodBanco: '',
    NumCuenta: '',
    GlsNacionalidad: '',
    CodVejez: '',
    FecEmision: '',
    CodTipvia: '',
    GlsNomvia: '',
    GlsNumdmc: '',
    GlsIntdmc: '',
    CodTipzon: '',
    GlsNomzon: '',
    GlsReferencia: '',
    GlsFono2: '',
    GlsFono3: '',
    GlsCorreo2: '',
    GlsCorreo3: '',
    NumCuentacci: '',
    FecIngresosppText: '',
    GlsNomben: '',
    GlsNomsegben: '',
    GlsPatben: '',
    GlsMatben: '',
    CodSexo: '',
    FecNacben: '',
    FecFallben: '',
    FecInvben: '',
    CodCauinv: '',
    GlsDireccionCorresp: '',
    CodUbigeoCorresp: 0,
    Departamento: '',
    CUSPP: '',
    NombreCompleto: '',
    Mensaje: '',
    DireccionStr: '',
    DirCorrStr: '',
    Usuario:'',
    FecAceptacion: '',
    Proteccion: '',
    Boleta: ''
  };

  // Agregado para consultas de beneficiarios.
  dataPolBen: PrePolizasBen[] = []; // Esta se enviaría al update de Beneficiarios.
  dataPolBenRespaldo: any[] = []; // Arreglo de respaldo para cuando cancelen cambios al editar beneficiario con botón limpiar.
  polBenSelect: PrePolizasBen = {
    NumPoliza: '',
    NumOrden: 0,
    CodGrufam: '',
    CodPar: '',
    CodSexo: '',
    CodStinv: '',
    CodCauinv: '',
    CodDerpen: '',
    CodDercre: '',
    CodTipoidenben: 0,
    NumIdenben: '',
    GlsNomben: '',
    GlsNomsegben: '',
    GlsPatben: '',
    GlsMatben: '',
    FecNacben: '',
    FecInvben: '',
    FecFallben: '',
    FecNacHM: '',
    PrcPension: 0,
    PrcPensionleg: 0,
    MtoPension: 0,
    MtoPensiongar: 0,
    CodEstpension: '',
    PrcPensiongar: 0,
    GlsFono: '',
    GlsFono2: '',
    GlsFono3: '',
    GlsCorreo: '',
    GlsCorreo2: '',
    GlsCorreo3: '',
    IndEstudiante: '',
    NumCot: '',
    NumOperacion: 0,
    PrcPensionRep: 0,
    TipoidenbenStr: '',
    ParentescoStr: '',
    Mensaje: '',
    Usuario:'',
    GlsDireccionBen:'',
    GlsDireccionCorrespBen:'',
    DireccionStrBen: '',
    DirCorrStrBen: '',
    CodUbigeoCorresp: 0,
    CodDireccion: 0,
    // Datos de los tutores
    MostrarTutor: 'FALSE',
    NombreCompletoTut: '',
    PrimerNombreTut: '',
    SegundoNombreTut: '',
    ApellidoPaternoTut: '',
    ApellidoMaternoTut: '',
    TipoDocumentoTut: 0,
    NumeroDocumentoTut: '',
    GlsDireccionTut: '',
    CodDireccionTut: 0,
    GlsFono1Tut: '',
    GlsFono2Tut: '',
    GlsFono3Tut: '',
    GlsCorreo1Tut: '',
    GlsCorreo2Tut: '',
    CodViaPagoTut: '00',
    CodSucursalTut: '000',
    CodBancoTut: '00',
    CodTipoCuentaTut: '00',
    NumCuentaTut: '',
    NumCuentaCCITut: '',
    NumMesesPoder: 0,
    FecVigenciaDesde: '',
    FecVigenciaHasta: '',
    FecEfecto: '',
    FecRecepcion: '',
    FechaTutorBen: moment().format('YYYY-MM-DD'),
    ProteccionBen: '',
    BoletaBen: ''
  };
  polBenSelectRe: PrePolizasBen = {
    NumPoliza: '',
    NumOrden: 0,
    CodGrufam: '',
    CodPar: '',
    CodSexo: '',
    CodStinv: '',
    CodCauinv: '',
    CodDerpen: '',
    CodDercre: '',
    CodTipoidenben: 0,
    NumIdenben: '',
    GlsNomben: '',
    GlsNomsegben: '',
    GlsPatben: '',
    GlsMatben: '',
    FecNacben: '',
    FecInvben: '',
    FecFallben: '',
    FecNacHM: '',
    PrcPension: 0,
    PrcPensionleg: 0,
    MtoPension: 0,
    MtoPensiongar: 0,
    CodEstpension: '',
    PrcPensiongar: 0,
    GlsFono: '',
    GlsFono2: '',
    GlsFono3: '',
    GlsCorreo: '',
    GlsCorreo2: '',
    GlsCorreo3: '',
    IndEstudiante: '',
    NumCot: '',
    NumOperacion: 0,
    PrcPensionRep: 0,
    TipoidenbenStr: '',
    ParentescoStr: '',
    Mensaje: '',
    Usuario:'',
    GlsDireccionBen:'',
    GlsDireccionCorrespBen:'',
    DireccionStrBen: '',
    DirCorrStrBen: '',
    CodUbigeoCorresp: 0,
    CodDireccion: 0,
    // Datos de los tutores
    MostrarTutor: 'FALSE',
    NombreCompletoTut: '',
    PrimerNombreTut: '',
    SegundoNombreTut: '',
    ApellidoPaternoTut: '',
    ApellidoMaternoTut: '',
    TipoDocumentoTut: 0,
    NumeroDocumentoTut: '',
    GlsDireccionTut: '',
    CodDireccionTut: 0,
    GlsFono1Tut: '',
    GlsFono2Tut: '',
    GlsFono3Tut: '',
    GlsCorreo1Tut: '',
    GlsCorreo2Tut: '',
    CodViaPagoTut: '00',
    CodSucursalTut: '000',
    CodBancoTut: '00',
    CodTipoCuentaTut: '00',
    NumCuentaTut: '',
    NumCuentaCCITut: '',
    NumMesesPoder: 0,
    FecVigenciaDesde: '',
    FecVigenciaHasta: '',
    FecEfecto: '',
    FecRecepcion: '',
    FechaTutorBen: moment().format('YYYY-MM-DD'),
    ProteccionBen: '',
    BoletaBen: ''
  };
  beneficiariosPoliza = [];

  polBenSelectRespaldo = new PrePolizasBen();
  comboDistritoResp = [];
  comboDistrito2Resp = [];
  comboTutorResp = [];
  comboDistritoRespBen = [];
  comboDistrito2RespBen = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private prePolizasService: MantenedorPrepolizasService,
              private http: HttpClient,
              public titleService: Title,
              private activatedRoute: ActivatedRoute,
              private _serviceFecha: ServiciofechaService, 
              private serviceLog: LoginService, private cdRef: ChangeDetectorRef,
              private renderer: Renderer2) {
    this.columnasBen = ['item', 'codPar', 'tipoIden', 'numIden', 'benNombre', 'acciones'];

    this.http.get<any[]>(this.url + '/Comb?combo=IS').subscribe(result => {
      this.cmbInsSalud = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=VPG').subscribe(result => {
      this.cmbViaPago = result;
      this.cmbViaPagoTutor = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=BCO').subscribe(result => {
      this.cmbBanco = result;
      this.cmbBancoTutor = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=EC').subscribe(result => {
      this.cmbCivil = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=TV').subscribe(result => {
      this.cmbVejez = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=AF').subscribe(result => {
      this.cmbSucursal = result;
      this.cmbSucursalTutor = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=TP').subscribe(result => {
      this.cmbPension = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=AF').subscribe(result => {
      this.cmbAfp = result;
    }, error => console.error(error));

    this.http.get<any>(this.url + '/CmbIde').subscribe(result => {
      this.cmbTipoIdent = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/CmbDepartamento').subscribe(result => {
      this.cmbDepartamento = result;
      this.cmbDepartamento2 = result;
      this.cmbDepartamentoTutor = result;
      this.cmbDepartamentoBen = result;
      this.cmbDepartamento2Ben = result;
    }, error => console.error(error));

    this.valorBtnCancelar = false;
    this.validaBeneficiarios = false;
    this.tipoBusqueda = this.activatedRoute.snapshot.paramMap.get('tipo');
    this.pantalla = this.activatedRoute.snapshot.paramMap.get('pantalla');
    
    if (this.tipoBusqueda === 'C') {
      this.dataConsulta.NumCot = this.activatedRoute.snapshot.paramMap.get('poliza').toString();
      this.btnCotizacion(this.dataConsulta.NumCot);
    } else {
      this.dataConsulta.NumPoliza = this.activatedRoute.snapshot.paramMap.get('poliza').toString();
      this.buscarPoliza(this.dataConsulta.NumPoliza);
    }
  }
  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  
  ngOnInit() {
    Globales.titlePag = 'Mantenedor de Pre-Póliza';
    this.titleService.setTitle(Globales.titlePag);
    // Agregado para combos de beneficiarios
    this.http.get<any[]>(this.url + '/Comb?combo=DE').subscribe(result => {
      this.cmbDerPen = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=SE').subscribe(result => {
      this.cmbSexo = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=PA').subscribe(result => {
      this.cmbParentesco = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/Comb?combo=GF').subscribe(result => {
      this.cmbGruFam = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/CmbCausInv').subscribe(result => {
      this.cmbCausInv = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/CmbIde').subscribe(result => {
      this.cmbTipoIdenBen = result;
      this.cmbTipoIdenTutor = result;
    }, error => console.error(error));

    this.http.get<any[]>(this.url + '/CmbNacionalidad').subscribe(result => {
      this.CmbNacionalidad = result;
    }, error => console.error(error));
  }

  ngAfterViewChecked() {
    if (!localStorage.getItem('currentUser')) {
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    /*this.paginator._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
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
    };*/
    let pestanaAfi = document.getElementById("pestanaAfiliado"); 
    let pestanaBen = document.getElementById("pestanaBeneficiario"); 
    let pestanaAfiLi = document.getElementById("pestanaAfiliadoLi");
    if(this.pantalla === '1')
    {
      pestanaBen.click();
     // pestanaAfi.classList.remove("active");
      pestanaAfiLi.classList.remove("active");
      pestanaAfiLi.classList.add("disableDiv")
      //this.isDisabledDiv = true;
      //this.isActiveDiv = false; 
    }
  }

  cambiarTipoIden() {
    const tipoDoc = Number(this.TipoIden);
    this.dataConsulta.CodTipoidenafi = tipoDoc; // Number(this.TipoIden);
    this.dataConsulta.NumIdenafi = '';

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

  selectDirecciones(valor: string) {
    this.opcionDir = valor;
  }

  async cambioDir() {
    await this.prePolizasService.getDireccion(this.dataConsulta.CodDireccion)
    .then((resp: any) => {
      this.direccionStrs = resp;
      this.direccionStr = this.direccionStrs.DireccionStr;
      // this.dirCorrStr = this.direccionStrs.DirCorrStr;
    });
  }

  async cambioDirCorr() {
    await this.prePolizasService.getDireccion(this.dataConsulta.CodUbigeoCorresp)
    .then((resp: any) => {
      this.direccionStrs = resp;
      this.dirCorrStr = this.direccionStrs.DireccionStr;
    });
  }

  async cambioDirBen() {
    await this.prePolizasService.getDireccion(this.polBenSelect.CodDireccion)
    .then((resp: any) => {
      this.direccionStrsBen = resp;
      this.direccionStrBen = this.direccionStrsBen.DireccionStr;
      // this.dirCorrStr = this.direccionStrs.DirCorrStr;
    });
  }

  async cambioDirCorrBen() {
    await this.prePolizasService.getDireccion(this.polBenSelect.CodUbigeoCorresp)
    .then((resp: any) => {
      this.direccionStrsBen = resp;
      this.dirCorrStrBen = this.direccionStrsBen.DireccionStr;
    });
  }

  // Para el combo de Tipo de Vía de Pago del Afiliado.
  cambiarViaPago() {
    this.dataConsulta.CodViapago = this.ViaPago;
    this.dataConsulta.CodSucursal = this.ViaPago === '04' ? this.dataConsulta.CodAfp : '000';
    this.Sucursal = this.ViaPago === '04' ? this.dataConsulta.CodAfp : '000';
    this.dataConsulta.CodBanco = '00';
    this.Banco = '00';
    this.dataConsulta.CodTipcuenta = '00';
    this.TipoCuenta = '00';
    this.dataConsulta.NumCuentacci = '';
    this.dataConsulta.NumCuenta = '';
  }

  async cambiarBanco(bandera: string) {
    let vlCodBanco = bandera === 'afiliado' ? this.Banco : this.polBenSelect.CodBancoTut;

    if (bandera === 'afiliado') {
      this.dataConsulta.CodBanco = this.Banco
      this.dataConsulta.CodTipcuenta = this.dataConsulta.CodTipcuenta === '' || this.dataConsulta.CodTipcuenta === '00' ? '' : this.dataConsulta.CodTipcuenta;
      this.TipoCuenta = this.TipoCuenta === '' || this.TipoCuenta === '00' ? '' : this.TipoCuenta;
      this.dataConsulta.NumCuenta = this.dataConsulta.NumCuenta === '' ? '' : this.dataConsulta.NumCuenta;
      this.dataConsulta.NumCuentacci = this.dataConsulta.NumCuentacci === '' ? '' : this.dataConsulta.NumCuentacci;
    }

    if (bandera === 'tutores') {
      this.polBenSelect.CodTipoCuentaTut = this.polBenSelect.CodTipoCuentaTut === '' || this.polBenSelect.CodTipoCuentaTut === '00' ? '' : this.polBenSelect.CodTipoCuentaTut;
      this.polBenSelect.NumCuentaTut = this.polBenSelect.NumCuentaTut === '' ? '' : this.polBenSelect.NumCuentaTut;
      this.polBenSelect.NumCuentaCCITut = this.polBenSelect.NumCuentaCCITut === '' ? '' : this.polBenSelect.NumCuentaCCITut;
    }

    await this.http.get<any[]>(this.url + '/CmbTipoCuenta?pCodBanco=' + vlCodBanco).subscribe(result => {
      if (bandera === 'afiliado') {
        this.cmbTipoCuenta = result;
      }
      if (bandera === 'tutores') {
        this.cmbTipoCuentaTutor = result;
      }
    }, error => console.error(error));
  }

  async cambiarTipoCuenta(bandera: string) {
    let contX = 0;

    if (bandera === 'afiliado') {
      this.dataConsulta.NumCuenta = this.dataConsulta.NumCuenta === '' ? '' : this.dataConsulta.NumCuenta;
      this.dataConsulta.NumCuentacci = this.dataConsulta.NumCuentacci === '' ? '' : this.dataConsulta.NumCuentacci;
      this.dataConsulta.CodTipcuenta = this.TipoCuenta

      if (this.TipoCuenta !== '' && this.TipoCuenta !== '00') {
        this.maxLengthNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.TipoCuenta).NUM_DIGITOS;
        this.arrayNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.TipoCuenta).NUM_CUENTA.split('X');

        for (let i = 0; i <= this.arrayNumCuenta.length - 1; i++) {
          if (this.arrayNumCuenta[i] === '') {
            contX++;
          }
        }

        if ((contX - 1) === Number(this.maxLengthNumCuenta)) {
          this.regexNumCuenta = new RegExp(`\\d{${ contX - 1 }}`);
        }

        if (this.arrayNumCuenta[0] !== '' && this.arrayNumCuenta[this.arrayNumCuenta.length - 1] === '') {
          this.regexNumCuenta = new RegExp(`^(${ this.arrayNumCuenta[0] })+(\\d{${ contX }})$`);
        }

        if (this.arrayNumCuenta[0] !== '' && this.arrayNumCuenta[this.arrayNumCuenta.length - 1] !== '') {
          this.regexNumCuenta = new RegExp(`^(${ this.arrayNumCuenta[0] })+(\\d{${ contX + 1 }})+(${ this.arrayNumCuenta[this.arrayNumCuenta.length - 1] })$`);
        }

        if (this.arrayNumCuenta[0] === '' && this.arrayNumCuenta[this.arrayNumCuenta.length - 1] !== '') {
          this.regexNumCuenta = new RegExp(`^(\\d{${ contX + 1 }})+(${ this.arrayNumCuenta[this.arrayNumCuenta.length - 1 ] })$`);
        }
      }
    }

    if (bandera === 'tutores') {
      this.polBenSelect.NumCuentaTut = this.polBenSelect.NumCuentaTut === '' ? '' : this.polBenSelect.NumCuentaTut;
      this.polBenSelect.NumCuentaCCITut = this.polBenSelect.NumCuentaCCITut === '' ? '' : this.polBenSelect.NumCuentaCCITut;

      if (this.polBenSelect.CodTipoCuentaTut !== '' && this.polBenSelect.CodTipoCuentaTut !== '00') {
        this.maxLengthNumCuentaTut = this.cmbTipoCuentaTutor.find(item => item.COD_CUENTA === this.polBenSelect.CodTipoCuentaTut).NUM_DIGITOS;
        this.arrayNumCuentaTut = this.cmbTipoCuentaTutor.find(item => item.COD_CUENTA === this.polBenSelect.CodTipoCuentaTut).NUM_CUENTA.split('X');

        for (let i = 0; i <= this.arrayNumCuentaTut.length - 1; i++) {
          if (this.arrayNumCuentaTut[i] === '') {
            contX++;
          }
        }

        if ((contX - 1) === Number(this.maxLengthNumCuentaTut)) {
          this.regexNumCuentaTut = new RegExp(`\\d{${ contX - 1 }}`);
        }

        if (this.arrayNumCuentaTut[0] !== '' && this.arrayNumCuentaTut[this.arrayNumCuentaTut.length - 1] === '') {
          this.regexNumCuentaTut = new RegExp(`^(${ this.arrayNumCuentaTut[0] })+(\\d{${ contX }})$`);
        }

        if (this.arrayNumCuentaTut[0] !== '' && this.arrayNumCuentaTut[this.arrayNumCuentaTut.length - 1] !== '') {
          this.regexNumCuentaTut = new RegExp(`^(${ this.arrayNumCuentaTut[0] })+(\\d{${ contX + 1 }})+(${ this.arrayNumCuentaTut[this.arrayNumCuentaTut.length - 1] })$`);
        }

        if (this.arrayNumCuentaTut[0] === '' && this.arrayNumCuentaTut[this.arrayNumCuentaTut.length - 1] !== '') {
          this.regexNumCuentaTut = new RegExp(`^(\\d{${ contX + 1 }})+(${ this.arrayNumCuentaTut[this.arrayNumCuentaTut.length - 1 ] })$`);
        }
      }
    }
  }

  async validaFecVigenciaAndEfecto() {
    if (this.polBenSelect.NumMesesPoder > 1200) {
      Swal.fire('Error', 'El número de meses ingresado excede el máximo permitido de 1200.', 'error');
      return;
    } else {
      //this.polBenSelect.FecVigenciaHasta = moment(this.polBenSelect.FecVigenciaDesde).add(this.polBenSelect.NumMesesPoder, 'months').add(-1, 'day').format('YYYY-MM-DD');
      this.fec_valida = this.polBenSelect.FecVigenciaHasta = moment(this.polBenSelect.FecVigenciaDesde).add(this.polBenSelect.NumMesesPoder, 'months').add(-1, 'day').format('YYYY-MM-DD');
      //console.log(this.polBenSelect.FecNacben)
      this.polBenSelect.FecVigenciaHasta = moment(this.polBenSelect.FechaTutorBen).add(216, 'months').add(-1, 'day').format('YYYY-MM-DD');
      //console.log(this.polBenSelect.FechaTutorBen)
      if(this.fec_valida > this.polBenSelect.FecVigenciaHasta)
      {
        //console.log("La fecha calculada es mayor a la fecha de mayoria de edad")
        this.polBenSelect.FecVigenciaHasta = this.polBenSelect.FecVigenciaHasta;
      }
      else{
        //console.log("La fecha calculada es menor a la fecha de mayoria de edad")
        this.polBenSelect.FecVigenciaHasta = this.fec_valida;
      }
      
      await this.prePolizasService.getFechaEfectoTutor(this.polBenSelect.FecVigenciaDesde)
      .then((resp: any) => {
        this.polBenSelect.FecEfecto = this._serviceFecha.formatGuion(new Date(moment(resp.FechaEfecto).format('LLLL')));
      });
    }
  }

  async cerrarModal() {
    this.polBenSelect = Object.assign({}, this.polBenSelectRe);
    (<any>$('#modalAgregarTutor')).modal('hide');
  }

  async abrirModalTutor() {
    //this.polBenSelect.FecVigenciaHasta = moment(this.polBenSelect.FecVigenciaDesde).add(this.polBenSelect.NumMesesPoder, 'months').add(-1, 'day').format('YYYY-MM-DD');
    this.fec_valida = this.polBenSelect.FecVigenciaHasta = moment(this.polBenSelect.FecVigenciaDesde).add(this.polBenSelect.NumMesesPoder, 'months').add(-1, 'day').format('YYYY-MM-DD');
    //console.log(this.polBenSelect.FecNacben)
    this.polBenSelect.FecVigenciaHasta = moment(this.polBenSelect.FechaTutorBen).add(216, 'months').add(-1, 'day').format('YYYY-MM-DD');
    //console.log(this.polBenSelect.FechaTutorBen)
    if(this.fec_valida > this.polBenSelect.FecVigenciaHasta)
    {
      //console.log("La fecha calculada es mayor a la fecha de mayoria de edad")
      this.polBenSelect.FecVigenciaHasta = this.polBenSelect.FecVigenciaHasta;
    }
    else{
      //console.log("La fecha calculada es menor a la fecha de mayoria de edad")
      this.polBenSelect.FecVigenciaHasta = this.fec_valida;
    }
    await this.cambiarBanco('tutores');
    if (this.polBenSelect.FecEfecto === null || this.polBenSelect.FecEfecto === '') {
      await this.prePolizasService.getFechaEfectoTutor(this.polBenSelect.FecVigenciaDesde)
      .then((resp: any) => {
        this.polBenSelect.FecEfecto = this._serviceFecha.formatGuion(new Date(moment(resp.FechaEfecto).format('LLLL')));
      });
    }

    if (this.polBenSelect.CodDireccionTut !== 0) {
      this.cmbDistritoTutor = await this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + this.polBenSelect.CodDireccionTut.toString()).toPromise();
      this.cmbDistritoAllTutor = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboTutorResp = this.cmbDistritoAllTutor.slice();
      this.DepartamentoTutor = this.cmbDistritoAllTutor.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccionTut) ).CodRegion;
      this.ProvinciaTutor = this.cmbDistritoAllTutor.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccionTut) ).CodProvinciaDis;
      this.cmbProvinciaTutor = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.DepartamentoTutor).toPromise();
    } else {
      this.DepartamentoTutor = '';
      this.ProvinciaTutor = '';
      this.cmbDistritoAllTutor = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboTutorResp = this.cmbDistritoAllTutor.slice();
    }
    // Líneas para mandar llamar método para validaciones de Tipos y Números de cuenta del Tutor asignado al beneficiario,
    // si es que tiene alguno asignado al realizar la búsqueda de la póliza.
    await this.cambiarTipoCuenta('tutores');
    this.polBenSelectRe = Object.assign({}, this.polBenSelect);
    
  }

  // Para el combo de Tipo de Vía de Pago de los Tutores de los beneficiarios.
  selectViaPagoTutor(bandera: string) {
    const CodViaPagoTutor = this.polBenSelect.CodViaPagoTut;
    if (bandera === 'combo') {
      this.polBenSelect.CodSucursalTut = '000';
      this.polBenSelect.CodTipoCuentaTut = '00';
      this.polBenSelect.CodBancoTut = '00';
      this.polBenSelect.NumCuentaTut = '';
      this.polBenSelect.NumCuentaCCITut = '';
    }

    if (CodViaPagoTutor === '00') {
      this.isDisabledSucursalTutor = true;
      this.isDisabledTipoCuentaTutor = true;
      this.isDisabledBancoTutor = true;
      this.isDisabledNumCuentaTutor = true;
      this.isDisabledNumCuentaCciTutor = true;
    }

    if (CodViaPagoTutor === '01' || CodViaPagoTutor === '04') {
      this.isDisabledSucursalTutor = false;
      this.isDisabledTipoCuentaTutor = true;
      this.isDisabledBancoTutor = true;
      this.isDisabledNumCuentaTutor = true;
      this.isDisabledNumCuentaCciTutor = true;
    }

    if (CodViaPagoTutor === '02') {
      this.isDisabledSucursalTutor = true;
      this.isDisabledTipoCuentaTutor = false;
      this.isDisabledBancoTutor = false;
      this.isDisabledNumCuentaTutor = false;
      this.isDisabledNumCuentaCciTutor = false;
    }

    if (CodViaPagoTutor === '05') {
      this.isDisabledSucursalTutor = true;
      this.isDisabledTipoCuentaTutor = true;
      this.isDisabledBancoTutor = false;
      this.isDisabledNumCuentaTutor = true;
      this.isDisabledNumCuentaCciTutor = true;
    }
  }

  async buscarPoliza(pNumPoliza: string) {
    this.isDisabled1 = true;
    this.isDisabled2 = false;

    await this.prePolizasService.getPoliza(pNumPoliza)
      .then(async (resp: any) => {
        if (resp.Mensaje !== 'EXITOSO') {
          this.mostrarAlertaError('ERROR', resp.Mensaje);
          return;
        } else {
          this.dataConsulta = resp;
          this.TipoIden = resp.CodTipoidenafi;
          this.TipoVejez = resp.CodVejez;
          this.EstCivil = resp.CodEstcivil;
          this.InsSalud = resp.CodIsapre;
          this.ViaPago = resp.CodViapago === '' ? '00' : resp.CodViapago;
          this.Sucursal = resp.CodViapago === '' || resp.CodViapago === '00' ? '000' : resp.CodSucursal;
          this.dataConsulta.CodViapago = resp.CodViapago === '' ? '00' : resp.CodViapago;
          this.dataConsulta.CodSucursal = resp.CodViapago === '' || resp.CodViapago === '00' ? '000' : (resp.CodViapago === '04' ? resp.CodAfp : resp.CodSucursal);
          this.Sucursal = this.dataConsulta.CodSucursal;
          this.TipoCuenta = resp.CodTipcuenta === '' || resp.CodTipcuenta === '00' ? '00' : resp.CodTipcuenta;;
          this.Banco = resp.CodBanco;
          this.codSexoSelect = this.dataConsulta.CodSexo;
          this.TipoPension = this.dataConsulta.CodTippension;
          this.dataConsulta.CodCauinv = resp.CodCauinv === '' ? '0' : resp.CodCauinv;
          if (this.TipoPension === '08') {
            this.isDisabledFecFall = false;
          }
          if (this.TipoPension === '06' || this.TipoPension === '07') {
            this.isDisabledFecInv = false;
            this.isDisabledCauInv = false;
          } else {
            this.isDisabledFecInv = true;
            this.isDisabledCauInv = true;
          }
          this.AFP = this.dataConsulta.CodAfp;
          this.direccionStr = resp.DireccionStr;
          this.dirCorrStr = resp.DirCorrStr;

          if (this.dataConsulta.CodTippension === '05' || this.dataConsulta.CodTippension === '04')
          {
            this.tipPen = false;
          }

          // Líneas para mandar llamar método para validaciones de Tipos y Números de cuenta del Afiliado, si es que tiene alguno asignado al realizar la búsqueda de la póliza.
          await this.cambiarBanco('afiliado');

          this.Distrito = Number(this.dataConsulta.CodDireccion);
          this.Distrito2 = Number(this.dataConsulta.CodUbigeoCorresp);
          //this.dataConsulta.FecIngresospp = this.dataConsulta.FecIngresospp === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecIngresospp).format('LLLL')));
          this.dataConsulta.FecEmision = this.dataConsulta.FecEmision === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecEmision).format('LLLL')));
          this.dataConsulta.FecNacben = this.dataConsulta.FecNacben === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecNacben).format('LLLL')));
          this.dataConsulta.FecInvben = this.dataConsulta.FecInvben === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecInvben).format('LLLL')));
          this.dataConsulta.FecFallben = this.dataConsulta.FecFallben === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecFallben).format('LLLL')));
          this.dataConsulta.FecAceptacion = this.dataConsulta.FecAceptacion === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecAceptacion).format('LLLL')));

          if (this.TipoIden === 1) {
            this.maxLengthNumDoc = '8';
          }
          if (this.TipoIden === 2 || this.TipoIden === 5) {
            this.maxLengthNumDoc = '12';
          }
          if (this.TipoIden === 9) {
            this.maxLengthNumDoc = '11';
          }
          if (this.TipoIden === 3 || this.TipoIden === 4 || (this.TipoIden > 5 && this.TipoIden < 9) || this.TipoIden === 10) {
            this.maxLengthNumDoc = '15';
          }



          // Agregado para consultar beneficiarios por póliza
          await this.prePolizasService.getBeneficiariosPol(pNumPoliza)
          .then( (respBen: any) => {
            if (respBen[0].Mensaje !== 'EXITOSO') {
              this.mostrarAlertaError('ERROR', respBen[0].Mensaje);
              return;
            } else {
              this.beneficiariosPoliza = respBen;
              this.dataPolBen = Object.assign([], respBen);
              this.dataPolBenRespaldo = Object.assign([], respBen);
              this.dataSource = new MatTableDataSource(respBen);
            }
          });
        }
      });

    if (this.dataConsulta.CodDireccion !== 0) {
      this.cmbDistrito = await this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + this.dataConsulta.CodDireccion.toString()).toPromise();
      this.cmbDistritoAll = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.Departamento = this.cmbDistritoAll.find( dis => dis.CodDireccion === Number(this.dataConsulta.CodDireccion) ).CodRegion;
      this.Provincia = this.cmbDistritoAll.find( dis => dis.CodDireccion === Number(this.dataConsulta.CodDireccion) ).CodProvinciaDis;
      this.cmbProvincia = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento).toPromise();
      this.comboDistritoResp = this.cmbDistritoAll.slice();
    } else {
      this.cmbDistritoAll = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistritoResp = this.cmbDistritoAll.slice();
    }

    if (this.dataConsulta.CodUbigeoCorresp !== 0) {
      this.cmbDistrito2 = await this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + this.dataConsulta.CodUbigeoCorresp.toString()).toPromise();
      this.cmbDistritoAll2 = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.Departamento2 = this.cmbDistritoAll2.find( dis => dis.CodDireccion === Number(this.dataConsulta.CodUbigeoCorresp) ).CodRegion;
      this.Provincia2 = this.cmbDistritoAll2.find( dis => dis.CodDireccion === Number(this.dataConsulta.CodUbigeoCorresp) ).CodProvinciaDis;
      this.cmbProvincia2 = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento2).toPromise();
      this.comboDistrito2Resp = this.cmbDistritoAll2.slice();
    } else {
      this.cmbDistritoAll2 = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistrito2Resp = this.cmbDistritoAll2.slice();
    }

    // Líneas para mandar llamar método para validaciones de Tipos y Números de cuenta del Afiliado, si es que tiene alguno asignado al realizar la búsqueda de la póliza.
    await this.cambiarTipoCuenta('afiliado');
  }

  // Para cargar combo provincia al seleccionar un departamento.
  async selectDepto(bandera: string) {
    if (bandera === 'tutor') {
      this.cmbProvinciaTutor = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.DepartamentoTutor).toPromise();
      this.ProvinciaTutor = '';
      this.polBenSelect.CodDireccionTut = 0;
    }
    if (this.opcionDir === 'Exp') {
      this.cmbProvincia = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento).toPromise();
      this.Provincia = '';
      this.Distrito =  0;
    } else {
      this.cmbProvincia2 = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento2).toPromise();
      this.Provincia2 = '';
      this.Distrito2 =  0;
    }
  }
// Para cargar combo provincia al seleccionar un departamento Beneficiarios.
  async selectDeptoBen(bandera: string) {
    if (this.opcionDir === 'ExpBen') {
      this.cmbProvinciaBen = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.DepartamentoBen).toPromise();
      this.ProvinciaBen = '';
      this.DistritoBen =  0;
    } else {
      this.cmbProvincia2Ben = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento2Ben).toPromise();
      this.Provincia2Ben = '';
      this.Distrito2Ben =  0;
    }
  }

  // Para cargar combo distrito al seleccionar una provincia Beneficiarios.
  async selectProvinciaBen(bandera: string) {
    if (this.opcionDir === 'ExpBen') {
      this.cmbDistritoBen = await this.http.get<any[]>(this.url + '/CmbDistritoDos?pCodProvincia=' + this.ProvinciaBen).toPromise();
      this.cmbDistritoAllBen = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistritoRespBen = this.cmbDistritoAllBen.slice();
      this.DistritoBen =  this.cmbDistritoBen[0].CodDireccion;
      this.selectDistritoBen(bandera);
    } else {
      this.cmbDistrito2Ben = await this.http.get<any[]>(this.url + '/CmbDistritoDos?pCodProvincia=' + this.Provincia2Ben).toPromise();
      this.cmbDistritoAll2Ben = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistrito2RespBen = this.cmbDistritoAll2Ben.slice();
      this.Distrito2Ben = this.cmbDistrito2Ben[0].CodDireccion;
      this.selectDistritoBen(bandera);
    }
  }

  // Para cargar combo distrito al seleccionar una provincia.
  async selectProvincia(bandera: string) {
    if (bandera === 'tutor') {
      this.cmbDistritoTutor = await this.http.get<any[]>(this.url + '/CmbDistritoDos?pCodProvincia=' + this.ProvinciaTutor).toPromise();
      this.cmbDistritoAllTutor = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboTutorResp = this.cmbDistritoAllTutor.slice();
      this.DistritoTutor = this.cmbDistritoTutor[0].CodDireccion;
      this.polBenSelect.CodDireccionTut = this.cmbDistritoTutor[0].CodDireccion;
      this.selectDistrito(bandera);
    }
    if (this.opcionDir === 'Exp') {
      this.cmbDistrito = await this.http.get<any[]>(this.url + '/CmbDistritoDos?pCodProvincia=' + this.Provincia).toPromise();
      this.cmbDistritoAll = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistritoResp = this.cmbDistritoAll.slice();
      this.Distrito =  this.cmbDistrito[0].CodDireccion;
      this.selectDistrito(bandera);
    } else {
      this.cmbDistrito2 = await this.http.get<any[]>(this.url + '/CmbDistritoDos?pCodProvincia=' + this.Provincia2).toPromise();
      this.cmbDistritoAll2 = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistrito2Resp = this.cmbDistritoAll2.slice();
      this.Distrito2 = this.cmbDistrito2[0].CodDireccion;
      this.selectDistrito(bandera);
    }
  }

  // Para cambio de codigo de dirección al seleccionar un distrito.
  selectDistrito(bandera: string) {
    if (bandera === 'tutor') {
      this.polBenSelect.CodDireccionTut = Number(this.polBenSelect.CodDireccionTut);
    }
    if (this.opcionDir === 'Exp') {
      if (Number(this.Distrito) !== 0) {
        this.dataConsulta.CodDireccion = Number(this.Distrito);
        this.cambioDir();
      }
    } else {
      if (Number(this.Distrito2) !== 0) {
        this.dataConsulta.CodUbigeoCorresp = Number(this.Distrito2);
        this.cambioDirCorr();
      }
    }
  }

  // Para cambio de codigo de dirección al seleccionar un distrito Beneficiarios.
  selectDistritoBen(bandera: string) {
    if (this.opcionDir === 'ExpBen') {
      if (Number(this.DistritoBen) !== 0) {
        this.polBenSelect.CodDireccion = Number(this.DistritoBen);
        this.cambioDirBen();
      }
    } else {
      if (Number(this.Distrito2Ben) !== 0) {
        this.polBenSelect.CodUbigeoCorresp = Number(this.Distrito2Ben);
        this.cambioDirCorrBen();
      }
    }
  }

  // Agregado para la seleccion del beneficiario de la tabla
  async seleccionaTblBen(ben: any) {
    this.polBenSelectRespaldo = Object.assign({}, ben);

    if(this.regOriginal != undefined){
      var index = this.dataSource.data.indexOf(this.dataSource.data.find(x => x.NumOrden === this.regOriginal.NumOrden));
      this.dataSource.data[index] = this.regOriginal;
      this.dataSource = new MatTableDataSource(this.dataSource.data)
    }
    this.regOriginal = JSON.parse(JSON.stringify(ben));


    const tipoDocBen = Number(this.codIdenBenSelect);
    const tipoDocBenSelect = Number(ben.CodTipoidenben);
    const tipoDocTutor = Number(ben.TipoDocumentoTut);

    if (ben.CodPar !== '99') {

      if (tipoDocBen !== 0 && this.polBenSelect.NumIdenben.trim() === '') {
        Swal.fire('Error', 'Debe ingresar el No. de documento para el Beneficiario.', 'error');
        return;
      }

      if ((tipoDocBen === 1 || tipoDocBen === 9) && (this.polBenSelect.NumIdenben.trim().length !== Number(this.maxLengthNumDocBen))) {
        Swal.fire('Error', 'Debe ingresar la longitud exacta del tipo de documento seleccionado para el Beneficiario.', 'error');
        return;
      }

      let list = this.validaCorreoBeneficiario();
      if (!list[0].validate) {
        Swal.fire('Error', list[0].mensajeTot, 'error');
        return;
      }

      list = this.validaTelefonoBeneficiario();
      if (!list[0].validate) {
        Swal.fire('Error', list[0].mensajeTot, 'error');
        return;
      }

      if (tipoDocBenSelect === 1) {
        this.maxLengthNumDocBen = '8';
      }
      if (tipoDocBenSelect === 2 || tipoDocBenSelect === 5) {
        this.maxLengthNumDocBen = '12';
      }
      if (tipoDocBenSelect === 9) {
        this.maxLengthNumDocBen = '11';
      }
      if (tipoDocBenSelect === 3 || tipoDocBenSelect === 4 || (tipoDocBenSelect > 5 && tipoDocBenSelect < 9) || tipoDocBenSelect === 10 || tipoDocBenSelect === 0) {
        this.maxLengthNumDocBen = '15';
      }
      if (ben.CodStinv === 'N')
          {
            this.sitInvalidez = true;
          }
      else {
          this.sitInvalidez = false;
      }

      // Para números de documento del tutor
      if (tipoDocTutor === 1) {
        this.maxLengthNumDocTutor = '8';
      }
      if (tipoDocTutor === 2 || tipoDocTutor === 5) {
        this.maxLengthNumDocTutor = '12';
      }
      if (tipoDocTutor === 9) {
        this.maxLengthNumDocTutor = '11';
      }
      if (tipoDocTutor === 3 || tipoDocTutor === 4 || (tipoDocTutor > 5 && tipoDocTutor < 9) || tipoDocTutor === 10 || tipoDocTutor === 0) {
        this.maxLengthNumDocTutor = '15';
      }

      this.polBenSelect = ben;
      this.polBenSelect.NombreCompletoTut = `${ this.polBenSelect.PrimerNombreTut } ${ this.polBenSelect.SegundoNombreTut } ${ this.polBenSelect.ApellidoPaternoTut } ${ this.polBenSelect.ApellidoMaternoTut }`;
      this.polBenSelect.CodViaPagoTut = this.polBenSelect.CodViaPagoTut === '' ? '00' : this.polBenSelect.CodViaPagoTut;
      this.polBenSelect.CodSucursalTut = this.polBenSelect.CodSucursalTut === '' ? '000' : this.polBenSelect.CodSucursalTut;
      this.polBenSelect.CodBancoTut = this.polBenSelect.CodBancoTut === '' ? '00' : this.polBenSelect.CodBancoTut;
      this.polBenSelect.CodTipoCuentaTut = this.polBenSelect.CodTipoCuentaTut === '' ? '00' : this.polBenSelect.CodTipoCuentaTut;

      this.codIdenBenSelect = this.polBenSelect.CodTipoidenben;
      this.codDerPenBenSelect = this.polBenSelect.CodDerpen;
      this.codCausInvBenSelect = this.polBenSelect.CodCauinv;
      this.codSexoBenSelect = this.polBenSelect.CodSexo;
      this.codParBenSelect = this.polBenSelect.CodPar;
      this.codGruFamBenSelect = this.polBenSelect.CodGrufam;
      this.codSitInvBenSelect = this.polBenSelect.CodStinv;

      if (this.codSitInvBenSelect === 'N' && ben.CodPar === '30') {
        this.isDisabledEst = false;
      }
      if (this.codSitInvBenSelect === 'N' && ben.CodPar !== '30') {
        this.isDisabledEst = true;
      }
      if (this.codSitInvBenSelect === 'S') {
        this.isDisabledEst = true;
      }

      this.selectViaPagoTutor('');
      if (this.polBenSelect.CodDireccionTut !== 0) {
        this.cmbDistritoTutor = await this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + this.polBenSelect.CodDireccionTut.toString()).toPromise();
        this.cmbDistritoAllTutor = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
        this.comboTutorResp = this.cmbDistritoAllTutor.slice();
        this.DepartamentoTutor = this.cmbDistritoTutor.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccionTut) ).CodRegion;
        this.ProvinciaTutor = this.cmbDistritoTutor.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccionTut) ).CodProvinciaDis;
        this.cmbProvinciaTutor = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.DepartamentoTutor).toPromise();
      }

      this.DistritoBen = Number(this.polBenSelect.CodDireccion);
      this.Distrito2Ben = Number(this.polBenSelect.CodUbigeoCorresp);
      if (this.polBenSelect.CodDireccion !== 0) {
        this.cmbDistritoBen = await this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + this.polBenSelect.CodDireccion.toString()).toPromise();
        this.cmbDistritoAllBen = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
        this.comboDistritoRespBen = this.cmbDistritoAllBen.slice();
        this.DepartamentoBen = this.cmbDistritoAllBen.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccion) ).CodRegion;
        this.ProvinciaBen = this.cmbDistritoAllBen.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccion) ).CodProvinciaDis;
        this.cmbProvinciaBen = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.DepartamentoBen).toPromise();
        this.cambioDirBen();
      } else {
        this.DepartamentoBen = '';
        this.ProvinciaBen = '';
        this.cmbDistritoAllBen = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
        this.comboDistritoRespBen = this.cmbDistritoAllBen.slice();
        this.direccionStrBen = '';
      }

      if (this.polBenSelect.CodUbigeoCorresp !== 0) {
        this.cmbDistrito2Ben = await this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + this.polBenSelect.CodUbigeoCorresp.toString()).toPromise();
        this.cmbDistritoAll2Ben = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
        this.Departamento2Ben = this.cmbDistritoAll2Ben.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodUbigeoCorresp) ).CodRegion;
        this.Provincia2Ben = this.cmbDistritoAll2Ben.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodUbigeoCorresp) ).CodProvinciaDis;
        this.cmbProvincia2Ben = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento2Ben).toPromise();
        this.comboDistrito2RespBen = this.cmbDistritoAll2Ben.slice();
        this.cambioDirCorrBen();
      } else {
        this.Departamento2Ben = '';
        this.Provincia2Ben = '';
        this.cmbDistritoAll2Ben = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
        this.comboDistrito2RespBen = this.cmbDistritoAll2Ben.slice();
        this.dirCorrStrBen = '';
      }
    } else {
      if (this.polBenSelect !== null && this.polBenSelect.NumOrden !== 0) {
        let list = this.validaCorreoBeneficiario();
        if (!list[0].validate) {
          Swal.fire('Error', list[0].mensajeTot, 'error');
          return;
        }

        list = this.validaTelefonoBeneficiario();
        if (!list[0].validate) {
          Swal.fire('Error', list[0].mensajeTot, 'error');
          return;
        }
      }

      this.limpiar();
      this.codIdenBenSelect = 0;
      this.codDerPenBenSelect = '';
      this.codCausInvBenSelect = '';
      this.codSexoBenSelect = '';
      this.codParBenSelect = '';
      this.codGruFamBenSelect = '';
      this.codSitInvBenSelect = '';
      this.maxLengthNumDocBen = '15';

      // Para modal de tutor
      this.cmbDistritoTutor = [];
      this.cmbProvinciaTutor = [];
      this.maxLengthNumDocTutor = '15';
      this.DistritoTutor = 0;
      this.DepartamentoTutor = '';
      this.ProvinciaTutor = '';
      this.cmbDistritoAllTutor = [];

      this.isDisabledViaPagoTutor = false;
      this.isDisabledSucursalTutor = true;
      this.isDisabledTipoCuentaTutor = true;
      this.isDisabledBancoTutor = true;
      this.isDisabledNumCuentaTutor = true;
      this.isDisabledNumCuentaCciTutor = true;
      this.isDisabledEst = true;
      // Para modal de tutor

      Swal.fire('Alerta', 'No se puede modificar el Titular.', 'info');
      return;
    }

  }

  cambiarTipoIdenBen(bandera: string) {
    const tipoDoc = Number(this.codIdenBenSelect);
    const tipoDocTutor = Number(this.polBenSelect.TipoDocumentoTut);

    if (bandera === 'beneficiario') {
      this.polBenSelect.CodTipoidenben = tipoDoc; // Number(this.codIdenBenSelect);
      this.polBenSelect.NumIdenben = '';

      if (tipoDoc === 1) {
        this.maxLengthNumDocBen = '8';
      }
      if (tipoDoc === 2 || tipoDoc === 5) {
        this.maxLengthNumDocBen = '12';
      }
      if (tipoDoc === 9) {
        this.maxLengthNumDocBen = '11';
      }
      if (tipoDoc === 3 || tipoDoc === 4 || (tipoDoc > 5 && tipoDoc < 9) || tipoDoc === 10 || tipoDoc === 0) {
        this.maxLengthNumDocBen = '15';
      }
      if(tipoDoc === 0){
        this.polBenSelect.TipoidenbenStr = "S/I";
      }
      else{
        this.polBenSelect.TipoidenbenStr = this.cmbTipoIdenBen.find(item => item.codigo === tipoDoc).Nombre;
      }

    }

    if (bandera === 'tutor') {
      this.polBenSelect.TipoDocumentoTut = tipoDocTutor;
      this.polBenSelect.NumeroDocumentoTut = '';

      if (tipoDocTutor === 1) {
        this.maxLengthNumDocTutor = '8';
      }
      if (tipoDocTutor === 2 || tipoDocTutor === 5) {
        this.maxLengthNumDocTutor = '12';
      }
      if (tipoDocTutor === 9) {
        this.maxLengthNumDocTutor = '11';
      }
      if (tipoDocTutor === 3 || tipoDocTutor === 4 || (tipoDocTutor > 5 && tipoDocTutor < 9) || tipoDocTutor === 10 || tipoDocTutor === 0) {
        this.maxLengthNumDocTutor = '15';
      }
    }
  }

  async btnCotizacion(pNumCotizacion: string) {
    this.isDisabled1 = false;
    this.isDisabled2 = true;
    this.valorBtnCancelar = false;
    await this.prePolizasService.getCotizacion(pNumCotizacion)
      .then((resp: any) => {
        this.dataConsulta = resp;
        this.TipoIden = resp.CodTipoidenafi;
        this.TipoVejez = resp.CodVejez;
        this.EstCivil = resp.CodEstcivil;
        this.InsSalud = resp.CodIsapre;
        this.ViaPago = resp.CodViapago === '' ? '00' : resp.CodViapago;
        this.Sucursal = resp.CodViapago === '' || resp.CodViapago === '00' ? '000' : resp.CodSucursal;
        this.dataConsulta.CodViapago = resp.CodViapago === '' ? '00' : resp.CodViapago;
        this.dataConsulta.CodSucursal = resp.CodViapago === '' || resp.CodViapago === '00' ? '000' : (resp.CodViapago === '04' ? resp.CodAfp : resp.CodSucursal);
        this.Sucursal = this.dataConsulta.CodSucursal;
        this.TipoCuenta = resp.CodTipcuenta;
        this.Banco = resp.CodBanco;
        this.codSexoSelect = resp.CodSexo;
        this.TipoPension = this.dataConsulta.CodTippension;
        this.dataConsulta.CodCauinv = resp.CodCauinv === '' ? '0' : resp.CodCauinv;
        if (this.TipoPension === '08') {
          this.isDisabledFecFall = false;
        }
        if (this.TipoPension === '06' || this.TipoPension === '07') {
          this.isDisabledFecInv = false;
          this.isDisabledCauInv = false;
        } else {
          this.isDisabledFecInv = true;
          this.isDisabledCauInv = true;
        }
        this.AFP = this.dataConsulta.CodAfp;
        this.direccionStr = resp.DireccionStr;

        //this.dataConsulta.FecIngresospp = this.dataConsulta.FecIngresospp === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecIngresospp).format('LLLL')));
        //this.dataConsulta.FecIngresospp = this._serviceFecha.formatGuion(new Date());
        this.dataConsulta.FecNacben = this.dataConsulta.FecNacben === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecNacben).format('LLLL')));
        this.dataConsulta.FecInvben = this.dataConsulta.FecInvben === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecInvben).format('LLLL')));
        this.dataConsulta.FecFallben = this.dataConsulta.FecFallben === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecFallben).format('LLLL')));
        this.dataConsulta.FecAceptacion = this.dataConsulta.FecAceptacion === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecAceptacion).format('LLLL')));
        this.dataConsulta.FecEmision = this.dataConsulta.FecEmision === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.dataConsulta.FecEmision).format('LLLL')));
        //this.dataConsulta.FecEmision = this._serviceFecha.formatGuion(new Date());

        if (this.TipoIden === 1) {
          this.maxLengthNumDoc = '8';
        }
        if (this.TipoIden === 2 || this.TipoIden === 5) {
          this.maxLengthNumDoc = '12';
        }
        if (this.TipoIden === 9) {
          this.maxLengthNumDoc = '11';
        }
        if (this.TipoIden === 3 || this.TipoIden === 4 || (this.TipoIden > 5 && this.TipoIden < 9) || this.TipoIden === 10) {
          this.maxLengthNumDoc = '15';
        }
      });

    this.cmbDistritoAll = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
    this.comboDistritoResp = this.cmbDistritoAll.slice();
    this.cmbDistritoAll2 = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
    this.comboDistrito2Resp = this.cmbDistritoAll.slice();

    // Agregado para consultar beneficiarios por cotización
    this.prePolizasService.getBeneficiariosCot(pNumCotizacion) // Mandar número de cotización
      .then( (resp: any) => {
        // this.dataPolBen = resp;
        this.dataPolBen = Object.assign([], resp);
        this.dataPolBenRespaldo = Object.assign([], resp);
        this.dataSource = new MatTableDataSource(resp);
      });

  }

  // Crear la Pre-Póliza
  async crearPrepoliza() {
    this.validaBeneficiarios = false;
    const tipoDoc = Number(this.TipoIden);
    const tipoDocBen = Number(this.codIdenBenSelect);

    if (tipoDoc === 0) {
      Swal.fire('Error', 'Debe seleccionar un Tipo de documento para el Afiliado.', 'error');
      return;
    }
    if (this.dataConsulta.GlsDireccionCorresp != '' && this.dataConsulta.CodUbigeoCorresp == 0)
    {
      Swal.fire('Error', 'Debe ingresar el ubigeo para la dirección correspondencia.', 'error');
      return;
    }

    if (tipoDoc !== 0 && this.dataConsulta.NumIdenafi.trim() === '') {
      Swal.fire('Error', 'Debe ingresar el No. de documento para el Afiliado.', 'error');
      return;
    }

    if ((tipoDoc === 1 || tipoDoc === 9) && (this.dataConsulta.NumIdenafi.length !== Number(this.maxLengthNumDoc))) {
      Swal.fire('Error', 'Debe ingresar la longitud exacta del tipo de documento seleccionado para el Afiliado.', 'error');
      return;
    }

    if (this.dataConsulta.GlsDireccion === '' || this.dataConsulta.CodDireccion === 0) {
      Swal.fire('Error', 'Debe ingresar la Dirección del Expediente y Código Ubigeo.', 'error');
      return;
    }

    if ((this.ViaPago === '00')) {
      Swal.fire('Error', 'Debe seleccionar una Vía de Pago en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '01' || this.ViaPago === '04') && (this.Sucursal === '' || this.Sucursal === '000')) {
      Swal.fire('Error', 'Debe seleccionar una Sucursal en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '02' || this.ViaPago === '05') && (this.Banco === '00' || this.Banco === '')) {
      Swal.fire('Error', 'Debe seleccionar una Banco en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '02') && (this.TipoCuenta === '00' || this.TipoCuenta === '')) {
      Swal.fire('Error', 'Debe seleccionar un Tipo de Cuenta en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '02') && (this.dataConsulta.NumCuentacci === '' || this.dataConsulta.NumCuenta === '')) {
      Swal.fire('Error', 'Debe ingresar un Numero de cuenta y Código interbancario en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '02') && (!this.validaNumCuenta(this.dataConsulta.NumCuenta) || this.dataConsulta.NumCuenta.length !== Number(this.maxLengthNumCuenta))) {
      Swal.fire('Error', 'Número de cuenta inválido.', 'error');
      return;
    }

    if (tipoDocBen !== 0 && this.polBenSelect.NumIdenben.trim() === '') {
      Swal.fire('Error', 'Debe ingresar el No. de documento para el Beneficiario.', 'error');
      return;
    }

    if ((tipoDocBen === 1 || tipoDocBen === 9) && (this.polBenSelect.NumIdenben.length !== Number(this.maxLengthNumDocBen))) {
      Swal.fire('Error', 'Debe ingresar la longitud exacta del tipo de documento seleccionado para el Beneficiario.', 'error');
      return;
    }

    if (!this.validarAsignacionIdentificacion()) {
      Swal.fire('Error', 'Debe ingresar un tipo de identificación válido a todos los beneficiarios.', 'error');
      return;
    }

    if (!this.validarNumerosIdentificacion()) {
      Swal.fire('Error', 'El Número y Tipo de documento del afiliado o beneficiario ya se encuentra registrado.', 'error');
      return;
    }

    if (this.dataConsulta.FecIngresosppText === '' || this.dataConsulta.FecIngresosppText == null) {
      Swal.fire('Error', 'La fecha de ingreso al Sistema Privado de Pensiones no puede estar vacía, favor de verificar.', 'error');
      return;
    }
    if (this.dataConsulta.FecAceptacion === '' || this.dataConsulta.FecAceptacion == null) {
      Swal.fire('Error', 'La fecha de Aceptación no puede estar vacía, favor de verificar.', 'error');
      return;
    }
    // correo afiliado
    let list = this.validaCorreoAfiliado();
    if (!list[0].validate) {
      Swal.fire('Error', list[0].mensajeTot, 'error');
      return;
    }

    // correo beneficiario
    if (this.polBenSelect !== null && this.polBenSelect.NumOrden !== 0) {
      list = this.validaCorreoBeneficiario();
      if (!list[0].validate) {
        Swal.fire('Error', list[0].mensajeTot, 'error');
        return;
      }
    }

    // telefono afiliado
    list = this.validaTelefonoAfiliado();
    if (!list[0].validate) {
      Swal.fire('Error', list[0].mensajeTot, 'error');
      return;
    }

    // telefono beneficiario
    if (this.polBenSelect !== null && this.polBenSelect.NumOrden !== 0) {
      list = this.validaTelefonoBeneficiario();
      if (!list[0].validate) {
        Swal.fire('Error', list[0].mensajeTot, 'error');
        return;
      }
    }
    // this.dataConsulta.FecEmision = this.dataConsulta.FecEmision === '' ? '' : this._serviceFecha.format(new Date(moment(this.dataConsulta.FecEmision).format('LLLL')));

    this.dataPolBen[0].FecInvben = this.dataConsulta.FecInvben;
    this.dataPolBen[0].CodCauinv = this.dataConsulta.CodCauinv;
    this.dataPolBen[0].FecFallben = this.dataConsulta.FecFallben;
    this.dataConsulta.Usuario = localStorage.getItem('currentUser');
    this.dataPolBen[0].Usuario = localStorage.getItem('currentUser');
    this.dataPolBen[0].ProteccionBen = this.dataConsulta.Proteccion;
    this.dataPolBen[0].BoletaBen = this.dataConsulta.Boleta;
    await this.prePolizasService.postCrearPrePoliza(this.dataConsulta)
      .then( (resp: any) => {
        if (resp.Mensaje !== 'EXITOSO') {
          this.mostrarAlertaError('ERROR', resp.Mensaje);
          return;
        } else {
           
          this.prePolizasService.postCotizacionBen(this.dataPolBen)
            .then( (respBen: any) => {
              if (respBen.Mensaje !== 'EXITOSO') {
                this.mostrarAlertaError('ERROR', respBen.Mensaje);
                return;
              } else {
                this.dataConsulta.NumPoliza = respBen.NumPoliza;
                this.valorBtnCancelar = true;
                this.botonGeneraPDF = true;
                this.mostrarAlertaExitosa('AVISO', `Se creó la Pre-Póliza No. ${ respBen.NumPoliza }.`);
              }
            });

        }
      });
  }

  // Función para validar que se hayan asignado Tipos y Números de Identificación a todos los beneficarios.
  validarAsignacionIdentificacion(): boolean {
    let vlRespuesta = true;
    for (const item of this.dataPolBen) {
      if ((item.CodPar !== '99' && item.CodTipoidenben === 0) || (item.CodPar !== '99' && item.CodTipoidenben !== 0 && item.NumIdenben.trim() === '')) {
        vlRespuesta = false;
        break;
      }
    }
    return vlRespuesta;
  }

  // Función para validar que se hayan asignado Tipos y Números de Identificación a todos los beneficarios.
  validarNumerosIdentificacion(): boolean {
    let vlRespuesta = true;
    let vlCodTipoIdenBen = 0;
    let vlNumIdenBen = '';
    for (const item of this.dataPolBen) {
      vlCodTipoIdenBen = item.CodTipoidenben;
      vlNumIdenBen = item.NumIdenben.trim();

      for (const itemAux of this.dataPolBen) {
        if ((itemAux.NumOrden !== item.NumOrden) && (itemAux.CodTipoidenben === vlCodTipoIdenBen && itemAux.NumIdenben.trim() === vlNumIdenBen)) {
          vlRespuesta = false;
          break;
        }
      }

      if (!vlRespuesta) { break; }
    }
    return vlRespuesta;
  }

  // Guardar los cambios de la Póliza
  async guardar() {
    this.validaBeneficiarios = false;
    let msjUpdatePoliza = 'EXITOSO';

    const tipoDoc = Number(this.TipoIden);
    const tipoDocBen = Number(this.codIdenBenSelect);

    if (tipoDoc === 0) {
      Swal.fire('Error', 'Debe seleccionar un Tipo de documento para el Afiliado.', 'error');
      return;
    }
    if (this.dataConsulta.GlsDireccionCorresp != '' && this.dataConsulta.CodUbigeoCorresp == 0)
    {
      Swal.fire('Error', 'Debe ingresar el ubigeo para la dirección correspondencia.', 'error');
      return;
    }
    if (tipoDoc !== 0 && this.dataConsulta.NumIdenafi.trim() === '') {
      Swal.fire('Error', 'Debe ingresar el No. de documento para el Afiliado.', 'error');
      return;
    }

    if ((tipoDoc === 1 || tipoDoc === 9) && (this.dataConsulta.NumIdenafi.length !== Number(this.maxLengthNumDoc))) {
      Swal.fire('Error', 'Debe ingresar la longitud exacta del tipo de documento seleccionado para el Afiliado.', 'error');
      return;
    }

    if (this.dataConsulta.GlsDireccion === '' || this.dataConsulta.CodDireccion === 0) {
      Swal.fire('Error', 'Debe ingresar la Dirección del Expediente.', 'error');
      return;
    }

    if (this.direccionStr === '') {
      Swal.fire('Error', 'Debe generar la Dirección del Ubigeo Expediente.', 'error');
      return;
    }

    if ((this.ViaPago === '00')) {
      Swal.fire('Error', 'Debe seleccionar una Vía de Pago en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '01' || this.ViaPago === '04') && (this.Sucursal === '' || this.Sucursal === '000')) {
      Swal.fire('Error', 'Debe seleccionar una Sucursal en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '02' || this.ViaPago === '05') && (this.Banco === '00' || this.Banco === '')) {
      Swal.fire('Error', 'Debe seleccionar una Banco en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '02') && (this.TipoCuenta === '00' || this.TipoCuenta === '')) {
      Swal.fire('Error', 'Debe seleccionar un Tipo de Cuenta en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '02') && (this.dataConsulta.NumCuentacci === '' || this.dataConsulta.NumCuenta === '')) {
      Swal.fire('Error', 'Debe ingresar un Numero de cuenta y Código interbancario en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.ViaPago === '02') && (!this.validaNumCuenta(this.dataConsulta.NumCuenta) || this.dataConsulta.NumCuenta.length !== Number(this.maxLengthNumCuenta))) {
      Swal.fire('Error', 'Número de cuenta inválido.', 'error');
      return;
    }

    if (tipoDocBen !== 0 && this.polBenSelect.NumIdenben.trim() === '') {
      Swal.fire('Error', 'Debe ingresar el No. de documento para el Beneficiario.', 'error');
      return;
    }

    if ((tipoDocBen === 1 || tipoDocBen === 9) && (this.polBenSelect.NumIdenben.length !== Number(this.maxLengthNumDocBen))) {
      Swal.fire('Error', 'Debe ingresar la longitud exacta del tipo de documento seleccionado para el Beneficiario.', 'error');
      return;
    }

    if (this.validaBeneficiarios) {
      Swal.fire('Error', 'Debe ingresar un tipo de identificación válido a todos los beneficiarios.', 'error');
      return;
    }

    if (!this.validarAsignacionIdentificacion()) {
      Swal.fire('Error', 'Debe ingresar un tipo de identificación válido a todos los beneficiarios.', 'error');
      return;
    }

    if (!this.validarNumerosIdentificacion()) {
      Swal.fire('Error', 'El Número y Tipo de documento del afiliado o beneficiario ya se encuentra registrado.', 'error');
      return;
    }

    if (this.dataConsulta.FecIngresosppText === '') {
      Swal.fire('Error', 'La fecha de ingreso al Sistema Privado de Pensiones no puede estar vacía, favor de verificar.', 'error');
      return;
    }

    // correo afiliado
    let list = this.validaCorreoAfiliado();
    if (!list[0].validate) {
      Swal.fire('Error', list[0].mensajeTot, 'error');
      return;
    }

    // correo beneficiario
    if (this.polBenSelect !== null && this.polBenSelect.NumOrden !== 0) {
      list = this.validaCorreoBeneficiario();
      if (!list[0].validate) {
        Swal.fire('Error', list[0].mensajeTot, 'error');
        return;
      }
    }

    // telefono afiliado
    list = this.validaTelefonoAfiliado();
    if (!list[0].validate) {
      Swal.fire('Error', list[0].mensajeTot, 'error');
      return;
    }

    // telefono beneficiario
    if (this.polBenSelect !== null && this.polBenSelect.NumOrden !== 0) {
      list = this.validaTelefonoBeneficiario();
      if (!list[0].validate) {
        Swal.fire('Error', list[0].mensajeTot, 'error');
        return;
      }
    }

    this.dataPolBen[0].FecInvben = this.dataConsulta.FecInvben;
    this.dataPolBen[0].CodCauinv = this.dataConsulta.CodCauinv;
    this.dataPolBen[0].FecFallben = this.dataConsulta.FecFallben;
    this.dataPolBen[0].Usuario =  localStorage.getItem('currentUser');
    this.dataPolBen[0].ProteccionBen = this.dataConsulta.Proteccion;
    this.dataPolBen[0].BoletaBen = this.dataConsulta.Boleta;
    this.dataConsulta.Usuario =  localStorage.getItem('currentUser');
    await this.prePolizasService.postGuardar(this.dataConsulta)
      .then( (resp: any) => {
          msjUpdatePoliza = resp.Mensaje;
      });

    if ( msjUpdatePoliza === 'EXITOSO') {
      this.prePolizasService.postGuardarBenPol(this.dataPolBen)
        .then( (resp: any) => {
          if (resp.Mensaje !== 'EXITOSO') {
            this.mostrarAlertaError('ERROR', resp.Mensaje);
           } else {
            this.valorBtnCancelar = true;
            this.mostrarAlertaExitosa('AVISO', `Se actualizó la Póliza No. ${ resp.NumPoliza } correctamente.`);
           }
        });
    } else {
      this.mostrarAlertaError('ERROR', msjUpdatePoliza);
    }
  }

  ocultarModalTutor() {
    let numDocVal = false;
    let nombresVal = false;
    const tipoDocTutor = Number(this.polBenSelect.TipoDocumentoTut);

    if (tipoDocTutor !== 0 && this.polBenSelect.NumeroDocumentoTut.trim() === '') {
      Swal.fire('Error', 'Debe ingresar el No. de documento para el Tutor.', 'error');
      return;
    }

    if ((tipoDocTutor === 1 || tipoDocTutor === 9) && (this.polBenSelect.NumeroDocumentoTut.trim().length !== Number(this.maxLengthNumDocTutor))) {
      Swal.fire('Error', 'Debe ingresar la longitud exacta del tipo de documento seleccionado para el Tutor.', 'error');
      return;
    }
    numDocVal = true;

    if (tipoDocTutor !== 0 && (this.polBenSelect.PrimerNombreTut === '' || this.polBenSelect.ApellidoPaternoTut === '' || this.polBenSelect.ApellidoMaternoTut === '')) {
      Swal.fire('Error', 'Campos de nombre vacios, favor de verificar.', 'error');
      return;
    }
    nombresVal = true;

    if (numDocVal && nombresVal && (this.polBenSelect.CodViaPagoTut === '01' || this.polBenSelect.CodViaPagoTut === '04') && this.polBenSelect.CodSucursalTut === '000') {
      Swal.fire('Error', 'Debe seleccionar Sucursal/AFP de pago.', 'error');
      return;
    }

    if (numDocVal && nombresVal && (this.polBenSelect.CodViaPagoTut === '02' || this.polBenSelect.CodViaPagoTut === '05') && this.polBenSelect.CodBancoTut === '00') {
      Swal.fire('Error', 'Debe seleccionar Banco para pago.', 'error');
      return;
    }

    if (numDocVal && nombresVal && this.polBenSelect.CodViaPagoTut === '02' && this.polBenSelect.CodTipoCuentaTut === '00') {
      Swal.fire('Error', 'Debe seleccionar Tipo de Cuenta para pago.', 'error');
      return;
    }

    if (numDocVal && nombresVal && this.polBenSelect.CodViaPagoTut === '02' && (this.polBenSelect.NumCuentaTut === '' || this.polBenSelect.NumCuentaCCITut === '')) {
      Swal.fire('Error', 'Debe ingresar un Numero de cuenta y Código interbancario en Forma de Pago de Pensión.', 'error');
      return;
    }

    if ((this.polBenSelect.CodViaPagoTut === '02') && (!this.validaNumCuentaTutor(this.polBenSelect.NumCuentaTut) || this.polBenSelect.NumCuentaTut.length !== Number(this.maxLengthNumCuentaTut))) {
      Swal.fire('Error', 'Número de cuenta inválido.', 'error');
      return;
    }

    if (this.polBenSelect.GlsFono1Tut !== '') {
      if (this.polBenSelect.GlsFono1Tut.length < 7) {
        Swal.fire('Error', 'El teléfono del tutor debe tener mínimo 7 caracteres.', 'error');
        return;
      }
      if (this.polBenSelect.GlsFono1Tut.length > 9) {
        Swal.fire('Error', 'El teléfono del tutor debe tener máximo 9 caracteres.', 'error');
        return;
      }
    }

    if (this.polBenSelect.GlsFono2Tut !== '') {
      if (this.polBenSelect.GlsFono2Tut.length < 7) {
        Swal.fire('Error', 'El teléfono 2 del tutor debe tener mínimo 7 caracteres.', 'error');
        return;
      }
      if (this.polBenSelect.GlsFono2Tut.length > 9) {
        Swal.fire('Error', 'El teléfono 2 del tutor debe tener máximo 9 caracteres.', 'error');
        return;
      }
    }

    if (this.polBenSelect.GlsFono3Tut !== '') {
      if (this.polBenSelect.GlsFono3Tut.length < 7) {
        Swal.fire('Error', 'El teléfono 3 del tutor debe tener mínimo 7 caracteres.', 'error');
        return;
      }
      if (this.polBenSelect.GlsFono3Tut.length > 9) {
        Swal.fire('Error', 'El teléfono 3 del tutor debe tener máximo 9 caracteres.', 'error');
        return;
      }
    }

    if (this.polBenSelect.GlsCorreo1Tut !== '') {
      const valEmail = this.validar_email(this.polBenSelect.GlsCorreo1Tut);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico del tutor no tiene formato válido.', 'error');
        return;
      }
    }

    if (this.polBenSelect.GlsCorreo2Tut !== '') {
      const valEmail = this.validar_email(this.polBenSelect.GlsCorreo2Tut);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 2 del tutor no tiene formato válido.', 'error');
        return;
      }
    }

    ($('#modalAgregarTutor') as any).modal('hide');
  }

  // Limpiar campos de beneficiario y revertir cambios en el mismo.
  limpiarDataBen() {
    const index = this.dataPolBenRespaldo.indexOf(this.dataPolBenRespaldo.find(x => x.NumOrden === this.polBenSelectRespaldo.NumOrden));
    this.dataPolBenRespaldo[index] = this.polBenSelectRespaldo;

    this.dataSource = new MatTableDataSource(this.dataPolBenRespaldo);
    this.dataPolBen = this.dataPolBenRespaldo;

    this.limpiar();
    this.codIdenBenSelect = 0;
    this.codDerPenBenSelect = '';
    this.codCausInvBenSelect = '';
    this.codSexoBenSelect = '';
    this.codParBenSelect = '';
    this.codGruFamBenSelect = '';
    this.codSitInvBenSelect = '';
    this.maxLengthNumDocBen = '15';

    // Para modal de tutor
    this.cmbDistritoTutor = [];
    this.cmbProvinciaTutor = [];
    this.maxLengthNumDocTutor = '15';
    this.DistritoTutor = 0;
    this.DepartamentoTutor = '';
    this.ProvinciaTutor = '';
    this.cmbDistritoAllTutor = [];

    this.isDisabledViaPagoTutor = false;
    this.isDisabledSucursalTutor = true;
    this.isDisabledTipoCuentaTutor = true;
    this.isDisabledBancoTutor = true;
    this.isDisabledNumCuentaTutor = true;
    this.isDisabledNumCuentaCciTutor = true;
    this.isDisabledEst = true;
    // Para modal de tutor
  }

  // Limpiar campos de la pantalla
  limpiar() {
    this.polBenSelect = {
      NumPoliza: '',
      NumOrden: 0,
      CodGrufam: '',
      CodPar: '',
      CodSexo: '',
      CodStinv: '',
      CodCauinv: '',
      CodDerpen: '',
      CodDercre: '',
      CodTipoidenben: 0,
      NumIdenben: '',
      GlsNomben: '',
      GlsNomsegben: '',
      GlsPatben: '',
      GlsMatben: '',
      FecNacben: '',
      FecInvben: '',
      FecFallben: '',
      FecNacHM: '',
      PrcPension: 0,
      PrcPensionleg: 0,
      MtoPension: 0,
      MtoPensiongar: 0,
      CodEstpension: '',
      PrcPensiongar: 0,
      GlsFono: '',
      GlsFono2: '',
      GlsFono3: '',
      GlsCorreo: '',
      GlsCorreo2: '',
      GlsCorreo3: '',
      IndEstudiante: '',
      NumCot: '',
      NumOperacion: 0,
      PrcPensionRep: 0,
      TipoidenbenStr: '',
      ParentescoStr: '',
      Mensaje: '',
      Usuario:'',
      GlsDireccionBen:'',
      GlsDireccionCorrespBen:'',
      DireccionStrBen: '',
      DirCorrStrBen: '',
      CodUbigeoCorresp: 0,
      CodDireccion: 0,
      // Datos de los tutores
      MostrarTutor: '',
      NombreCompletoTut: '',
      PrimerNombreTut: '',
      SegundoNombreTut: '',
      ApellidoPaternoTut: '',
      ApellidoMaternoTut: '',
      TipoDocumentoTut: 0,
      NumeroDocumentoTut: '',
      GlsDireccionTut: '',
      CodDireccionTut: 0,
      GlsFono1Tut: '',
      GlsFono2Tut: '',
      GlsFono3Tut: '',
      GlsCorreo1Tut: '',
      GlsCorreo2Tut: '',
      CodViaPagoTut: '',
      CodSucursalTut: '',
      CodBancoTut: '',
      CodTipoCuentaTut: '',
      NumCuentaTut: '',
      NumCuentaCCITut: '',
      NumMesesPoder: 0,
      FecVigenciaDesde: '',
      FecVigenciaHasta: '',
      FecEfecto: '',
      FecRecepcion: '',
      FechaTutorBen: moment().format('YYYY-MM-DD'),
      ProteccionBen: '',
      BoletaBen: ''
    };
  }

  mostrarAlertaExitosa(pTitle: string, pText: string) {
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'success',
      allowOutsideClick: false
    });
  }

  mostrarAlertaError(pTitle: string, pText: string) {
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'error',
      allowOutsideClick: false
    });
  }

  // Validaciones de campos(números, letras, etc.).
  // Validación input solo numeros.
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberDecimal(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode === 47 || charCode > 57)) {
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

  validar_email( email ) {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  validaNumCuenta(pNumCuenta) {
    return this.regexNumCuenta.test(pNumCuenta) ? true : false;
  }

  validaNumCuentaTutor(pNumCuenta) {
    return this.regexNumCuentaTut.test(pNumCuenta) ? true : false;
  }

  validaCorreoAfiliado() {
    let mensaje = '';
    let valido = true;

    if (this.dataConsulta.GlsCorreo3 !== '') {
      const valEmail = this.validar_email(this.dataConsulta.GlsCorreo3);
      if (!valEmail) {
        mensaje = 'El correo electrónico 3 no tiene formato válido.';
        valido = false;
      }
    }

    if (this.dataConsulta.GlsCorreo2 !== '') {
      const valEmail = this.validar_email(this.dataConsulta.GlsCorreo2);
      if (!valEmail) {
        mensaje = 'El correo electrónico 2 no tiene formato válido.';
        valido = false;;
      }
    }

    if (this.dataConsulta.GlsCorreo !== '') {
      const valEmail = this.validar_email(this.dataConsulta.GlsCorreo);
      if (!valEmail) {
        mensaje = 'El correo electrónico no tiene formato válido.';
        valido = false;
      }
    }
    const list = [];
    const object1 = {
            mensajeTot: mensaje,
            validate: valido
        };
    list.push(object1);
    return list;
  }

  validaCorreoBeneficiario() {
    let mensaje = '';
    let valido = true;

    if (this.polBenSelect.GlsCorreo3 !== '') {
      const valEmail = this.validar_email(this.polBenSelect.GlsCorreo3);
      if (!valEmail) {
        mensaje = 'El correo electrónico 3 del beneficiario no tiene formato válido.';
        valido = false;
      }
    }

    if (this.polBenSelect.GlsCorreo2 !== '') {
      const valEmail = this.validar_email(this.polBenSelect.GlsCorreo2);
      if (!valEmail) {
        mensaje = 'El correo electrónico 2 del beneficiario no tiene formato válido.';
        valido = false;
      }
    }

    if (this.polBenSelect.GlsCorreo !== '') {
      const valEmail = this.validar_email(this.polBenSelect.GlsCorreo);
      if (!valEmail) {
        mensaje = 'El correo electrónico del beneficiario no tiene formato válido.';
        valido = false;
      }
    }
    const list = [];
    const object1 = {
            mensajeTot: mensaje,
            validate: valido
        };
    list.push(object1);
    return list;
  }

  validaTelefonoAfiliado() {
    let mensaje = '';
    let valido = true;
    if (this.dataConsulta.GlsFono3 !== '') {
      if (this.dataConsulta.GlsFono3.length < 5) {
        mensaje = 'El teléfono 3 debe tener mínimo 5 caracteres.';
        valido = false;
      }
      if (this.dataConsulta.GlsFono3.length > 9) {
        mensaje = 'El teléfono 3 debe tener máximo 9 caracteres.';
        valido = false;
      }
    }

    if (this.dataConsulta.GlsFono2 !== '') {
      if (this.dataConsulta.GlsFono2.length < 5) {
        mensaje = 'El teléfono 2 debe tener mínimo 5 caracteres.';
        valido = false;
      }
      if (this.dataConsulta.GlsFono2.length > 9) {
        mensaje = 'El teléfono 2 debe tener máximo 9 caracteres.';
        valido = false;
      }
    }

    if (this.dataConsulta.GlsFono !== '') {
      if (this.dataConsulta.GlsFono.length < 5) {
        mensaje = 'El teléfono debe tener mínimo 5 caracteres.';
        valido = false;
      }
      if (this.dataConsulta.GlsFono.length > 9) {
        mensaje = 'El teléfono debe tener máximo 9 caracteres.';
        valido = false;
      }
    }

    const list = [];
    const object1 = {
            mensajeTot: mensaje,
            validate: valido
        };
    list.push(object1);
    return list;
  }

  validaTelefonoBeneficiario() {
    let mensaje = '';
    let valido = true;
    if (this.polBenSelect.GlsFono3 !== '') {
      if (this.polBenSelect.GlsFono3.length < 5) {
        mensaje = 'El teléfono 3 del beneficiario debe tener mínimo 5 caracteres.';
        valido = false;
      }
      if (this.polBenSelect.GlsFono3.length > 9) {
        mensaje = 'El teléfono 3 del beneficiario debe tener máximo 9 caracteres.';
        valido = false;
      }
    }
    if (this.polBenSelect.GlsFono2 !== '') {
      if (this.polBenSelect.GlsFono2.length < 5) {
        mensaje = 'El teléfono 2 del beneficiario debe tener mínimo 5 caracteres.';
        valido = false;
      }
      if (this.polBenSelect.GlsFono2.length > 9) {
        mensaje = 'El teléfono 2 del beneficiario debe tener máximo 9 caracteres.';
        valido = false;
      }
    }
    if (this.polBenSelect.GlsFono !== '') {
      if (this.polBenSelect.GlsFono.length < 5) {
        mensaje = 'El teléfono del beneficiario debe tener mínimo 5 caracteres.';
        valido = false;
      }
      if (this.polBenSelect.GlsFono.length > 9) {
        mensaje = 'El teléfono del beneficiario debe tener máximo 9 caracteres.';
        valido = false;
      }
    }
    const list = [];
    const object1 = {
            mensajeTot: mensaje,
            validate: valido
        };
    list.push(object1);
    return list;
  }

  checkMail() {
    if (this.opcionCorreos === 'Afiliado') {
      const list = this.validaCorreoAfiliado();
      if (!list[0].validate) {
        Swal.fire('Error', list[0].mensajeTot, 'error');
        return;
      }
    }
    if (this.opcionCorreos === 'Ben') {
      const list = this.validaCorreoBeneficiario();
      if (!list[0].validate) {
        Swal.fire('Error', list[0].mensajeTot, 'error');
        return;
      }
    }

    ($('#modalCorreos') as any).modal('hide');
  }

  async getInfo2(info) {
    if (this.opcionDir === 'Exp') {
      this.Distrito = info;
      this.cmbProvincia = await this.http.get<any[]>(this.url + '/CmbProvinciaAll?pCodDir=' + info).toPromise();
      this.lista = await this.http.get<any[]>(this.url + '/ProvinciaUnica?pCodDir=' + info).toPromise();
      if (this.lista.length > 0 ) {
        this.Provincia = this.lista[0].CodProvincia;
        this.Departamento = this.lista[0].CodRegion;
      }
    }

    if (this.opcionDir === 'Corresp') {
      this.Distrito2 = info;
      // carga combo provincia
      this.cmbProvincia2 = await this.http.get<any[]>(this.url + '/CmbProvinciaAll?pCodDir=' + info).toPromise();
      // obtiene provincia unica
      this.lista2 = await this.http.get<any[]>(this.url + '/ProvinciaUnica?pCodDir=' + info).toPromise();
      if (this.lista2.length > 0 ) {
        this.Provincia2 = this.lista2[0].CodProvincia;
        this.Departamento2 = this.lista2[0].CodRegion;
      }
    }
  }

  async getInfo2Ben(info) {
    if (this.opcionDir === 'ExpBen') {
      this.DistritoBen = info;
      this.polBenSelect.CodDireccion = this.DistritoBen;
      this.cmbProvinciaBen = await this.http.get<any[]>(this.url + '/CmbProvinciaAll?pCodDir=' + info).toPromise();
      this.listaBen = await this.http.get<any[]>(this.url + '/ProvinciaUnica?pCodDir=' + info).toPromise();
      if (this.listaBen.length > 0 ) {
        this.ProvinciaBen = this.listaBen[0].CodProvincia;
        this.DepartamentoBen = this.listaBen[0].CodRegion;
      }
    }

    if (this.opcionDir === 'CorrespBen') {
      this.Distrito2Ben = info;
      // carga combo provincia
      this.cmbProvincia2Ben = await this.http.get<any[]>(this.url + '/CmbProvinciaAll?pCodDir=' + info).toPromise();
      // obtiene provincia unica
      this.lista2Ben = await this.http.get<any[]>(this.url + '/ProvinciaUnica?pCodDir=' + info).toPromise();
      if (this.lista2Ben.length > 0 ) {
        this.Provincia2Ben = this.lista2Ben[0].CodProvincia;
        this.Departamento2Ben = this.lista2Ben[0].CodRegion;
      }
    }
  }

  async getInfo2Tut(info) {
    this.DistritoTutor = info;
    this.cmbProvinciaTutor = await this.http.get<any[]>(this.url + '/CmbProvinciaAll?pCodDir=' + info).toPromise();
    this.listaTutor = await this.http.get<any[]>(this.url + '/ProvinciaUnica?pCodDir=' + info).toPromise();
    if (this.listaTutor.length > 0 ) {
      this.ProvinciaTutor = this.listaTutor[0].CodProvincia;
      this.DepartamentoTutor = this.listaTutor[0].CodRegion;
    }
  }

  aceptarModalTel(){
    var valido = true;
    if(this.opcionTelefonos == 'Afiliado'){
      if (this.dataConsulta.GlsFono3 !== '') {
        if (this.dataConsulta.GlsFono3.length < 5) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener mínimo 5 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.dataConsulta.GlsFono3.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }

      if (this.dataConsulta.GlsFono2 !== '') {
        if (this.dataConsulta.GlsFono2.length < 5) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 5 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.dataConsulta.GlsFono2.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }

      if (this.dataConsulta.GlsFono !== '') {
        if (this.dataConsulta.GlsFono.length < 5) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 1 debe tener mínimo 5 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.dataConsulta.GlsFono.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 1 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }
    }
    if(this.opcionTelefonos == 'Ben'){
      if (this.polBenSelect.GlsFono3 !== '') {
        if (this.polBenSelect.GlsFono3.length < 5) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener mínimo 5 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.polBenSelect.GlsFono3.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }

      if (this.polBenSelect.GlsFono2 !== '') {
        if (this.polBenSelect.GlsFono2.length < 5) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 5 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.polBenSelect.GlsFono2.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }

      if (this.polBenSelect.GlsFono !== '') {
        if (this.polBenSelect.GlsFono.length < 5) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 1 debe tener mínimo 5 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.polBenSelect.GlsFono.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 1 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }
    }

    if(valido == true){
      (<any>$('#modalTelefonos')).modal('hide');
    }
  }

  cerrarModalTel(){

    this.validarTelefonos();
    (<any>$('#modalTelefonos')).modal('hide');
  }

  validarTelefonos(){
    if(this.opcionTelefonos == 'Afiliado'){
      if (this.dataConsulta.GlsFono3 !== '') {
        if (this.dataConsulta.GlsFono3.length < 5) {
          this.dataConsulta.GlsFono3 = "";

        }
        if (this.dataConsulta.GlsFono3.length > 9) {
          this.dataConsulta.GlsFono3 = "";

        }
      }

      if (this.dataConsulta.GlsFono2 !== '') {
        if (this.dataConsulta.GlsFono2.length < 5) {
          this.dataConsulta.GlsFono2 = "";

        }
        if (this.dataConsulta.GlsFono2.length > 9) {
          this.dataConsulta.GlsFono2 = "";

        }
      }

      if (this.dataConsulta.GlsFono !== '') {
        if (this.dataConsulta.GlsFono.length < 5) {
          this.dataConsulta.GlsFono = "";

        }
        if (this.dataConsulta.GlsFono.length > 9) {
          this.dataConsulta.GlsFono = "";

        }
      }
    }
    if(this.opcionTelefonos == 'Ben'){
      if (this.polBenSelect.GlsFono3 !== '') {
        if (this.polBenSelect.GlsFono3.length < 5) {
          this.polBenSelect.GlsFono3 = "";

        }
        if (this.polBenSelect.GlsFono3.length > 9) {
          this.polBenSelect.GlsFono3 = "";

        }
      }

      if (this.polBenSelect.GlsFono2 !== '') {
        if (this.polBenSelect.GlsFono2.length < 5) {
          this.polBenSelect.GlsFono2 = "";

        }
        if (this.polBenSelect.GlsFono2.length > 9) {
          this.polBenSelect.GlsFono2 = "";

        }
      }

      if (this.polBenSelect.GlsFono !== '') {
        if (this.polBenSelect.GlsFono.length < 5) {
          this.polBenSelect.GlsFono = "";

        }
        if (this.polBenSelect.GlsFono.length > 9) {
          this.polBenSelect.GlsFono = "";

        }
      }
    }


  }

  guardarBen(){
    const tipoDocBen = Number(this.polBenSelect.CodTipoidenben);

    if (tipoDocBen === 0) {
      Swal.fire('Error', 'Tipo de documento sin seleccionar.', 'error');
      return;
    }

    if (tipoDocBen !== 0 && this.polBenSelect.NumIdenben.trim() === '') {
      Swal.fire('Error', 'Debe ingresar el No. de documento para el Beneficiario.', 'error');
      return;
    }

    if ((tipoDocBen === 1 || tipoDocBen === 9) && (this.polBenSelect.NumIdenben.trim().length !== Number(this.maxLengthNumDocBen))) {
      Swal.fire('Error', 'Debe ingresar la longitud exacta del tipo de documento seleccionado para el Beneficiario.', 'error');
      return;
    }

    let list = this.validaCorreoBeneficiario();
    if (!list[0].validate) {
      Swal.fire('Error', list[0].mensajeTot, 'error');
      return;
    }

    list = this.validaTelefonoBeneficiario();
    if (!list[0].validate) {
      Swal.fire('Error', list[0].mensajeTot, 'error');
      return;
    }

    this.regOriginal = JSON.parse(JSON.stringify(this.polBenSelect));
    this.dataPolBen = JSON.parse(JSON.stringify(this.dataSource.data));
    Swal.fire({ title: 'AVISO', text: 'La información del beneficiario ha sido actualizada.', icon: 'success', allowOutsideClick: false });
  }
  exportar(){
    var archivo = "";

    this.prePolizasService.getExportar(this.dataConsulta.NumPoliza)
    .then( (resp: any) => {
      archivo = resp.result;

      var blob = this.prePolizasService.DescargarPDF(archivo).subscribe(res=>{
        saveAs(res,archivo);
      }, err=>{

    });
  });
  }

  async BusquedaTutDni() {
    var index = this.dataSource.data.indexOf(this.dataSource.data.find(x => x.NumeroDocumentoTut == this.polBenSelect.NumeroDocumentoTut &&  x.NumOrden != this.polBenSelect.NumOrden));
    //console.log(this.dataSource.data);
    //console.log(index);
    
    if(index < 0)
    {
    this.prePolizasService.postConsultaTutDni(this.polBenSelect.NumeroDocumentoTut)
      .then((resp: any) => {
        //llenado datos del tutor
        if (resp != null) {
          const tipoDocTutor = Number(resp.TipoDocumentoTut);
          //Antecedentes Personales del Tutor/Apoderado
          this.polBenSelect.TipoDocumentoTut = resp.TipoDocumentoTut;
          this.polBenSelect.NumeroDocumentoTut = resp.NumeroDocumentoTut;
          this.polBenSelect.PrimerNombreTut = resp.PrimerNombreTut;
          this.polBenSelect.SegundoNombreTut = resp.SegundoNombreTut;
          this.polBenSelect.ApellidoPaternoTut = resp.ApellidoPaternoTut;
          this.polBenSelect.ApellidoMaternoTut = resp.ApellidoMaternoTut;
          this.polBenSelect.GlsDireccionTut = resp.GlsDireccionTut;
          this.polBenSelect.GlsFono1Tut = resp.GlsFono1Tut;
          this.polBenSelect.GlsCorreo1Tut = resp.GlsCorreo1Tut;
          this.polBenSelect.CodDireccionTut = resp.CodDireccionTut;
         // this.polBenSelect.CodViaPagoTut = resp.CodViaPagoTut;
          //this.polBenSelect.CodTipoCuentaTut = resp.CodTipoCuentaTut;
          //this.polBenSelect.CodBancoTut = resp.CodBancoTut;
          //this.polBenSelect.CodSucursalTut = resp.CodSucursalTut;
          this.polBenSelect.NumCuentaTut = resp.NumCuentaTut;
          this.polBenSelect.GlsFono2Tut = resp.GlsFono2Tut;
          this.polBenSelect.GlsFono3Tut = resp.GlsFono3Tut;
          this.polBenSelect.GlsCorreo2Tut = resp.GlsCorreo2Tut;
          this.polBenSelect.NumCuentaCCITut = resp.NumCuentaCCITut;
          

          // Para números de documento del tutor
          if (tipoDocTutor === 1) {
            this.maxLengthNumDocTutor = '8';
          }
          if (tipoDocTutor === 2 || tipoDocTutor === 5) {
            this.maxLengthNumDocTutor = '12';
          }
          if (tipoDocTutor === 9) {
            this.maxLengthNumDocTutor = '11';
          }
          if (tipoDocTutor === 3 || tipoDocTutor === 4 || (tipoDocTutor > 5 && tipoDocTutor < 9) || tipoDocTutor === 10 || tipoDocTutor === 0) {
            this.maxLengthNumDocTutor = '15';
          }


          this.polBenSelect.CodViaPagoTut = resp.CodViaPagoTut === '' ? '00' : resp.CodViaPagoTut;
          this.polBenSelect.CodSucursalTut = resp.CodSucursalTut === '' ? '000' : resp.CodSucursalTut;
          this.polBenSelect.CodBancoTut = resp.CodBancoTut === '' ? '00' : resp.CodBancoTut;
          this.polBenSelect.CodTipoCuentaTut = resp.CodTipoCuentaTut === '' ? '00' : resp.CodTipoCuentaTut;
    


          this.selectViaPagoTutor('');
          console.log(this.polBenSelect.CodSucursalTut)
          if (this.polBenSelect.CodDireccionTut !== 0) {
           
            this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + this.polBenSelect.CodDireccionTut.toString()).subscribe(result => {
              this.cmbDistritoTutor = result;

              this.http.get<any[]>(this.url + '/CmbDistritoAll').subscribe(result => {
                this.cmbDistritoAllTutor = result;

                this.comboTutorResp = this.cmbDistritoAllTutor.slice();
              }, error => console.error(error));
              this.DepartamentoTutor = this.cmbDistritoTutor.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccionTut) ).CodRegion;
              this.ProvinciaTutor = this.cmbDistritoTutor.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccionTut) ).CodProvinciaDis;
              
              this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.DepartamentoTutor).subscribe(result => {
                this.cmbProvinciaTutor = result;

              }, error => console.error(error));
            }, error => console.error(error));

          
          }
        }
        
      });
    }
    else{
      const tipoDocTutor = Number(this.dataSource.data[index].TipoDocumentoTut);
          //Antecedentes Personales del Tutor/Apoderado
          this.polBenSelect.TipoDocumentoTut = this.dataSource.data[index].TipoDocumentoTut;
          this.polBenSelect.NumeroDocumentoTut = this.dataSource.data[index].NumeroDocumentoTut;
          this.polBenSelect.PrimerNombreTut = this.dataSource.data[index].PrimerNombreTut;
          this.polBenSelect.SegundoNombreTut = this.dataSource.data[index].SegundoNombreTut;
          this.polBenSelect.ApellidoPaternoTut = this.dataSource.data[index].ApellidoPaternoTut;
          this.polBenSelect.ApellidoMaternoTut = this.dataSource.data[index].ApellidoMaternoTut;
          this.polBenSelect.GlsDireccionTut = this.dataSource.data[index].GlsDireccionTut;
          this.polBenSelect.GlsFono1Tut = this.dataSource.data[index].GlsFono1Tut;
          this.polBenSelect.GlsCorreo1Tut = this.dataSource.data[index].GlsCorreo1Tut;
          this.polBenSelect.CodDireccionTut = this.dataSource.data[index].CodDireccionTut;
         // this.polBenSelect.CodViaPagoTut = resp.CodViaPagoTut;
          //this.polBenSelect.CodTipoCuentaTut = resp.CodTipoCuentaTut;
          //this.polBenSelect.CodBancoTut = resp.CodBancoTut;
          //this.polBenSelect.CodSucursalTut = resp.CodSucursalTut;
          this.polBenSelect.NumCuentaTut = this.dataSource.data[index].NumCuentaTut;
          this.polBenSelect.GlsFono2Tut = this.dataSource.data[index].GlsFono2Tut;
          this.polBenSelect.GlsFono3Tut = this.dataSource.data[index].GlsFono3Tut;
          this.polBenSelect.GlsCorreo2Tut = this.dataSource.data[index].GlsCorreo2Tut;
          this.polBenSelect.NumCuentaCCITut = this.dataSource.data[index].NumCuentaCCITut;
          

          // Para números de documento del tutor
          if (tipoDocTutor === 1) {
            this.maxLengthNumDocTutor = '8';
          }
          if (tipoDocTutor === 2 || tipoDocTutor === 5) {
            this.maxLengthNumDocTutor = '12';
          }
          if (tipoDocTutor === 9) {
            this.maxLengthNumDocTutor = '11';
          }
          if (tipoDocTutor === 3 || tipoDocTutor === 4 || (tipoDocTutor > 5 && tipoDocTutor < 9) || tipoDocTutor === 10 || tipoDocTutor === 0) {
            this.maxLengthNumDocTutor = '15';
          }


          this.polBenSelect.CodViaPagoTut = this.dataSource.data[index].CodViaPagoTut === '' ? '00' : this.dataSource.data[index].CodViaPagoTut;
          this.polBenSelect.CodSucursalTut = this.dataSource.data[index].CodSucursalTut === '' ? '000' : this.dataSource.data[index].CodSucursalTut;
          this.polBenSelect.CodBancoTut = this.dataSource.data[index].CodBancoTut === '' ? '00' : this.dataSource.data[index].CodBancoTut;
          this.polBenSelect.CodTipoCuentaTut = this.dataSource.data[index].CodTipoCuentaTut === '' ? '00' : this.dataSource.data[index].CodTipoCuentaTut;
    


          this.selectViaPagoTutor('');
          console.log(this.polBenSelect.CodSucursalTut)
          if (this.polBenSelect.CodDireccionTut !== 0) {
           
            this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + this.polBenSelect.CodDireccionTut.toString()).subscribe(result => {
              this.cmbDistritoTutor = result;

              this.http.get<any[]>(this.url + '/CmbDistritoAll').subscribe(result => {
                this.cmbDistritoAllTutor = result;

                this.comboTutorResp = this.cmbDistritoAllTutor.slice();
              }, error => console.error(error));
              this.DepartamentoTutor = this.cmbDistritoTutor.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccionTut) ).CodRegion;
              this.ProvinciaTutor = this.cmbDistritoTutor.find( dis => dis.CodDireccion === Number(this.polBenSelect.CodDireccionTut) ).CodProvinciaDis;
              
              this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.DepartamentoTutor).subscribe(result => {
                this.cmbProvinciaTutor = result;

              }, error => console.error(error));
            }, error => console.error(error));

          
          }

    }
  }

  formateafecha(fecha) {
    var long = fecha.length;
    var dia;
    var mes;
    var annio;
    let validacion;
    if ((long >= 2) && (this.primerslap == false)) {
        dia = fecha.substr(0, 2);
        validacion = this.IsNumeric(dia);
        if ((validacion == true) && (dia <= '31') && (dia != '00')) 
        { 
          fecha = fecha.substr(0, 2) + '/' + fecha.substr(3, 7); 
          this.primerslap = true; 
        }
        else 
        { 
          fecha = ""; 
          this.primerslap = false; 
        }
    }
    else {
        dia = fecha.substr(0, 1);
        validacion = this.IsNumeric(dia);
        if (validacion == false) 
        { 
          fecha = ''; 
        }
        if ((long <= 2) && (this.primerslap = true)) 
        { fecha = fecha.substr(0, 1); 
          this.primerslap = false; 
        }
    }
    if ((long >= 5) && (this.segundoslap == false)) 
    {
        mes = fecha.substr(3, 2);
        validacion = this.IsNumeric(mes);
        if ((validacion == true) && (mes <= '12') && (mes != '00')) 
        { 
          fecha = fecha.substr(0, 5) + '/' + fecha.substr(6, 4); 
          this.segundoslap = true; 
        }
        else 
        { 
          fecha = fecha.substr(0, 3);
          this.segundoslap = false; 
        }
    }
    else 
    { 
      if ((long <= 5) && (this.segundoslap = true)) 
      { 
        fecha = fecha.substr(0, 4); 
        this.segundoslap = false; 
      } 
    }
    if (long >= 7) {
        annio = fecha.substr(6, 4);
        validacion = this.IsNumeric(annio);
        if (validacion == false) 
        { 
          fecha = fecha.substr(0, 6); 
        }
        else 
        { 
          if (long == 10) 
          { 
            if ((annio == 0) || (annio < '1900') || (annio > '2100')) 
            { 
              fecha = fecha.substr(0, 6); 
            } 
          } 
        }
    }
    if (long >= 10) {
        fecha = fecha.substr(0, 10);
        dia = fecha.substr(0, 2);
        mes = fecha.substr(3, 2);
        annio = fecha.substr(6, 4);
        // Año no viciesto y es febrero y el dia es mayor a 28 
        if ((annio % 4 != 0) && (mes == '02') && (dia > '28')) 
        { 
          fecha = fecha.substr(0, 2) + '/'; 
        }
        if ((mes == '02') && (dia > '29')) 
        { 
          fecha = fecha.substr(0, 2) + '/'; 
        }
    }
    this.dataConsulta.FecIngresosppText = fecha;
    return (this.dataConsulta.FecIngresosppText);
  }

 IsNumeric(valor) {
    var log = valor.length; var sw = "S";
    let v1;
    let v2;
    for (let x = 0; x < log; x++) {
        v1 = valor.substr(x, 1);
        v2 = parseInt(v1);
        //Compruebo si es un valor numérico 
        if (isNaN(v2)) { sw = "N"; }
    }
    if (sw == "S") 
    { 
      this.banderaNumerica = true;
      return this.banderaNumerica; 
    } 
    else 
    { 
      this.banderaNumerica = false
      return this.banderaNumerica;
    }
}
}
