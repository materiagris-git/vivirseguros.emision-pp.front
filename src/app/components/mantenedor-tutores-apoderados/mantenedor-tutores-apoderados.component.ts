import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { cMantenedorTutoresApoderadosService } from 'src/providers/cMantenedorTutoresApoderados.service';
import { cMantenedorTutoresApoderados, DatosTutorInfo } from 'src/interfaces/consultaMantenedorTutoresApoderados.model';
import { MantenedorPrepolizasService } from 'src/providers/mantenedorPrePolizas.service';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-mantenedor-tutores-apoderados',
  templateUrl: './mantenedor-tutores-apoderados.component.html',
  styleUrls: ['./mantenedor-tutores-apoderados.component.css']
})
export class MantenedorTutoresApoderadosComponent implements OnInit {
  public cmbTipoIdent: any;
  public cmbDepartamento: any;
  public cmbDepartamentoTutor: any;
  public cmbProvincia: any;
  public cmbDistrito: any;
  public cmbViaPago: any;
  public cmbSucursal: any;
  public cmbTipoCuenta: any;
  public cmbTBanco: any;
  public cmbProvinciaN: any;
  public cmbDistritoN: any;
  public cmbTipoCuentaN: any;
  public cmbSucursalN: any;
  public cmbProvinciaHistorial: any;
  public cmbDistritoHistorial: any;
  public cmbSucursalHistorial: any;
  public cmbDistritoAll: any[];
  public cmbDistritoTutorAll: any[];
  public lista: any[];
  TipoNumIdent = "";
  direccionStr = "";
  dep = '';
  prov = '';
  dis = '';
  validaTipo = 0;
  maxLengthNumDocBen = '';
  validaTipoNuevo = 0;
  maxLengthNumDocBenNuevo = '';
  validaTipoHist = 0;
  maxLengthNumDocBenHist = '';
  maxLengthNumCuenta = '20';
  regexNumCuenta: RegExp; // Para el número de cuenta
  arrayNumCuenta = []; // Para el número de cuenta
  fec_valida = "";
  private urlPrePolizas = AppConsts.baseUrl + 'mantenedorprepolizas';

  consulta: cMantenedorTutoresApoderados = {
    NumPoliza: "",
    NumEndoso: "",
    CUSPP: "",
    Titular: "",
    Documento: "",
    Periodo: "",
    Num_Orden: 0
  };
  InfoTutor: DatosTutorInfo = {
    Bandera: "ACTUALIZAR",
    NumPoliza: "",
    Duracion_Meses: 0,
    fecha_Periodo_Inicio: moment().format('YYYY-MM-DD'),
    fecha_Periodo_Fin: moment().format('YYYY-MM-DD'),
    FechaEfecto: moment().format('YYYY-MM-DD'),
    FechaRecepcion: moment().format('YYYY-MM-DD'),//
    cod_tipoidentut: 0,
    NUM_IDENTUT: "",
    Nombre1: "",
    Nombre2: "",
    Apellido_Pat: "",
    Apellido_Mat: "",
    Direccion: "",
    Telefono1: "",
    Correo1: "",
    codDireccion: 0,
    Cod_ViaPago: "00",
    Cod_TipCuenta: "00",
    Cod_Banco: "00",
    Cod_Sucursal: "0000",
    Num_Cuenta: "",
    GLS_FONO2: "",
    GLS_FONO3: "",
    GLS_Correo2: "",
    GLS_Correo3: "",
    Num_Cuenta_CCI: "",
    Cod_Region: "",
    Cod_Provincia: "",
    Cod_Comuna: "",
    Num_Endoso: 0,
    Fec_Ben: moment().format('YYYY-MM-DD'),
    NombreHijo: "",
    Usuario: ""
  };
  InfoTutorNuevo: DatosTutorInfo = {
    Bandera: "NUEVOTUTOR",
    NumPoliza: this.consulta.NumPoliza,
    Duracion_Meses: this.InfoTutor.Duracion_Meses,
    fecha_Periodo_Inicio: this.InfoTutor.fecha_Periodo_Inicio,
    fecha_Periodo_Fin: this.InfoTutor.fecha_Periodo_Fin,
    FechaEfecto: this.InfoTutor.FechaEfecto,
    FechaRecepcion: this.InfoTutor.FechaRecepcion,
    cod_tipoidentut: 0,
    NUM_IDENTUT: "",
    Nombre1: "",
    Nombre2: "",
    Apellido_Pat: "",
    Apellido_Mat: "",
    Direccion: "",
    Telefono1: "",
    Correo1: "",
    codDireccion: 0,
    Cod_ViaPago: "00",
    Cod_TipCuenta: "00",
    Cod_Banco: "00",
    Cod_Sucursal: "0000",
    Num_Cuenta: "",
    GLS_FONO2: "",
    GLS_FONO3: "",
    GLS_Correo2: "",
    GLS_Correo3: "",
    Num_Cuenta_CCI: "",
    Cod_Region: "",
    Cod_Provincia: "",
    Cod_Comuna: "",
    Num_orden: "",
    Num_Endoso: this.InfoTutor.Num_Endoso,
    Usuario: ""
  };
  InfoTutorHistorial: DatosTutorInfo = {
    NumPoliza: "",
    Duracion_Meses: 0,
    fecha_Periodo_Inicio: "",
    fecha_Periodo_Fin: "",
    FechaEfecto: "",
    FechaRecepcion: "",
    cod_tipoidentut: 0,
    NUM_IDENTUT: "",
    Nombre1: "",
    Nombre2: "",
    Apellido_Pat: "",
    Apellido_Mat: "",
    Direccion: "",
    Telefono1: "",
    Correo1: "",
    codDireccion: 0,
    Cod_ViaPago: "00",
    Cod_TipCuenta: "00",
    Cod_Banco: "00",
    Cod_Sucursal: "0000",
    Num_Cuenta: "",
    GLS_FONO2: "",
    GLS_FONO3: "",
    GLS_Correo2: "",
    GLS_Correo3: "",
    Num_Cuenta_CCI: "",
    Cod_Region: "",
    Cod_Provincia: "",
    Cod_Comuna: "",
    Num_orden: "",
    Num_Endoso: this.InfoTutor.Num_Endoso
  };
  lstHistTutor: [];
  comboDistritoResp = [];
  comboDistritoTutorResp = [];
  isDisabledViaPago = true;
  isDisabledSucursal = true;
  isDisabledTipoCuenta = true;
  isDisabledBanco = true;
  isDisabledNumCuenta = true;
  isDisabledNumCuentaCci = true

  isDisabledViaPagoN = false;
  isDisabledSucursalN = true;
  isDisabledTipoCuentaN = true;
  isDisabledBancoN = true;
  isDisabledNumCuentaN = true;
  isDisabledNumCuentaCciN = true;
  isDisabledBtnGuardar = false;
  isDisabledBtnGuardarN = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  columnas = [];
  dataSourceHistorial: MatTableDataSource<any> = new MatTableDataSource(null);

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
  ngAfterViewChecked() {
    if (!localStorage.getItem('currentUser')) {
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  private url = AppConsts.baseUrl + 'mantenedorTutoresApoderados';
  isDisabled = true;
  slcTipoIdent = "";
  constructor(private cMantenedorTutoresApoderadosService: cMantenedorTutoresApoderadosService,
    public titleService: Title,
    private _serviceFecha: ServiciofechaService,
    private http: HttpClient, private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceLog: LoginService, private cdRef: ChangeDetectorRef,
    private mantenedorPrepolizasService: MantenedorPrepolizasService
  ) {
    this.columnas = ['item', 'Periodo', 'Fecha_Pago', 'TipoIdent_Tutor', 'num_idenreceptor', 'NombreTutor', 'acciones'];
  }
  ngOnInit() {
    Globales.titlePag = 'Mantenedor de Tutores/Apoderados';
    this.titleService.setTitle(Globales.titlePag);
    this.consulta.NumPoliza = Globales.datosTutorApoderado.NumPoliza;
    this.consulta.Num_Orden = Globales.datosTutorApoderado.NumOrden;
    this.consulta.Parentesco = Globales.datosTutorApoderado.Parentesco;
    //this.consulta.NumPoliza = this.activatedRoute.snapshot.paramMap.get('id').toString();
    //combos Fijos
    //Tipo Documento
    this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_COMBOTIPOIDEN", "").then((resp: any) => {
      this.cmbTipoIdent = resp;
    });
    //
    this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_COMBOGENERAL", "VPG").then((resp: any) => {
      this.cmbViaPago = resp;
    });
    this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_COMBOGENERAL", "TCT").then((resp: any) => {
      this.cmbTipoCuenta = resp;
    });
    this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_COMBOGENERAL", "BCO").then((resp: any) => {
      this.cmbTBanco = resp;
    });
    this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "S").then((resp: any) => {
      this.cmbSucursalN = resp;
    });
    this.cMantenedorTutoresApoderadosService.postConsultaInfo(this.consulta)
      .then((resp: any) => {
        this.consulta.NumPoliza = resp.NumPoliza;
        this.consulta.NumEndoso = resp.NumEndoso;
        this.consulta.CUSPP = resp.CUSPP;
        this.consulta.Fecha = resp.Fecha;
        this.consulta.Titular = resp.Titular;
        this.consulta.Documento = resp.Documento;

        this.InfoTutor.NumPoliza = this.consulta.NumPoliza;
        //this.InfoTutor.Num_orden = resp.Num_Orden;
        this.InfoTutor.Num_Endoso = Number(resp.NumEndoso);
        if (this.consulta.Parentesco.toUpperCase() === "HIJO") {
          this.InfoTutor.Num_orden = resp.Num_Orden_hijo;
          this.InfoTutorNuevo.Num_orden = resp.Num_Orden_hijo;
        } else {
          this.InfoTutor.Num_orden = resp.NumEndoso;
          this.InfoTutorNuevo.Num_orden = resp.NumEndoso;
        }
        this.InfoTutorNuevo.NumPoliza = this.consulta.NumPoliza;
        //this.InfoTutorNuevo.Num_orden = resp.Num_Orden;
        this.InfoTutorNuevo.Num_Endoso = Number(resp.NumEndoso);

        this.TipoNumIdent = resp.TipoNumIdent;

        if (resp.Estatus == null) {
          this.volver();
          return;
        }
        //llenado datos del tutor
        if (resp.lstInfoTutor != null) {
          //Vigencia del Poder
          this.InfoTutor.Duracion_Meses = resp.lstInfoTutor.Duracion_Meses;
          this.InfoTutor.fecha_Periodo_Inicio = this._serviceFecha.formatGuion(new Date(moment(resp.lstInfoTutor.fecha_Periodo_Inicio).format('LLLL')));
          this.InfoTutor.fecha_Periodo_Fin = this._serviceFecha.formatGuion(new Date(moment(resp.lstInfoTutor.fecha_Periodo_Fin).format('LLLL')));
          this.InfoTutor.FechaEfecto = this._serviceFecha.formatGuion(new Date(moment(resp.lstInfoTutor.FechaEfecto).format('LLLL')));
          this.InfoTutor.FechaRecepcion = this._serviceFecha.formatGuion(new Date(moment(resp.lstInfoTutor.FechaRecepcion).format('LLLL')));
          //Antecedentes Personales del Tutor/Apoderado
          this.InfoTutor.cod_tipoidentut = resp.lstInfoTutor.cod_tipoidentut;
          this.InfoTutor.NUM_IDENTUT = resp.lstInfoTutor.NUM_IDENTUT;
          this.InfoTutor.Nombre1 = resp.lstInfoTutor.Nombre1;
          this.InfoTutor.Nombre2 = resp.lstInfoTutor.Nombre2;
          this.InfoTutor.Apellido_Pat = resp.lstInfoTutor.Apellido_Pat;
          this.InfoTutor.Apellido_Mat = resp.lstInfoTutor.Apellido_Mat;
          this.InfoTutor.Direccion = resp.lstInfoTutor.Direccion;
          this.InfoTutor.Telefono1 = resp.lstInfoTutor.Telefono1;
          this.InfoTutor.Correo1 = resp.lstInfoTutor.Correo1;
          this.InfoTutor.codDireccion = resp.lstInfoTutor.codDireccion;
          this.InfoTutor.Cod_ViaPago = resp.lstInfoTutor.Cod_ViaPago;
          this.InfoTutor.Cod_TipCuenta = resp.lstInfoTutor.Cod_TipCuenta;
          this.InfoTutor.Cod_Banco = resp.lstInfoTutor.Cod_Banco;
          this.InfoTutor.Cod_Sucursal = resp.lstInfoTutor.Cod_Sucursal;
          this.InfoTutor.Fec_Ben = resp.lstInfoTutor.Fec_Ben;
         
          var promise = new Promise((res,rej)=>{
            this.validacionCmbViaPago('');
            res();
          }).then(
            ()=>{
              this.cambiarBanco('');
          })


          this.InfoTutor.Num_Cuenta = resp.lstInfoTutor.Num_Cuenta;
          this.InfoTutor.GLS_FONO2 = resp.lstInfoTutor.GLS_FONO2;
          this.InfoTutor.GLS_FONO3 = resp.lstInfoTutor.GLS_FONO3;
          this.InfoTutor.GLS_Correo2 = resp.lstInfoTutor.GLS_Correo2;
          this.InfoTutor.GLS_Correo3 = resp.lstInfoTutor.GLS_Correo3;
          this.InfoTutor.Num_Cuenta_CCI = resp.lstInfoTutor.Num_Cuenta_CCI;
          this.InfoTutor.Cod_Region = resp.lstInfoTutor.Cod_Region;
          this.InfoTutor.Cod_Provincia = resp.lstInfoTutor.Cod_Provincia;
          this.InfoTutor.Cod_Comuna = resp.lstInfoTutor.Cod_Comuna

          this.InfoTutor.NombreHijo = resp.lstInfoTutor.NombreHijo;
          //this.InfoTutor.Num_orden = resp.Num_Orden;
          this.InfoTutor.Num_Endoso = resp.NumEndoso;

        } else {
          this.InfoTutor.cod_tipoidentut = 0;
          this.InfoTutor.NombreHijo = resp.NombreHijo;
          Swal.fire({ title: 'AVISO', text: "El Benificiario ingresado no tiene ningún tutor asociado.", icon: 'success', allowOutsideClick: false });
        }
        if (resp.Estatus != "99") {
          this.isDisabledBtnGuardar = true;
          this.isDisabledBtnGuardarN = true;
          Swal.fire({ title: 'AVISO', text: "Sólo puede Consultar los datos que se encuentran en pantalla.", icon: 'success', allowOutsideClick: false });
        }
        //llendao del historial
        if (resp.lstHistTutor != null) {
          this.lstHistTutor = resp.lstHistTutor;
        }
        this.dataSourceHistorial = new MatTableDataSource(this.lstHistTutor);
        this.dataSourceHistorial.paginator = this.paginator;
        //llenado de combos
        //departamento
        this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_REGION", "").then((resp: any) => {
          this.cmbDepartamento = resp;
          this.cmbDepartamentoTutor = resp;

          //provincia
          this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_PROVINCIA", this.InfoTutor.Cod_Region).then((resp: any) => {
            this.cmbProvincia = resp;
            //distrito
            this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_DISTRITO", this.InfoTutor.Cod_Provincia).then((resp: any) => {
              this.cmbDistrito = resp;

              // Carga todos los distritos
              this.mantenedorPrepolizasService.getComboDistritoAll().then((resp: any) => {
                this.cmbDistritoAll = resp;
                this.comboDistritoResp = this.cmbDistritoAll.slice();

                this.cmbDistritoTutorAll = resp;
                this.comboDistritoTutorResp = this.cmbDistritoTutorAll.slice();
                this.InfoTutorNuevo.codDireccion = 0;
                if (this.InfoTutor.codDireccion !== 0) {
                  this.ubigeoExp();
                } else {
                  this.InfoTutor.codDireccion = 0;
                }
              });
            });
          });
        });

        //Sucursal
        if (this.InfoTutor.Cod_ViaPago == "04") {
          this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
            this.cmbSucursal = resp;
          });
        } else {
          this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "S").then((resp: any) => {
            this.cmbSucursal = resp;
          });
        }

      });
    //this.cambiarTipoCuenta('');

  }
  onChangeLlenaProvincia() {
    this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_PROVINCIA", this.InfoTutor.Cod_Region).then((resp: any) => {
      this.cmbProvincia = resp;
      this.InfoTutor.Cod_Provincia = '';
    });
    this.cmbDistrito = [];
  }
  onChangeLlenaDistrito() {
    // this.InfoTutor.Cod_Comuna= '';
    this.mantenedorPrepolizasService.getComboDistrito(this.InfoTutor.Cod_Provincia).then((resp: any) => {
      this.cmbDistrito = resp;
      this.InfoTutor.codDireccion = this.cmbDistrito[0].CodDireccion;
      this.ubigeoExp();
    });
  }
  onChangeLlenaSucursal() {
    if (this.InfoTutor.Cod_ViaPago == "04") {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
      });
    } else {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "S").then((resp: any) => {
        this.cmbSucursal = resp;
      });
    }
    this.validacionCmbViaPago('elegir');

  }
  onChangeLlenaProvinciaNuevoTutor() {
    this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_PROVINCIA", this.InfoTutorNuevo.Cod_Region).then((resp: any) => {
      this.cmbProvinciaN = resp;
      this.InfoTutorNuevo.Cod_Provincia = "";
    });
    // this.cmbDistritoN=[];
    this.InfoTutorNuevo.Cod_Comuna = '0';
  }
  onChangeLlenaDistritoNuevoTutor() {
    //  this.InfoTutorNuevo.Cod_Comuna = '0';
    this.mantenedorPrepolizasService.getComboDistrito(this.InfoTutorNuevo.Cod_Provincia).then((resp: any) => {
      this.cmbDistritoN = resp;
      this.InfoTutorNuevo.codDireccion = this.cmbDistritoN[0].CodDireccion;
    });
    // this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_DISTRITO",this.InfoTutorNuevo.Cod_Provincia).then( (resp: any) => {
    //   this.cmbDistritoN = resp;
    //   this.InfoTutorNuevo.Cod_Comuna="";
    // });
  }
  onChangeLlenaSucursalNuevoTutor() {
    if (this.InfoTutorNuevo.Cod_ViaPago == "04") {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursalN = resp;
      });
    } else {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "S").then((resp: any) => {
        this.cmbSucursalN = resp;
      });
    }

    this.validacionCmbViaPagoN('elegir');
  }

  //Validacion para numeros enteros
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
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

    if ((letras.indexOf(tecla) === -1) && (!tecla_especial)) {
      return false;
    }
  }

  validaTelefonoTutor() {
    let mensaje = '';
    let valido = true;
    if (this.InfoTutor.GLS_FONO3 !== '') {
      if (this.InfoTutor.GLS_FONO3.length < 7) {
        mensaje = 'El teléfono 3 debe tener mínimo 7 caracteres.';
        valido = false;
      }
      if (this.InfoTutor.GLS_FONO3.length > 9) {
        mensaje = 'El teléfono 3 debe tener máximo 9 caracteres.';
        valido = false;
      }
    }
    if (this.InfoTutor.GLS_FONO2 !== '') {
      if (this.InfoTutor.GLS_FONO2.length < 7) {
        mensaje = 'El teléfono 2 debe tener mínimo 7 caracteres.';
        valido = false;
      }
      if (this.InfoTutor.GLS_FONO2.length > 9) {
        mensaje = 'El teléfono 2 debe tener máximo 9 caracteres.';
        valido = false;
      }
    }

    if (this.InfoTutor.Telefono1 !== '') {
      if (this.InfoTutor.Telefono1.length < 7) {
        mensaje = 'El teléfono debe tener mínimo 7 caracteres.';
        valido = false;
      }
      if (this.InfoTutor.Telefono1.length > 9) {
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

  validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  GuardarInfoTutor() {
    this.onValidaFechaEfecto();
    let fecha_Periodo_Inicio = new Date(this.InfoTutor.fecha_Periodo_Inicio);
    const fechaPeriodoFinal  = new Date(this.InfoTutor.fecha_Periodo_Fin);
    let FechaRecepcion = new Date(this.InfoTutor.FechaRecepcion);
    let fechaActual = new Date();

    if (this.InfoTutor.fecha_Periodo_Inicio == '') {
      Swal.fire({ title: 'ERROR', text: 'Debe ingresar una Fecha inicio del Periodo', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (fecha_Periodo_Inicio < new Date('1900-01-01')) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha inicio del Periodo de Vigencia ingresada es Inferior a la Fecha Mínima de Ingreso (1900).', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (fecha_Periodo_Inicio > fechaActual) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha inicio del Periodo de Vigencia ingresada es mayor a la fecha actual', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (fecha_Periodo_Inicio >= fechaPeriodoFinal) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha de Inicio del Periodo de Vigencia debe ser menor a la Fecha Final de Vigencia.', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (this.InfoTutor.FechaRecepcion == '') {
      Swal.fire({ title: 'ERROR', text: 'Debe Ingresar Fecha Recepción', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (FechaRecepcion > fechaActual) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha Recepción Ingresada es Mayor a la Fecha Actual', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (FechaRecepcion < new Date('1900-01-01')) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha Recepción Ingresada es Inferior a la Fecha Mínima de Ingreso (1900).', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (!this.validar_email(this.InfoTutor.Correo1.trim()) && this.InfoTutor.Correo1.trim() != "") {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 1', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (!this.validar_email(this.InfoTutor.GLS_Correo2.trim()) && this.InfoTutor.GLS_Correo2.trim() != "") {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 2', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (!this.validar_email(this.InfoTutor.GLS_Correo3.trim()) && this.InfoTutor.GLS_Correo3.trim() != "") {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 2', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (this.InfoTutor.Cod_Region != "") {

      if (this.InfoTutor.Cod_Provincia == "") {
        Swal.fire({ title: 'ERROR', text: 'Debe seleccionar una Provincia', icon: 'error', allowOutsideClick: false });
        return;
      }
      if (this.InfoTutor.codDireccion == 0) {
        Swal.fire({ title: 'ERROR', text: 'Debe seleccionar un Distrito', icon: 'error', allowOutsideClick: false });
        return;
      }
    }
    this.cMantenedorTutoresApoderadosService.getValidaVigenciaPoliza(this.consulta.NumPoliza, this.consulta.NumEndoso, moment(this.InfoTutor.fecha_Periodo_Inicio).format('YYYYMMDD')).then((resp: any) => {
      if (resp.mensaje) {
        Swal.fire({ title: 'ERROR', text: 'La Fecha Desde Ingresada es Anterior a la Fecha de Vigencia de la Póliza', icon: 'error', allowOutsideClick: false });
        return;
      } else {
        if (this.InfoTutor.NUM_IDENTUT.trim() == "") {
          Swal.fire({ title: 'ERROR', text: 'Debe ingresar el Número de Identificación del Tutor.', icon: 'error', allowOutsideClick: false });
          return;
        }
        if (this.InfoTutor.NUM_IDENTUT.length < 8) {
          Swal.fire({ title: 'ERROR', text: 'El Número de Identificación del Tutor no es válido.', icon: 'error', allowOutsideClick: false });
          return;
        }
        if (this.InfoTutor.Nombre1.trim() == "") {
          Swal.fire({ title: 'ERROR', text: 'Debe Ingresar Nombre', icon: 'error', allowOutsideClick: false });
          return;
        }
        if (this.InfoTutor.Apellido_Pat.trim() == "") {
          Swal.fire({ title: 'ERROR', text: 'Debe Ingresar Apellido Paterno.', icon: 'error', allowOutsideClick: false });
          return;
        }
        if (this.InfoTutor.Direccion.trim() == "") {
          Swal.fire({ title: 'ERROR', text: 'Debe Ingresar Dirección.', icon: 'error', allowOutsideClick: false });
          return;
        }
        let list = this.validaTelefonoTutor();
        if (!list[0].validate) {
          Swal.fire('Error', list[0].mensajeTot, 'error');
          return;
        }
        //'Validar Ingreso de Datos para Pago, según Via de Pago Seleccionada
        //'Validar Ingreso de Datos para Pago, según Via de Pago Seleccionada
        let Cod_ViaPago = this.InfoTutor.Cod_ViaPago;
        let Cod_Sucursal = this.InfoTutor.Cod_Sucursal;
        let Cod_TipCuenta = this.InfoTutor.Cod_TipCuenta;
        let Cod_Banco = this.InfoTutor.Cod_Banco;
        let Num_Cuenta = this.InfoTutor.Num_Cuenta
        let Num_Cuenta_CCI = this.InfoTutor.Num_Cuenta_CCI

        if (Cod_ViaPago == "00") {
          Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar Forma de Pago.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if ((Cod_ViaPago == "01" || Cod_ViaPago == "04") && (Cod_Sucursal == "000")) {
          Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar la Sucursal de la Vía de Pago.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if ((Cod_ViaPago === "02" || Cod_ViaPago === "03" || Cod_ViaPago === "05") && (Cod_Banco === "00")) {
          Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Banco.', icon: 'warning', allowOutsideClick: false });
          return;
        }

        if (Cod_ViaPago == "02") {
          if (Cod_TipCuenta == "00") {
            Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Tipo de Cuenta.', icon: 'warning', allowOutsideClick: false });
            return;
          }
          if (!this.validaNumCuenta(Num_Cuenta) || Num_Cuenta.length !== Number(this.maxLengthNumCuenta)) {
            Swal.fire('Advertencia', 'Número de cuenta inválido.', 'warning');
            return;
          }
          if (Num_Cuenta == "" || Num_Cuenta_CCI == "") {
            Swal.fire({ title: 'Advertencia', text: 'Debe ingresar los Números de Cuenta.', icon: 'warning', allowOutsideClick: false });
            return;
          }
        }
        this.InfoTutor.Usuario = localStorage.getItem('currentUser');
        this.cMantenedorTutoresApoderadosService.ActualizarTutorApoderado(this.InfoTutor).then((resp: any) => {
          if (resp.Mensaje == "update") {
            Swal.fire({ title: 'AVISO', text: "Registro actualizado correctamente", icon: 'success', allowOutsideClick: false });
            return;
          }
          if (resp.Mensaje == "new") {
            Swal.fire({ title: 'AVISO', text: "Los Datos se han ingresado satisfactoriamente.", icon: 'success', allowOutsideClick: false });
            this.ngOnInit();
            return;
          } else {
            Swal.fire({ title: 'ERROR', text: resp.Mensaje, icon: 'error', allowOutsideClick: false });
            return;
          }
        });
      }
    });



  }
  onValidaFechaEfecto() {

    if (this.InfoTutor.Duracion_Meses > 1200) {
      Swal.fire({ title: 'ERROR', text: 'El Número de Meses Ingresado Excede el Máximo Permitido de 1200.', icon: 'error', allowOutsideClick: false });
    } else {
      this.fec_valida = moment(this.InfoTutor.fecha_Periodo_Inicio).add(this.InfoTutor.Duracion_Meses, 'months').add(+1, 'day').format('YYYY-MM-DD');
      //this.InfoTutor.fecha_Periodo_Fin = moment(this.InfoTutor.fecha_Periodo_Inicio).add(this.InfoTutor.Duracion_Meses, 'months').add(+1, 'day').format('YYYY-MM-DD');
      
      this.InfoTutor.fecha_Periodo_Fin = moment(this.InfoTutor.Fec_Ben).add(216, 'months').add(-1, 'day').format('YYYY-MM-DD');
      if(this.fec_valida > this.InfoTutor.fecha_Periodo_Fin)
      {
        //console.log("La fecha calculada es mayor a la fecha de mayoria de edad")
        this.InfoTutor.fecha_Periodo_Fin = this.InfoTutor.fecha_Periodo_Fin;
      }
      else{
        //console.log("La fecha calculada es menor a la fecha de mayoria de edad")
        this.InfoTutor.fecha_Periodo_Fin = this.fec_valida;
      }
      //console.log(this.InfoTutor.fecha_Periodo_Fin)
      this.cMantenedorTutoresApoderadosService.ValidaFechaEfecto(this.InfoTutor).then((resp: any) => {
        this.InfoTutor.FechaEfecto = this._serviceFecha.formatGuion(new Date(moment(resp.FechaEfecto).format('LLLL')));
        //asignacion de valores para el tutor nuevo
        this.InfoTutorNuevo.Duracion_Meses = this.InfoTutor.Duracion_Meses;
        this.InfoTutorNuevo.fecha_Periodo_Inicio = this.InfoTutor.fecha_Periodo_Inicio;
        this.InfoTutorNuevo.fecha_Periodo_Fin = this.InfoTutor.fecha_Periodo_Fin;
        this.InfoTutorNuevo.FechaEfecto = this.InfoTutor.FechaEfecto;
        this.InfoTutorNuevo.FechaRecepcion = this.InfoTutor.FechaRecepcion;
      });


    }

  }

  async validacionCmbViaPago(bandera: string) {
    let CodViaPago = this.InfoTutor.Cod_ViaPago;

    if (CodViaPago == "00") {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledViaPago = false;
        this.isDisabledSucursal = true;
        this.isDisabledTipoCuenta = true;
        this.isDisabledBanco = true;
        this.isDisabledNumCuenta = true;
        this.isDisabledNumCuentaCci = true;
        this.InfoTutor.Cod_Sucursal = "000";
        this.InfoTutor.Cod_TipCuenta = "00";
        this.InfoTutor.Cod_Banco = "00";
        this.InfoTutor.Num_Cuenta = "";
        this.InfoTutor.Num_Cuenta_CCI = "";
      });
    } else if (CodViaPago == "02") {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledViaPago = false;
        this.isDisabledSucursal = true;
        this.isDisabledTipoCuenta = false;
        this.isDisabledBanco = false;
        this.isDisabledNumCuenta = false;
        this.isDisabledNumCuentaCci = false;
        this.InfoTutor.Cod_Sucursal = "000";
        this.InfoTutor.Cod_TipCuenta = bandera === 'elegir' ? '00' : this.InfoTutor.Cod_TipCuenta;
        this.InfoTutor.Cod_Banco = bandera === 'elegir' ? '00' : this.InfoTutor.Cod_Banco;
        this.InfoTutor.Num_Cuenta = bandera === 'elegir' ? '' : this.InfoTutor.Num_Cuenta;
        this.InfoTutor.Num_Cuenta_CCI = bandera === 'elegir' ? '' : this.InfoTutor.Num_Cuenta_CCI;
      });
    } else if (CodViaPago == "04") {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledViaPago = false;
        this.isDisabledSucursal = false;
        this.isDisabledTipoCuenta = true;
        this.isDisabledBanco = true;
        this.isDisabledNumCuenta = true;
        this.isDisabledNumCuentaCci = true;
        this.InfoTutor.Cod_Sucursal = bandera === 'elegir' ? '000' : this.InfoTutor.Cod_Sucursal;
        this.InfoTutor.Cod_TipCuenta = "00";
        this.InfoTutor.Cod_Banco = "00";
        this.InfoTutor.Num_Cuenta = "";
        this.InfoTutor.Num_Cuenta_CCI = "";
      });
    } else if (CodViaPago == "05") {
      this.isDisabledViaPago = false;
      this.isDisabledSucursal = true;
      this.isDisabledTipoCuenta = true;
      this.isDisabledBanco = false;
      this.isDisabledNumCuenta = true;
      this.isDisabledNumCuentaCci = true;
      this.InfoTutor.Cod_Sucursal = "000";
      this.InfoTutor.Cod_TipCuenta = "00";
      this.InfoTutor.Cod_Banco = bandera === 'elegir' ? '00' : this.InfoTutor.Cod_Banco;
      this.InfoTutor.Num_Cuenta = "";
      this.InfoTutor.Num_Cuenta_CCI = "";
    }
  }

  validacionCmbViaPagoN(bandera: string) {
    let CodViaPago = this.InfoTutorNuevo.Cod_ViaPago;

    if (CodViaPago == "00") {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursalN = resp;
        this.isDisabledViaPagoN = false;
        this.isDisabledSucursalN = true;
        this.isDisabledTipoCuentaN = true;
        this.isDisabledBancoN = true;
        this.isDisabledNumCuentaN = true;
        this.isDisabledNumCuentaCciN = true;
        this.InfoTutorNuevo.Cod_Sucursal = "000";
        this.InfoTutorNuevo.Cod_TipCuenta = "00";
        this.InfoTutorNuevo.Cod_Banco = "00";
        this.InfoTutorNuevo.Num_Cuenta = "";
        this.InfoTutorNuevo.Num_Cuenta_CCI = "";
      });
    } else if (CodViaPago == "02") {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursalN = resp;
        this.isDisabledViaPagoN = false;
        this.isDisabledSucursalN = true;
        this.isDisabledTipoCuentaN = false;
        this.isDisabledBancoN = false;
        this.isDisabledNumCuentaN = false;
        this.isDisabledNumCuentaCciN = false;
        this.InfoTutorNuevo.Cod_Sucursal = "000";
        this.InfoTutorNuevo.Cod_TipCuenta = bandera === 'elegir' ? '00' : this.InfoTutorNuevo.Cod_TipCuenta;
        this.InfoTutorNuevo.Cod_Banco = bandera === 'elegir' ? '00' : this.InfoTutorNuevo.Cod_Banco;
        this.InfoTutorNuevo.Num_Cuenta = bandera === 'elegir' ? '' : this.InfoTutorNuevo.Num_Cuenta;
        this.InfoTutorNuevo.Num_Cuenta_CCI = bandera === 'elegir' ? '' : this.InfoTutorNuevo.Num_Cuenta_CCI;
      });
    } else if (CodViaPago == "04") {
      this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursalN = resp;
        this.isDisabledViaPagoN = false;
        this.isDisabledSucursalN = false;
        this.isDisabledTipoCuentaN = true;
        this.isDisabledBancoN = true;
        this.isDisabledNumCuentaN = true;
        this.isDisabledNumCuentaCciN = true;
        this.InfoTutorNuevo.Cod_Sucursal = bandera === 'elegir' ? '000' : this.InfoTutorNuevo.Cod_Sucursal;
        this.InfoTutorNuevo.Cod_TipCuenta = "00";
        this.InfoTutorNuevo.Cod_Banco = "00";
        this.InfoTutorNuevo.Num_Cuenta = "";
        this.InfoTutorNuevo.Num_Cuenta_CCI = "";
      });
    } else if (CodViaPago == "05") {
      this.isDisabledViaPagoN = false;
      this.isDisabledSucursalN = true;
      this.isDisabledTipoCuentaN = true;
      this.isDisabledBancoN = false;
      this.isDisabledNumCuentaN = true;
      this.isDisabledNumCuentaCciN = true;
      this.InfoTutorNuevo.Cod_Sucursal = "000";
      this.InfoTutorNuevo.Cod_TipCuenta = "00";
      this.InfoTutorNuevo.Cod_Banco = bandera === 'elegir' ? '00' : this.InfoTutorNuevo.Cod_Banco;
      this.InfoTutorNuevo.Num_Cuenta = "";
      this.InfoTutorNuevo.Num_Cuenta_CCI = "";
    }

  }

  GuardarInfoTutorN() {
    this.onValidaFechaEfecto();
    let fecha_Periodo_Inicio = new Date(this.InfoTutor.fecha_Periodo_Inicio);
    const fechaPeriodoFinal  = new Date(this.InfoTutor.fecha_Periodo_Fin);
    let FechaRecepcion = new Date(this.InfoTutor.FechaRecepcion);
    let fechaActual = new Date();

    if (this.InfoTutorNuevo.cod_tipoidentut == 0){
      Swal.fire({ title: 'ERROR', text: 'Debe seleccionar un tipo de documento.', icon: 'error', allowOutsideClick: false });
      return;
    }

    if (this.InfoTutor.fecha_Periodo_Inicio == '') {
      Swal.fire({ title: 'ERROR', text: 'Debe ingresar una Fecha inicio del Periodo', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (fecha_Periodo_Inicio < new Date('1900-01-01')) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha inicio del Periodo de Vigencia ingresada es Inferior a la Fecha Mínima de Ingreso (1900).', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (fecha_Periodo_Inicio >= fechaPeriodoFinal) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha de Inicio del Periodo de Vigencia debe ser menor a la Fecha Final de Vigencia.', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (fecha_Periodo_Inicio > fechaActual) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha inicio del Periodo de Vigencia ingresada es mayor a la fecha actual', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (this.InfoTutor.FechaRecepcion == '') {
      Swal.fire({ title: 'ERROR', text: 'Debe Ingresar Fecha Recepción', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (FechaRecepcion > fechaActual) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha Recepción Ingresada es Mayor a la Fecha Actual', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (FechaRecepcion < new Date('1900-01-01')) {
      Swal.fire({ title: 'ERROR', text: 'La Fecha Recepción Ingresada es Inferior a la Fecha Mínima de Ingreso (1900).', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (!this.validar_email(this.InfoTutorNuevo.Correo1.trim()) && this.InfoTutorNuevo.Correo1.trim() != "") {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 1', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (!this.validar_email(this.InfoTutorNuevo.GLS_Correo2.trim()) && this.InfoTutorNuevo.GLS_Correo2.trim() != "") {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 2', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (!this.validar_email(this.InfoTutorNuevo.GLS_Correo3.trim()) && this.InfoTutorNuevo.GLS_Correo3.trim() != "") {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 2', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (this.InfoTutorNuevo.Cod_Region != "") {

      if (this.InfoTutorNuevo.Cod_Provincia == "") {
        Swal.fire({ title: 'ERROR', text: 'Debe seleccionar una Provincia', icon: 'error', allowOutsideClick: false });
        return;
      }
      if (this.InfoTutorNuevo.codDireccion == 0) {
        Swal.fire({ title: 'ERROR', text: 'Debe seleccionar un Distrito', icon: 'error', allowOutsideClick: false });
        return;
      }
    }
    let mensaje = "";
    if (this.InfoTutorNuevo.GLS_FONO3 !== '') {
      if (this.InfoTutorNuevo.GLS_FONO3.length < 7) {
        mensaje = 'El teléfono 3 debe tener mínimo 7 caracteres.';
        Swal.fire({ title: 'ERROR', text: mensaje, icon: 'error', allowOutsideClick: false });
        return;
      }
      if (this.InfoTutorNuevo.GLS_FONO3.length > 9) {
        mensaje = 'El teléfono 3 debe tener máximo 9 caracteres.';
        Swal.fire({ title: 'ERROR', text: mensaje, icon: 'error', allowOutsideClick: false });
        return;
      }
    }
    if (this.InfoTutorNuevo.GLS_FONO2 !== '') {
      if (this.InfoTutorNuevo.GLS_FONO2.length < 7) {
        mensaje = 'El teléfono 2 debe tener mínimo 7 caracteres.';
        Swal.fire({ title: 'ERROR', text: mensaje, icon: 'error', allowOutsideClick: false });
        return;
      }
      if (this.InfoTutorNuevo.GLS_FONO2.length > 9) {
        mensaje = 'El teléfono 2 debe tener máximo 9 caracteres.';
        Swal.fire({ title: 'ERROR', text: mensaje, icon: 'error', allowOutsideClick: false });
        return;
      }
    }

    if (this.InfoTutorNuevo.Telefono1 !== '') {
      if (this.InfoTutorNuevo.Telefono1.length < 7) {
        mensaje = 'El teléfono debe tener mínimo 7 caracteres.';
        Swal.fire({ title: 'ERROR', text: mensaje, icon: 'error', allowOutsideClick: false });
        return;
      }
      if (this.InfoTutorNuevo.Telefono1.length > 9) {
        mensaje = 'El teléfono debe tener máximo 9 caracteres.';
        Swal.fire({ title: 'ERROR', text: mensaje, icon: 'error', allowOutsideClick: false });
        return;
      }
    }

    this.cMantenedorTutoresApoderadosService.getValidaVigenciaPoliza(this.consulta.NumPoliza, this.consulta.NumEndoso, moment(this.InfoTutor.fecha_Periodo_Inicio).format('YYYYMMDD')).then((resp: any) => {
      if (resp.mensaje) {
        Swal.fire({ title: 'ERROR', text: 'La Fecha Desde Ingresada es Anterior a la Fecha de Vigencia de la Póliza', icon: 'error', allowOutsideClick: false });
        return;
      } else {
        if (this.InfoTutorNuevo.NUM_IDENTUT.trim() == "") {
          Swal.fire({ title: 'ERROR', text: 'Debe ingresar el Número de Identificación del Tutor.', icon: 'error', allowOutsideClick: false });
          return;
        }
        if (this.InfoTutorNuevo.NUM_IDENTUT.length < 8) {
          Swal.fire({ title: 'ERROR', text: 'El Número de Identificación del Tutor no es válido.', icon: 'error', allowOutsideClick: false });
          return;
        }
        if (this.InfoTutorNuevo.Nombre1.trim() == "") {
          Swal.fire({ title: 'ERROR', text: 'Debe Ingresar Nombre', icon: 'error', allowOutsideClick: false });
          return;
        }
        if (this.InfoTutorNuevo.Apellido_Pat.trim() == "") {
          Swal.fire({ title: 'ERROR', text: 'Debe Ingresar Apellido Paterno.', icon: 'error', allowOutsideClick: false });
          return;
        }
        if (this.InfoTutorNuevo.Direccion.trim() == "") {
          Swal.fire({ title: 'ERROR', text: 'Debe Ingresar Dirección.', icon: 'error', allowOutsideClick: false });
          return;
        }

        //'Validar Ingreso de Datos para Pago, según Via de Pago Seleccionada
        let Cod_ViaPago = this.InfoTutorNuevo.Cod_ViaPago;
        let Cod_Sucursal = this.InfoTutorNuevo.Cod_Sucursal;
        let Cod_TipCuenta = this.InfoTutorNuevo.Cod_TipCuenta;
        let Cod_Banco = this.InfoTutorNuevo.Cod_Banco;
        let Num_Cuenta = this.InfoTutorNuevo.Num_Cuenta
        let Num_Cuenta_CCI = this.InfoTutorNuevo.Num_Cuenta_CCI

        if (Cod_ViaPago == "00") {
          Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar Forma de Pago.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if ((Cod_ViaPago == "01" || Cod_ViaPago == "04") && (Cod_Sucursal == "000")) {
          Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar la Sucursal de la Vía de Pago.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if ((Cod_ViaPago === "02" || Cod_ViaPago === "03" || Cod_ViaPago === "05") && (Cod_Banco === "00")) {
          Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Banco.', icon: 'warning', allowOutsideClick: false });
          return;
        }

        if (Cod_ViaPago == "02") {
          if (Cod_TipCuenta == "00") {
            Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Tipo de Cuenta.', icon: 'warning', allowOutsideClick: false });
            return;
          }
          if (!this.validaNumCuenta(Num_Cuenta) || Num_Cuenta.length !== Number(this.maxLengthNumCuenta)) {
            Swal.fire('Advertencia', 'Número de cuenta inválido.', 'warning');
            return;
          }
          if (Num_Cuenta == "" || Num_Cuenta_CCI == "") {
            Swal.fire({ title: 'Advertencia', text: 'Debe ingresar los Números de Cuenta.', icon: 'warning', allowOutsideClick: false });
            return;
          }
        }

        (<any>$('#modalAgregarTutor')).modal('hide');
        this.InfoTutorNuevo.Usuario = localStorage.getItem('currentUser');
        this.cMantenedorTutoresApoderadosService.AgregarTutorApoderado(this.InfoTutorNuevo).then((resp: any) => {
          if (resp.Mensaje == "tutor") {
            this.ngOnInit();
            Swal.fire({ title: 'ERROR', text: resp.Mensaje, icon: 'error', allowOutsideClick: false });
            return;
          } else {
            Swal.fire({ title: 'AVISO', text: "Los Datos se han ingresado satisfactoriamente.", icon: 'success', allowOutsideClick: false });
            this.ngOnInit();
            return;
          }
        });
      }
    });
  }
  BusquedaHistorial(periodo) {
    this.consulta.Periodo = periodo;
    this.consulta.Num_Orden = Number(this.InfoTutor.Num_orden);
    this.cMantenedorTutoresApoderadosService.postHistorialTutor(this.consulta)
      .then((resp: any) => {
        //llenado datos del tutor
        if (resp != null) {
          //Vigencia del Poder
          this.InfoTutorHistorial.Duracion_Meses = resp.Duracion_Meses;
          this.InfoTutorHistorial.fecha_Periodo_Inicio = this._serviceFecha.formatGuion(new Date(moment(resp.fecha_Periodo_Inicio).format('LLLL')));
          this.InfoTutorHistorial.fecha_Periodo_Fin = this._serviceFecha.formatGuion(new Date(moment(resp.fecha_Periodo_Fin).format('LLLL')));
          this.InfoTutorHistorial.FechaEfecto = this._serviceFecha.formatGuion(new Date(moment(resp.FechaEfecto).format('LLLL')));
          this.InfoTutorHistorial.FechaRecepcion = this._serviceFecha.formatGuion(new Date(moment(resp.FechaRecepcion).format('LLLL')));
          //Antecedentes Personales del Tutor/Apoderado
          this.InfoTutorHistorial.cod_tipoidentut = resp.cod_tipoidentut;
          this.InfoTutorHistorial.NUM_IDENTUT = resp.NUM_IDENTUT;
          this.InfoTutorHistorial.Nombre1 = resp.Nombre1;
          this.InfoTutorHistorial.Nombre2 = resp.Nombre2;
          this.InfoTutorHistorial.Apellido_Pat = resp.Apellido_Pat;
          this.InfoTutorHistorial.Apellido_Mat = resp.Apellido_Mat;
          this.InfoTutorHistorial.Direccion = resp.Direccion;
          this.InfoTutorHistorial.Telefono1 = resp.Telefono1;
          this.InfoTutorHistorial.Correo1 = resp.Correo1;
          this.InfoTutorHistorial.codDireccion = resp.codDireccion;
          this.InfoTutorHistorial.Cod_ViaPago = resp.Cod_ViaPago;
          this.InfoTutorHistorial.Cod_TipCuenta = resp.Cod_TipCuenta;
          this.InfoTutorHistorial.Cod_Banco = resp.Cod_Banco;
          this.InfoTutorHistorial.Cod_Sucursal = resp.Cod_Sucursal;
          this.InfoTutorHistorial.Num_Cuenta = resp.Num_Cuenta;
          this.InfoTutorHistorial.GLS_FONO2 = resp.GLS_FONO2;
          this.InfoTutorHistorial.GLS_FONO3 = resp.GLS_FONO3;
          this.InfoTutorHistorial.GLS_Correo2 = resp.GLS_Correo2;
          this.InfoTutorHistorial.GLS_Correo3 = resp.GLS_Correo3;
          this.InfoTutorHistorial.Num_Cuenta_CCI = resp.Num_Cuenta_CCI;
          this.InfoTutorHistorial.Cod_Region = resp.Cod_Region;
          this.InfoTutorHistorial.Cod_Provincia = resp.Cod_Provincia;
          this.InfoTutorHistorial.Cod_Comuna = resp.Cod_Comuna;

          this.InfoTutorHistorial.Num_orden = resp.Num_Orden;
          this.InfoTutorHistorial.Num_Endoso = resp.NumEndoso;
        }
        //llenado de combos
        //provincia
        this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_PROVINCIA", this.InfoTutorHistorial.Cod_Region).then((resp: any) => {
          this.cmbProvinciaHistorial = resp;
        });
        //distrito
        this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_DISTRITO", this.InfoTutorHistorial.Cod_Provincia).then((resp: any) => {
          this.cmbDistritoHistorial = resp;
        });
        //Sucursal
        if (this.InfoTutorHistorial.Cod_ViaPago == "04") {
          this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
            this.cmbSucursalHistorial = resp;
          });
        } else {
          this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "S").then((resp: any) => {
            this.cmbSucursalHistorial = resp;
          });
        }
      });
  }
  volver() {
    this.router.navigate(['/consultaMantenedorTutoresApoderados']);
  }

  ubigeoExp() {
    if (this.InfoTutor.codDireccion !== 0) {
      for (const i in this.cmbDepartamento) {
        if (this.InfoTutor.Cod_Region === this.cmbDepartamento[i].codigo) {
          this.dep = this.cmbDepartamento[i].descripcion;
        }
      }
      for (const i in this.cmbProvincia) {
        if (this.InfoTutor.Cod_Provincia === this.cmbProvincia[i].codigo) {
          this.prov = this.cmbProvincia[i].descripcion;
        }
      }
      // tslint:disable-next-line:forin
      for (const i in this.cmbDistritoAll) {
        const var1 = Number(this.InfoTutor.codDireccion);
        const var2 = Number(this.cmbDistritoAll[i].CodDireccion);
        if (var1 === var2) {
          const slip = this.cmbDistritoAll[i].GlsDistrito;
          this.dis = slip.split(' - ', 1);
        }
      }
      this.direccionStr = this.dep + '-' + this.prov + '-' + this.dis;
    }
  }

  getInfo(codDir) {
    this.InfoTutor.codDireccion = codDir;

    this.mantenedorPrepolizasService.getComboProvinciaAll(codDir).then((resp: any) => {
      const listaLlenado = [];
      for (const i in resp) {
        if (resp.length > 0) {
          const object = {
            codigo: resp[i].CodProvincia,
            descripcion: resp[i].GlsProvincia
          };
          listaLlenado.push(object);
        }
      }
      this.cmbProvincia = listaLlenado;
    });

    this.mantenedorPrepolizasService.getProvinciaUnica(codDir).then((resp: any) => {
      if(resp.length > 0){
        const var1 = resp[0].CodProvincia;
        this.InfoTutor.Cod_Provincia = var1;
        this.InfoTutor.Cod_Region = resp[0].CodRegion.toString();
        this.ubigeoExp();
      }
    });
  }

  getInfoTuto(codDir) {
    this.mantenedorPrepolizasService.getComboProvinciaAll(codDir).then((resp: any) => {
      const listaLlenado = [];
      for (const i in resp) {
        if (resp.length > 0) {
          const object = {
            codigo: resp[i].CodProvincia,
            descripcion: resp[i].GlsProvincia
          };
          listaLlenado.push(object);
        }
      }
      this.cmbProvinciaN = listaLlenado;
    });

    this.mantenedorPrepolizasService.getProvinciaUnica(codDir).then((resp: any) => {
      if(resp.length > 0){
        const var1 = resp[0].CodProvincia;
        this.InfoTutorNuevo.Cod_Provincia = var1;
        this.InfoTutorNuevo.Cod_Region = resp[0].CodRegion.toString();
      }
    });
  }

  cerrarModalTel() {

    this.validarTelefonos();
    (<any>$('#modalTelefonos')).modal('hide');
  }


  validarTelefonos() {

    if (this.InfoTutor.GLS_FONO3 !== '') {
      if (this.InfoTutor.GLS_FONO3.length < 7) {
        this.InfoTutor.GLS_FONO3 = "";

      }
      if (this.InfoTutor.GLS_FONO3.length > 9) {
        this.InfoTutor.GLS_FONO3 = "";

      }
    }

    if (this.InfoTutor.GLS_FONO2 !== '') {
      if (this.InfoTutor.GLS_FONO2.length < 7) {
        this.InfoTutor.GLS_FONO2 = "";

      }
      if (this.InfoTutor.GLS_FONO2.length > 9) {
        this.InfoTutor.GLS_FONO2 = "";

      }
    }

    if (this.InfoTutor.Telefono1 !== '') {
      if (this.InfoTutor.Telefono1.length < 7) {
        this.InfoTutor.Telefono1 = "";

      }
      if (this.InfoTutor.Telefono1.length > 9) {
        this.InfoTutor.Telefono1 = "";

      }
    }

  }

  aceptarModalTel() {
    var valido = true;
    if (this.InfoTutor.GLS_FONO3 !== '') {
      if (this.InfoTutor.GLS_FONO3.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.InfoTutor.GLS_FONO3.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.InfoTutor.GLS_FONO2 !== '') {
      if (this.InfoTutor.GLS_FONO2.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.InfoTutor.GLS_FONO2.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.InfoTutor.Telefono1 !== '') {
      if (this.InfoTutor.Telefono1.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.InfoTutor.Telefono1.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }
    if (valido == true) {
      (<any>$('#modalTelefonos')).modal('hide');
    }
  }

  // Función para validar los formatos de Números de Cuenta según el Tipo de Cuenta seleccionado al momento de Guardar.
  validaNumCuenta(pNumCuenta) {
    return this.regexNumCuenta.test(pNumCuenta) ? true : false;
  }

  // Función para Bancos(llena el combo de Tipos de Cuenta según el Banco seleccionado y limpia campos si la bandera es 'elegir').
  cambiarBanco(bandera: string) {
    this.InfoTutor.Cod_TipCuenta = bandera === 'elegir' ? '00' : this.InfoTutor.Cod_TipCuenta;
    this.InfoTutor.Num_Cuenta = bandera === 'elegir' ? '' : this.InfoTutor.Num_Cuenta;
    this.InfoTutor.Num_Cuenta_CCI = bandera === 'elegir' ? '' : this.InfoTutor.Num_Cuenta_CCI;

    this.http.get<any[]>(this.urlPrePolizas + '/CmbTipoCuenta?pCodBanco=' + this.InfoTutor.Cod_Banco).subscribe(result => {
      this.cmbTipoCuenta = result;
      this.cambiarTipoCuenta(bandera)
    }, error => console.error(error));
  }

  // Función para Tipos de Cuenta(genera y valida los formatos de cada Tipo de Cuenta y limpia campos si la bandera es 'elegir').
  cambiarTipoCuenta(bandera: string) {
    let contX = 0;
    this.InfoTutor.Num_Cuenta = bandera === 'elegir' ? '' : this.InfoTutor.Num_Cuenta;
    this.InfoTutor.Num_Cuenta_CCI = bandera === 'elegir' ? '' : this.InfoTutor.Num_Cuenta_CCI;

    if (this.InfoTutor.Cod_TipCuenta !== '' && this.InfoTutor.Cod_TipCuenta !== '00') {

      this.maxLengthNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.InfoTutor.Cod_TipCuenta).NUM_DIGITOS;
      this.arrayNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.InfoTutor.Cod_TipCuenta).NUM_CUENTA.split('X');

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

  // Función para Bancos(llena el combo de Tipos de Cuenta según el Banco seleccionado y limpia campos si la bandera es 'elegir').
  cambiarBancoN(bandera: string) {
    this.InfoTutorNuevo.Cod_TipCuenta = bandera === 'elegir' ? '00' : this.InfoTutorNuevo.Cod_TipCuenta;
    this.InfoTutorNuevo.Num_Cuenta = bandera === 'elegir' ? '' : this.InfoTutorNuevo.Num_Cuenta;
    this.InfoTutorNuevo.Num_Cuenta_CCI = bandera === 'elegir' ? '' : this.InfoTutorNuevo.Num_Cuenta_CCI;

    this.http.get<any[]>(this.urlPrePolizas + '/CmbTipoCuenta?pCodBanco=' + this.InfoTutorNuevo.Cod_Banco).subscribe(result => {
      this.cmbTipoCuenta = result;
      this.cambiarTipoCuenta(bandera)
    }, error => console.error(error));
  }

  // Función para Tipos de Cuenta(genera y valida los formatos de cada Tipo de Cuenta y limpia campos si la bandera es 'elegir').
  cambiarTipoCuentaN(bandera: string) {
    let contX = 0;
    this.InfoTutorNuevo.Num_Cuenta = bandera === 'elegir' ? '' : this.InfoTutorNuevo.Num_Cuenta;
    this.InfoTutorNuevo.Num_Cuenta_CCI = bandera === 'elegir' ? '' : this.InfoTutorNuevo.Num_Cuenta_CCI;

    if (this.InfoTutorNuevo.Cod_TipCuenta !== '' && this.InfoTutorNuevo.Cod_TipCuenta !== '00') {

      this.maxLengthNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.InfoTutorNuevo.Cod_TipCuenta).NUM_DIGITOS;
      this.arrayNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.InfoTutorNuevo.Cod_TipCuenta).NUM_CUENTA.split('X');

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


  validarCorreos() {

    if (this.InfoTutor.GLS_Correo3 !== '') {
      const valEmail = this.validar_email(this.InfoTutor.GLS_Correo3);
      if (!valEmail) {
        this.InfoTutor.GLS_Correo3 = "";
      }
    }

    if (this.InfoTutor.GLS_Correo2 !== '') {
      const valEmail = this.validar_email(this.InfoTutor.GLS_Correo2);
      if (!valEmail) {
        this.InfoTutor.GLS_Correo2 = "";
      }
    }

    if (this.InfoTutor.Correo1 !== '') {
      const valEmail = this.validar_email(this.InfoTutor.Correo1);
      if (!valEmail) {
        this.InfoTutor.Correo1 = "";
      }
    }
  }

  cerrarModalCorreos() {
    this.validarCorreos();
    (<any>$('#modalCorreos')).modal('hide');
  }

  aceptarModalCorreos() {
    var valido = true;
    if (this.InfoTutor.Correo1 !== '') {
      const valEmail = this.validar_email(this.InfoTutor.Correo1);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 1 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.InfoTutor.GLS_Correo2 !== '') {
      const valEmail = this.validar_email(this.InfoTutor.GLS_Correo2);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 2 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.InfoTutor.GLS_Correo3 !== '') {
      const valEmail = this.validar_email(this.InfoTutor.GLS_Correo3);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 3 no tiene formato válido.', 'error');
        valido = false;
      }
    }
    if (valido == true) {
      (<any>$('#modalCorreos')).modal('hide');
    }
  }


  cambiarTipo() {
    const tipoDoc = Number(this.InfoTutor.cod_tipoidentut);
    this.InfoTutor.NUM_IDENTUT = '';
    if (tipoDoc === 1) {
      this.maxLengthNumDocBen = '8';
      this.validaTipo = 1;
    }
    if (tipoDoc === 2 || tipoDoc === 5) {
      this.maxLengthNumDocBen = '12';
      this.validaTipo = 0;
    }
    if (tipoDoc === 9) {
      this.maxLengthNumDocBen = '11';
      this.validaTipo = 0;
    }
    if (tipoDoc === 3 || tipoDoc === 4 || (tipoDoc > 5 && tipoDoc < 9) || tipoDoc === 10 || tipoDoc === 0) {
      this.maxLengthNumDocBen = '15';
      this.validaTipo = 0;
    }
  }

  cambiarTipoNuevo() {
    const tipoDoc = Number(this.InfoTutorNuevo.cod_tipoidentut);
    this.InfoTutorNuevo.NUM_IDENTUT = '';
    if (tipoDoc === 1) {
      this.maxLengthNumDocBenNuevo = '8';
      this.validaTipoNuevo = 1;
    }
    if (tipoDoc === 2 || tipoDoc === 5) {
      this.maxLengthNumDocBenNuevo = '12';
      this.validaTipoNuevo = 0;
    }
    if (tipoDoc === 9) {
      this.maxLengthNumDocBenNuevo = '11';
      this.validaTipoNuevo = 0;
    }
    if (tipoDoc === 3 || tipoDoc === 4 || (tipoDoc > 5 && tipoDoc < 9) || tipoDoc === 10 || tipoDoc === 0) {
      this.maxLengthNumDocBenNuevo = '15';
      this.validaTipoNuevo = 0;
    }
  }

  checkType(event): boolean  {
    if (Number(this.validaTipo) === 1) {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }

    if (Number(this.validaTipo) !== 1) {
      const key = event.keyCode || event.which;
      const tecla = String.fromCharCode(key).toLowerCase();
      const letras = 'áéíóúabcdefghijklmnñopqrstuvwxyz1234567890';
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
  }

  checkTypeNew(event): boolean  {
    if (Number(this.validaTipoNuevo) === 1) {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }

    if (Number(this.validaTipoNuevo) !== 1) {
      const key = event.keyCode || event.which;
      const tecla = String.fromCharCode(key).toLowerCase();
      const letras = 'áéíóúabcdefghijklmnñopqrstuvwxyz1234567890';
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
  }

  BusquedaTutDni() {
    //console.log(this.InfoTutorNuevo.NUM_IDENTUT)
    this.cMantenedorTutoresApoderadosService.postConsultaTutDni(this.InfoTutorNuevo.NUM_IDENTUT)
      .then((resp: any) => {
        //llenado datos del tutor
        if (resp != null) {
          //Antecedentes Personales del Tutor/Apoderado
          this.InfoTutorNuevo.cod_tipoidentut = resp.cod_tipoidentut;
          this.InfoTutorNuevo.NUM_IDENTUT = resp.NUM_IDENTUT;
          this.InfoTutorNuevo.Nombre1 = resp.Nombre1;
          this.InfoTutorNuevo.Nombre2 = resp.Nombre2;
          this.InfoTutorNuevo.Apellido_Pat = resp.Apellido_Pat;
          this.InfoTutorNuevo.Apellido_Mat = resp.Apellido_Mat;
          this.InfoTutorNuevo.Direccion = resp.Direccion;
          this.InfoTutorNuevo.Telefono1 = resp.Telefono1;
          this.InfoTutorNuevo.Correo1 = resp.Correo1;
          this.InfoTutorNuevo.codDireccion = resp.codDireccion;
          this.InfoTutorNuevo.Cod_ViaPago = resp.Cod_ViaPago;
          this.InfoTutorNuevo.Cod_TipCuenta = resp.Cod_TipCuenta;
          this.InfoTutorNuevo.Cod_Banco = resp.Cod_Banco;
          this.InfoTutorNuevo.Cod_Sucursal = resp.Cod_Sucursal;
          this.InfoTutorNuevo.Num_Cuenta = resp.Num_Cuenta;
          this.InfoTutorNuevo.GLS_FONO2 = resp.GLS_FONO2;
          this.InfoTutorNuevo.GLS_FONO3 = resp.GLS_FONO3;
          this.InfoTutorNuevo.GLS_Correo2 = resp.GLS_Correo2;
          this.InfoTutorNuevo.GLS_Correo3 = resp.GLS_Correo3;

          var promise = new Promise((res,rej)=>{
            this.validacionCmbViaPagoN('');
            res();
          }).then(
            ()=>{
              this.cambiarBancoN('');
          })
          

          this.InfoTutorNuevo.Num_Cuenta_CCI = resp.Num_Cuenta_CCI;
          this.InfoTutorNuevo.Cod_Region = resp.Cod_Region;
          this.InfoTutorNuevo.Cod_Provincia = resp.Cod_Provincia;
          this.InfoTutorNuevo.Cod_Comuna = resp.Cod_Comuna;

          //this.InfoTutorNuevo.Num_orden = resp.Num_Orden;
        }
        //llenado de combos
        //provincia
        this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_PROVINCIA", this.InfoTutorNuevo.Cod_Region).then((resp: any) => {
          this.cmbProvinciaN = resp;
        });
        //distrito
        this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_DISTRITO", this.InfoTutorNuevo.Cod_Provincia).then((resp: any) => {
          this.cmbDistritoTutorAll = resp;
        });
        //Sucursal
        if (this.InfoTutorNuevo.Cod_ViaPago == "04") {
          this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "A").then((resp: any) => {
            this.cmbSucursalN = resp;
          });
        } else {
          this.cMantenedorTutoresApoderadosService.getComboGeneral("SELECT_SUCURSAL", "S").then((resp: any) => {
            this.cmbSucursalN = resp;
          });
        }
      });
  }

}
