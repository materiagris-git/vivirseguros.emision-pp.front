import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PolizaAntecedentesPensionadosService } from 'src/providers/poliza-antecedentes-pensionados.service';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { InfoPensionadoConsultado, InfoPensionado, BeneficiariosTbl, BeneficiarioInfo } from 'src/interfaces/PolizaAntecedentesPensionado.model';
import { Globales } from 'src/interfaces/globales';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { LoginService } from 'src/providers/login.service';
import { MantenedorPrepolizasService } from 'src/providers/mantenedorPrePolizas.service';
import { DecimalPipe } from '@angular/common';
import { generarAchivoXLSX } from 'src/providers/generarArchivoXLSX.service';
import { log } from 'util';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-mantencion-antecedentes-pensionado',
  templateUrl: './mantencion-antecedentes-pensionado.component.html',
  styleUrls: ['./mantencion-antecedentes-pensionado.component.css']
})
export class MantencionAntecedentesPensionadoComponent implements OnInit {

  mlApNom = 50;
  mlDir = 100;
  mlTelefono = 10;

  public cmbViaPago: any[];
  public cmbSucursal: any[];
  public cmbTipoCuenta: any[];
  public cmbBanco: any[];
  public cmbTipoIdenBen: any[];
  public cmbInsSalud: any[];
  public cmbModalidadPago: any[];
  public cmbDepartamento: any[];
  public cmbDepartamento2: any[];
  public cmbProvincia: any[];
  public cmbProvincia2: any[];
  public cmbDistrito: any[];
  public cmbDistrito2: any[];
  public cmbDistritoAll: any[];
  public cmbDistritoAll2: any[];
  public cmbEstudiante: any[];
  MtoPSalud = "";
  columnas = [];
  colDir = [];
  comboDistritoResp = [];
  comboDistrito2Resp = [];
  Departamento = "";
  Departamento2 = '';
  Provincia = "";
  Provincia2 = "";
  Distrito = 0;
  Distrito2 = 0;
  CodTipoIden = 0;
  CodViaPago = "";
  CodSucursal = "";
  CodTipoCuenta = "";
  CodBanco = "";
  CodInstitucion = "";
  CodModalidadPago = "";

  DireccionAntigua = "";

  TipoNumIdent = "";
  dep = '';
  prov = '';
  dis = '';
  dep2 = '';
  prov2 = '';
  dis2 = '';
  direccionStr = '';
  direccionStr2 = '';

  maxLengthNumCuenta = '20';
  regexNumCuenta: RegExp; // Para el número de cuenta
  arrayNumCuenta = []; // Para el número de cuenta
  excelInfoCabecera = [];
  pensionAct = [];

  private urlPrePolizas = AppConsts.baseUrl + 'mantenedorprepolizas';

  isDisabledViaPago = true;
  isDisabledSucursal = true;
  isDisabledTipoCuenta = true;
  isDisabledBanco = true;
  isDisabledNumCuenta = true;
  isDisabledNumCuentaCci = true;

  isDisabledModPago = true;
  isDisabledMontoPago = true;
  isDisabledEst = true; 
  isDisabledCamposALL = true;
  isDisabledProt = true;
  infoConsultado: InfoPensionadoConsultado = new InfoPensionadoConsultado();
  infoPensionado: InfoPensionado = new InfoPensionado();
  beneficiariosTbl = [BeneficiariosTbl];
  beneficiariosInfo: BeneficiarioInfo = new BeneficiarioInfo();
  beneficiariosInfoLista: BeneficiarioInfo[] = [];
  beneficiariosInfoListaCopia: BeneficiarioInfo[] = [];
  historialDirecciones: BeneficiarioInfo[] = [];
  CamposSC:boolean;

  constructor(private _polizaAntPenService: PolizaAntecedentesPensionadosService,
    private cdRef: ChangeDetectorRef,
    public titleService: Title,
    private generarAchivoXLSX: generarAchivoXLSX,
    private router: Router,
    private serviceLog: LoginService,
    private mantenedorPrepolizasService: MantenedorPrepolizasService,
    private _decimalPipe: DecimalPipe,
    private http: HttpClient) {
    _polizaAntPenService.getComboIdentificacion().then((resp: any) => {
      this.cmbTipoIdenBen = resp;
    });

    this._polizaAntPenService.getComboGeneral("VPG").then((resp: any) => {
      this.cmbViaPago = resp;
    });

    this._polizaAntPenService.getCombos("SELECT_SUCURSAL", "S").then((resp: any) => {
      this.cmbSucursal = resp;
    });

    this._polizaAntPenService.getComboGeneral("BCO").then((resp: any) => {
      this.cmbBanco = resp;
    });

    this._polizaAntPenService.getComboGeneral("IS").then((resp: any) => {
      this.cmbInsSalud = resp;
    });

    this._polizaAntPenService.getComboGeneral("MP").then((resp: any) => {
      this.cmbModalidadPago = resp;
    });

    this._polizaAntPenService.getComboDepartamento().then((resp: any) => {
      this.cmbDepartamento = resp;
      this.cmbDepartamento2 = resp;
    });

    this.mantenedorPrepolizasService.getComboDistritoAll().then((resp: any) => {
      this.cmbDistritoAll = resp;
      this.cmbDistritoAll2 = resp;
      this.comboDistritoResp = this.cmbDistritoAll.slice();
      this.comboDistrito2Resp = this.cmbDistritoAll2.slice();
    });

    this.columnas = ['item', 'codPar', 'tipoIden', 'nIden', 'beneficiarios', 'estado', 'acciones'];
    this.colDir = ['item', 'fecha', 'direccion', 'distrito', 'provincia', 'departamento'];
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  dataSourceDir: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    this.infoConsultado.NumPoliza = Globales.datosAntPensionados.NumPoliza;
    this.infoConsultado.NumEndoso = Globales.datosAntPensionados.NumEndoso;
    this.infoConsultado.Num_Orden = Globales.datosAntPensionados.NumOrden;

    this._polizaAntPenService.postCargaInfoPensionado(this.infoConsultado).then((resp: any) => {
      this.infoConsultado.NumPoliza = resp.NumPoliza;
      this.infoConsultado.NumEndoso = resp.NumEndoso;
      this.infoConsultado.CUSPP = resp.CUSPP;
      this.infoConsultado.Fecha = resp.Fecha;
      this.infoConsultado.Titular = resp.Titular;
      this.infoConsultado.Documento = resp.Documento;
      this.infoConsultado.CodIdenBen = resp.Cod_IdenBen;
      this.TipoNumIdent = resp.TipoNumIdent;

      if (resp.lstInfoPensionado != null) {
        this.infoPensionado = resp.lstInfoPensionado[0];
        //console.log(this.infoPensionado.MtoPrima);
      }

      if (resp.lstInfoPensionado != null) {
        for (let index = 0; index < resp.lstBeneficiariosTbl.length; index++) {
          this.beneficiariosTbl = resp.lstBeneficiariosTbl;
        }
      }
      
      this.dataSource = new MatTableDataSource(this.beneficiariosTbl);

      this.CodTipoIden = Number(this.infoConsultado.CodIdenBen)
      this._polizaAntPenService.getBeneficiarioInfo(this.infoConsultado.NumPoliza).then((resp: any) => {
      

        this.beneficiariosInfoLista = resp;
        this.beneficiariosInfoListaCopia = JSON.parse(JSON.stringify(resp));

        for (let index = 0; index < this.beneficiariosInfoLista.length; index++) {
          this.beneficiariosInfoLista[index].Usuario = localStorage.getItem('currentUser');
        }

        this.beneficiariosInfo = this.beneficiariosInfoLista[0];
        
        if (this.beneficiariosInfo != null) {
          var promise = new Promise((res, rej) => {
            this.validacionCmbViaPago('');
            res;
          }).then(
            () => {
              this.cambiarBanco('');
            })


          this.beneficiariosInfo.MtoPlanSaludString = this._decimalPipe.transform(this.beneficiariosInfo.MtoPlanSaludString.replace(/,/g, ''), '1.2-2');

          this._polizaAntPenService.getComboDepartamento().then((resp: any) => {
            this.cmbDepartamento = resp;
          });

          this._polizaAntPenService.getComboProvincia(this.beneficiariosInfo.CodRegion).then((resp: any) => {
            this.cmbProvincia = resp;
          });

          this.mantenedorPrepolizasService.getComboDistrito(this.beneficiariosInfo.CodProvincia).then((resp: any) => {
            if (resp.length > 0) {
              this.cmbDistrito = resp;
              //this.Distrito = this.cmbDistrito[0].CodDireccion;
              this.ubigeoExp();
            }
          });

          this.getInfo(this.beneficiariosInfo.CodDireccion);
          this.getInfo2(this.beneficiariosInfo.CodDireccionCorresp);

          this.validacionCmbInst();

          this.dataSourceDir = new MatTableDataSource(this.beneficiariosInfo.LstHistorialDir);
          this.limpiar();
          

        }
        
            
        
        // this._polizaAntPenService.getComboDistrito(this.Provincia).then( (resp: any) => {
        //   this.cmbDistrito = resp;
        // });
      });
      Globales.permisos = JSON.parse(localStorage.getItem('permisos'));
      var indPrePol = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "ALL Campos"));
        if(indPrePol>-1){ this.CamposSC = true} else{this.CamposSC=false;}
        if(this.CamposSC == false)
        this.isDisabledCamposALL = true;
      // this.cambiarTipoCuenta('');
    });

    // this.validacionNumCuenta();
  }

  ngAfterViewInit(): void {
    if (Globales.datosAntPensionados.NumPoliza == "" && Globales.datosAntPensionados.NumEndoso == "" && Globales.datosAntPensionados.NumOrden == 0) {
      this.router.navigate(['/consultaPolizaAntecedentesPensionado']);
    }
    Globales.titlePag = 'Mantención de Antecedentes del Pensionado';
    this.titleService.setTitle(Globales.titlePag);
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked() {
    if (!localStorage.getItem('currentUser')) {
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  onChangeLlenaSucursal() {
    if (this.beneficiariosInfo.CodViaPago == "04") {
      this._polizaAntPenService.getCombos("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
      });
    } else {
      this.beneficiariosInfo.CodSucursal = "0000"
      this._polizaAntPenService.getCombos("SELECT_SUCURSAL", "S").then((resp: any) => {
        this.cmbSucursal = resp;
      });
    }

    this.validacionCmbViaPago('elegir');
  }

  onChangeLlenaProvincia() {
    this._polizaAntPenService.getComboProvincia(this.beneficiariosInfo.CodRegion).then((resp: any) => {
      this.cmbProvincia = resp;

    });
    //this.beneficiariosInfo.CodDireccion = 0;
  }

  onChangeLlenaProvinciaCorresp() {
    this._polizaAntPenService.getComboProvincia(this.Departamento2).then((resp: any) => {
      this.cmbProvincia2 = resp;

    });
    //this.beneficiariosInfo.CodDireccionCorresp = 0;
  }

  onChangeLlenaDistrito() {
    this.mantenedorPrepolizasService.getComboDistrito(this.beneficiariosInfo.CodProvincia).then((resp: any) => {
      this.cmbDistrito = resp;
      this.beneficiariosInfo.CodDireccion = this.cmbDistrito[0].CodDireccion;
      this.ubigeoExp();
    });
  }

  onChangeLlenaDistritoCorresp() {
    this.mantenedorPrepolizasService.getComboDistrito(this.Provincia2).then((resp: any) => {
      this.cmbDistrito2 = resp;
      this.beneficiariosInfo.CodDireccionCorresp = this.cmbDistrito2[0].CodDireccion;
      this.ubigeoCorres();
    });
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
  lettersOnly(event) {
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

  getBeneficiarioData(row) {

    this.CodTipoIden = Number(row.Num_Orden)

    var index = this.beneficiariosInfoLista.indexOf(this.beneficiariosInfoLista.find(x => x.NumOrden == this.CodTipoIden));
    if (index > -1) {
      this.beneficiariosInfo = this.beneficiariosInfoLista[index];

      var PermisoBeneficiarios = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "BeneficiariosSC"));
      if(PermisoBeneficiarios>-1)
      { 
        if(this.beneficiariosInfo.FecFallBen != '' && this.beneficiariosInfo.FecFallBen != null) //&& this.beneficiariosInfo.COD_PAR == '99')
        {
          this.direccionStr = '';
          this.limpiar();
          Swal.fire({ title: 'Advertencia', text: 'El beneficiario no puede ser modificado. ', icon: 'warning', allowOutsideClick: false });
          return;
        }
        //if(this.infoPensionado.CodTippension < '08' && this.beneficiariosInfo.COD_PAR != '99')
        //{
          //this.direccionStr = '';
          //this.limpiar();
          //Swal.fire({ title: 'Advertencia', text: 'El beneficiario no puede ser modificado. ', icon: 'warning', allowOutsideClick: false });
          //return;
        //}
        else
        {
          this.beneficiariosInfo.MtoPlanSaludString = this._decimalPipe.transform(this.beneficiariosInfo.MtoPlanSaludString.replace(/,/g, ''), '1.2-2');
  
        this.onChangeLlenaProvincia();
        this.onChangeLlenaProvinciaCorresp();
        // this.onChangeLlenaDistrito();
        this.validacionNumCuenta();
        var promise = new Promise((res, rej) => {
          this.validacionCmbViaPago('');
          res;
        }).then(
          () => {
            this.cambiarBanco('');
          })
        // this.cambiarTipoCuenta('');
        this.validacionCmbInst();
  
        this.getInfo(this.beneficiariosInfo.CodDireccion);
        this.getInfo2(this.beneficiariosInfo.CodDireccionCorresp);
  
        this.dataSourceDir = new MatTableDataSource(this.beneficiariosInfo.LstHistorialDir);
       
        //Validacion para estudiante
       if (this.beneficiariosInfo.COD_PAR == '30') {
        this.isDisabledEst = false;
      }
      if (this.beneficiariosInfo.COD_PAR != '30') {
        this.isDisabledEst = true;
      }
        }
        if(this.infoPensionado.CodTippension < '08' && this.beneficiariosInfo.COD_PAR == '99')
        {
            this.isDisabledProt = false;
        }
        else if(this.infoPensionado.CodTippension >= '08' && this.beneficiariosInfo.COD_PAR != '99')
        {
          this.isDisabledProt = false;
        }
        else
        {
          this.isDisabledProt = true;
        }
      } 
      else
      {
        if(this.infoPensionado.CodTippension < '08' && this.beneficiariosInfo.COD_PAR == '99')
        {
            this.isDisabledProt = false;
        }
        else if(this.infoPensionado.CodTippension >= '08' && this.beneficiariosInfo.COD_PAR != '99')
        {
          this.isDisabledProt = false;
        }
        else
        {
          this.isDisabledProt = true;
        }
        this.beneficiariosInfo.MtoPlanSaludString = this._decimalPipe.transform(this.beneficiariosInfo.MtoPlanSaludString.replace(/,/g, ''), '1.2-2');
  
        this.onChangeLlenaProvincia();
        this.onChangeLlenaProvinciaCorresp();
        // this.onChangeLlenaDistrito();
        this.validacionNumCuenta();
        var promise = new Promise((res, rej) => {
          this.validacionCmbViaPago('');
          res;
        }).then(
          () => {
            this.cambiarBanco('');
          })
        // this.cambiarTipoCuenta('');
        this.validacionCmbInst();
  
        this.getInfo(this.beneficiariosInfo.CodDireccion);
        this.getInfo2(this.beneficiariosInfo.CodDireccionCorresp);
  
        this.dataSourceDir = new MatTableDataSource(this.beneficiariosInfo.LstHistorialDir);
       
        //Validacion para estudiante
       if (this.beneficiariosInfo.COD_PAR == '30') {
        this.isDisabledEst = false;
      }
      if (this.beneficiariosInfo.COD_PAR != '30') {
        this.isDisabledEst = true;
      }
    }

    }
  }

  guardarBenef() {
    for (let index = 0; index < this.beneficiariosInfoLista.length; index++) {
      this.beneficiariosInfoLista[index].MtoPlanSalud = +this.beneficiariosInfoLista[index].MtoPlanSaludString.replace(',', '');

      if (this.beneficiariosInfoLista[index].GlsDirben == "" || this.beneficiariosInfoLista[index].GlsDirben == null) {
        Swal.fire({ title: 'Advertencia', text: 'La dirección de expediente no puede ir vacía en el beneficiario ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      if (this.beneficiariosInfoLista[index].CodRegion == "" || this.beneficiariosInfoLista[index].CodRegion == null) {
        Swal.fire({ title: 'Advertencia', text: 'El ubigeo expediente no puede ir vacía para el beneficiario ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      if (this.beneficiariosInfoLista[index].CodProvincia == "" || this.beneficiariosInfoLista[index].CodProvincia == null) {
        Swal.fire({ title: 'Advertencia', text: 'El ubigeo expediente no puede ir vacía para el beneficiario ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      if (this.beneficiariosInfoLista[index].CodDireccion == 0 || this.beneficiariosInfoLista[index].CodDireccion == null) {
        Swal.fire({ title: 'Advertencia', text: 'El ubigeo expediente no puede ir vacía para el beneficiario ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      //Validaciones de vía pago.
      if (this.beneficiariosInfoLista[index].CodViaPago == "00") {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar Forma de Pago del beneficario ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }
      if ((this.beneficiariosInfoLista[index].CodViaPago == "01" || this.beneficiariosInfoLista[index].CodViaPago == "04") && (this.beneficiariosInfoLista[index].CodSucursal == "000")) {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar la Sucursal de la Vía de Pago ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }
      if ((this.beneficiariosInfoLista[index].CodViaPago === "02" || this.beneficiariosInfoLista[index].CodViaPago === "03" || this.beneficiariosInfoLista[index].CodViaPago === "05") && (this.beneficiariosInfoLista[index].CodBanco === "00")) {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Banco ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      /*if (this.beneficiariosInfoLista[index].CodViaPago == "02") {
        if (this.beneficiariosInfoLista[index].CodTipCuenta == "00") {
          Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Tipo de Cuenta ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if (!this.validaNumCuenta(this.beneficiariosInfoLista[index].NumCuenta) || this.beneficiariosInfoLista[index].NumCuenta.length !== Number(this.maxLengthNumCuenta)) {
          Swal.fire('Advertencia', 'Número de cuenta inválido para el beneficiario ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', 'warning');
          return;
        }
        if (this.beneficiariosInfoLista[index].NumCuenta == "" || this.beneficiariosInfoLista[index].NumCuentaCci == "") {
          Swal.fire({ title: 'Advertencia', text: 'Debe ingresar los Números de Cuenta para el beneficiario  ' + this.beneficiariosInfoLista[index].Nombre + ' ' + this.beneficiariosInfoLista[index].SegNombre + ' ' + this.beneficiariosInfoLista[index].ApePaterno + ' ' + this.beneficiariosInfoLista[index].ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
          return;
        }
      }*/
    }

    for (let i = 0; i < this.beneficiariosInfoLista.length; i++) {
      var comparacion = this.comparaObjetos(this.beneficiariosInfoLista[i], this.beneficiariosInfoListaCopia[i]);
      if (comparacion == true) {
        this.actualizaBeneficiarios(this.beneficiariosInfoLista);
        return;
      }
    }

    Swal.fire({
      title: 'Advertencia',
      text: "No puede guardar sin haber realizado cambios.",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });

  }

  actualizaBeneficiarios(benefLista) {
    let suma = Number(this.infoConsultado.NumEndoso) + 1;

    this.infoConsultado.NumPoliza = Globales.datosAntPensionados.NumPoliza;
    this.infoConsultado.NumEndoso = suma.toString();
    this.infoConsultado.Num_Orden = Globales.datosAntPensionados.NumOrden;

    this._polizaAntPenService.ActualizarBeneficiario(benefLista).then((resp: any) => {

      if (resp.result == "EXITOSO.") {
        this._polizaAntPenService.postCargaInfoPensionado(this.infoConsultado).then((resp: any) => {

          this.infoConsultado.NumPoliza = resp.NumPoliza;
          this.infoConsultado.NumEndoso = resp.NumEndoso;
          this.infoConsultado.Num_Orden = resp.Num_Orden;
          this.infoConsultado.CUSPP = resp.CUSPP;
          this.infoConsultado.Fecha = resp.Fecha;
          this.infoConsultado.Titular = resp.Titular;
          this.infoConsultado.Documento = resp.Documento;
          this.infoConsultado.CodIdenBen = resp.Cod_IdenBen;
          this.DireccionAntigua = this.beneficiariosInfo.GlsDirben;

          if (resp.lstInfoPensionado.length > 0) {
            this.infoPensionado = resp.lstInfoPensionado[0];
          }

          for (let index = 0; index < resp.lstBeneficiariosTbl.length; index++) {
            this.beneficiariosTbl = resp.lstBeneficiariosTbl;
          }

          this.dataSource = new MatTableDataSource(this.beneficiariosTbl);

          this._polizaAntPenService.getBeneficiarioInfo(this.infoConsultado.NumPoliza).then((resp: any) => {

            this.beneficiariosInfoLista = resp;
            this.beneficiariosInfoListaCopia = JSON.parse(JSON.stringify(resp));

            for (let index = 0; index < this.beneficiariosInfoLista.length; index++) {
              this.beneficiariosInfoLista[index].Usuario = localStorage.getItem('currentUser');
            }

            this.beneficiariosInfo = this.beneficiariosInfoLista[0];

            if (this.beneficiariosInfo != null) {

              var promise = new Promise((res, rej) => {
                this.validacionCmbViaPago('');
                res;
              }).then(
                () => {
                  this.cambiarBanco('');
                })

              this.beneficiariosInfo.MtoPlanSaludString = this._decimalPipe.transform(this.beneficiariosInfo.MtoPlanSaludString.replace(/,/g, ''), '1.2-2');

              this._polizaAntPenService.getComboDepartamento().then((resp: any) => {
                this.cmbDepartamento = resp;
              });

              this._polizaAntPenService.getComboProvincia(this.beneficiariosInfo.CodRegion).then((resp: any) => {
                this.cmbProvincia = resp;
              });

              this.mantenedorPrepolizasService.getComboDistrito(this.beneficiariosInfo.CodProvincia).then((resp: any) => {
                if (resp.length > 0) {
                  this.cmbDistrito = resp;
                  //this.Distrito = this.cmbDistrito[0].CodDireccion;
                  this.ubigeoExp();
                }
              });

              this.getInfo(this.beneficiariosInfo.CodDireccion);
              this.getInfo2(this.beneficiariosInfo.CodDireccionCorresp);

              this.validacionCmbInst();

              this.dataSourceDir = new MatTableDataSource(this.beneficiariosInfo.LstHistorialDir);
              this.direccionStr = '';
              this.limpiar();
              Swal.fire({ title: 'Éxito', text: "La información ha sido actualizada exitosamente.", icon: 'success', allowOutsideClick: false });
            }
          });
        });
      } else {
        Swal.fire({ title: 'ERROR', text: resp.Mensaje, icon: 'error', allowOutsideClick: false });
      }
      return;
    });
  }

  validacionNumCuenta() {
    this.isDisabledCamposALL = true;
    if (this.beneficiariosInfo.NumCuenta == "") {
      this.isDisabledNumCuenta = false;
    } else {
      this.isDisabledNumCuenta = true;
    }
  }

  async validacionCmbViaPago(bandera: string) {
    Globales.permisos = JSON.parse(localStorage.getItem('permisos'));
            
    var indPrePol = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "ALL Campos"));
    if(indPrePol>-1){ this.CamposSC = true} else{this.CamposSC=false;}
    if(this.CamposSC === true)
    this.isDisabledCamposALL = false;

    if(this.isDisabledCamposALL == false){
    if (this.beneficiariosInfo.CodViaPago == "00") {
      this._polizaAntPenService.getCombos("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledSucursal = true;
        this.isDisabledTipoCuenta = true;
        this.isDisabledBanco = true;
        this.isDisabledNumCuenta = true;
        this.isDisabledNumCuentaCci = true;
        this.isDisabledViaPago = false;
        
        this.beneficiariosInfo.CodSucursal = "000"
        this.beneficiariosInfo.CodTipCuenta = "00";
        this.beneficiariosInfo.CodBanco = "00";
        this.beneficiariosInfo.NumCuenta = ""
        this.beneficiariosInfo.NumCuentaCci = "";
      });
    } else if (this.beneficiariosInfo.CodViaPago == "02") {
      this._polizaAntPenService.getCombos("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledViaPago = false;
        this.isDisabledSucursal = true;
        this.isDisabledTipoCuenta = false;
        this.isDisabledBanco = false;
        this.isDisabledNumCuenta = false;
        this.isDisabledNumCuentaCci = false;
        this.beneficiariosInfo.CodSucursal = "000"
        this.beneficiariosInfo.CodTipCuenta = bandera === 'elegir' ? '00' : this.beneficiariosInfo.CodTipCuenta;
        this.beneficiariosInfo.CodBanco = bandera === 'elegir' ? '00' : this.beneficiariosInfo.CodBanco;
        this.beneficiariosInfo.NumCuenta = bandera === 'elegir' ? '' : this.beneficiariosInfo.NumCuenta;
        this.beneficiariosInfo.NumCuentaCci = bandera === 'elegir' ? '' : this.beneficiariosInfo.NumCuentaCci;
      });
    } else if (this.beneficiariosInfo.CodViaPago == "04") {
      this._polizaAntPenService.getCombos("SELECT_SUCURSAL", "A").then((resp: any) => {
        this.cmbSucursal = resp;
        this.isDisabledViaPago = false;
        this.isDisabledSucursal = false;
        this.isDisabledTipoCuenta = true;
        this.isDisabledBanco = true;
        this.isDisabledNumCuenta = true;
        this.isDisabledNumCuentaCci = true;
        this.beneficiariosInfo.NumCuenta = ""
        this.beneficiariosInfo.NumCuentaCci = "";
        this.beneficiariosInfo.CodSucursal = bandera === 'elegir' ? '000' : this.beneficiariosInfo.CodSucursal;
        this.beneficiariosInfo.CodTipCuenta = "00";
        this.beneficiariosInfo.CodBanco = "00";
      });
    } else if (this.beneficiariosInfo.CodViaPago == "05") {
      this.isDisabledViaPago = false;
      this.isDisabledSucursal = true;
      this.isDisabledTipoCuenta = true;
      this.isDisabledBanco = false;
      this.isDisabledNumCuenta = true;
      this.isDisabledNumCuentaCci = true;
      this.beneficiariosInfo.CodSucursal = "000"
      this.beneficiariosInfo.CodTipCuenta = "00";
      this.beneficiariosInfo.CodBanco = bandera === 'elegir' ? '00' : this.beneficiariosInfo.CodBanco;
      this.beneficiariosInfo.NumCuenta = ""
      this.beneficiariosInfo.NumCuentaCci = "";
    }
  }
  else{
    this.isDisabledSucursal = true;
        this.isDisabledTipoCuenta = true;
        this.isDisabledBanco = true;
        this.isDisabledNumCuenta = true;
        this.isDisabledNumCuentaCci = true;
        this.isDisabledViaPago = true;
  }
  }

  validacionCmbInst() {
    Globales.permisos = JSON.parse(localStorage.getItem('permisos'));
            
    var indPrePol = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "ALL Campos"));
    if(indPrePol>-1){ this.CamposSC = true} else{this.CamposSC=false;}
    if(this.CamposSC === true)
    this.isDisabledCamposALL = false;

    if(this.isDisabledCamposALL == false){
      if (this.beneficiariosInfo.CodInsSalud == "00") {
        this.isDisabledModPago = false;
        this.beneficiariosInfo.MtoPlanSaludString = "0.00";
        this.isDisabledMontoPago = true;
      } else if (this.beneficiariosInfo.CodInsSalud == "13") {
        this.isDisabledModPago = false;
        this.isDisabledMontoPago = false;
      }
    }
    else{
      this.isDisabledModPago = true;
        this.isDisabledMontoPago = true;
    }
  }

  cerrarModalTel() {

    this.validarTelefonos();
    (<any>$('#modalTelefonos')).modal('hide');
  }

  validarTelefonos() {

    if (this.beneficiariosInfo.GlsFono3 !== '') {
      if (this.beneficiariosInfo.GlsFono3.length < 7) {
        this.beneficiariosInfo.GlsFono3 = "";
      }
      if (this.beneficiariosInfo.GlsFono3.length > 9) {
        this.beneficiariosInfo.GlsFono3 = "";

      }
    }

    if (this.beneficiariosInfo.GlsFono2 !== '') {
      if (this.beneficiariosInfo.GlsFono2.length < 7) {
        this.beneficiariosInfo.GlsFono2 = "";

      }
      if (this.beneficiariosInfo.GlsFono2.length > 9) {
        this.beneficiariosInfo.GlsFono2 = "";

      }
    }

    if (this.beneficiariosInfo.GlsFono !== '') {
      if (this.beneficiariosInfo.GlsFono.length < 7) {
        this.beneficiariosInfo.GlsFono = "";

      }
      if (this.beneficiariosInfo.GlsFono.length > 9) {
        this.beneficiariosInfo.GlsFono = "";
      }
    }
  }

  aceptarModalTel() {
    var valido = true;
    if (this.beneficiariosInfo.GlsFono3 !== '') {
      if (this.beneficiariosInfo.GlsFono3.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.beneficiariosInfo.GlsFono3.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.beneficiariosInfo.GlsFono2 !== '') {
      if (this.beneficiariosInfo.GlsFono2.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.beneficiariosInfo.GlsFono2.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.beneficiariosInfo.GlsFono !== '') {
      if (this.beneficiariosInfo.GlsFono.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.beneficiariosInfo.GlsFono.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }
    if (valido == true) {
      (<any>$('#modalTelefonos')).modal('hide');
    }
  }

  validar_email(email) {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  validarCorreos() {

    if (this.beneficiariosInfo.Correo3 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo3);
      if (!valEmail) {
        this.beneficiariosInfo.Correo3 = "";
      }
    }

    if (this.beneficiariosInfo.Correo2 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo2);
      if (!valEmail) {
        this.beneficiariosInfo.Correo2 = "";
      }
    }

    if (this.beneficiariosInfo.Correo1 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo1);
      if (!valEmail) {
        this.beneficiariosInfo.Correo1 = "";
      }
    }
  }

  cerrarModalCorreos() {
    this.validarCorreos();
    (<any>$('#modalCorreos')).modal('hide');
  }

  aceptarModalCorreos() {
    var valido = true;
    if (this.beneficiariosInfo.Correo1 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo1);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 1 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.beneficiariosInfo.Correo2 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo2);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 2 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.beneficiariosInfo.Correo3 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo3);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 3 no tiene formato válido.', 'error');
        valido = false;
      }
    }
    if (valido == true) {
      (<any>$('#modalCorreos')).modal('hide');
    }
  }

  cancelar() {
    this.router.navigate(['/consultaPolizaAntecedentesPensionado']);
  }

  getInfo(codDir) {
    this.beneficiariosInfo.CodDireccion = codDir;

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
      if (resp.length > 0) {
        const var1 = resp[0].CodProvincia;
        this.beneficiariosInfo.CodProvincia = var1;
        this.beneficiariosInfo.CodRegion = resp[0].CodRegion.toString();
        this.ubigeoExp();
      } else {
        this.direccionStr = '';
        this.beneficiariosInfo.CodRegion = "";
        this.beneficiariosInfo.CodProvincia = "";
        this.beneficiariosInfo.CodDireccion = 0;
      }

    });
  }

  getInfo2(codDir) {
    this.beneficiariosInfo.CodDireccionCorresp = codDir;

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
      this.cmbProvincia2 = listaLlenado;
    });

    if (codDir !== 0) {
      this.mantenedorPrepolizasService.getProvinciaUnica(codDir).then((resp: any) => {
        if (resp.length > 0) {
          const var1 = resp[0].CodProvincia;
          this.Provincia2 = var1;
          this.Departamento2 = resp[0].CodRegion.toString();
          this.ubigeoCorres();
        }
      });
    } else {
      this.direccionStr2 = '';
      this.Departamento2 = "";
      this.Provincia2 = "";
      this.beneficiariosInfo.CodDireccionCorresp = 0;
    }

  }

  ubigeoExp() {
    if (this.beneficiariosInfo.CodDireccion !== 0) {
      for (const i in this.cmbDepartamento) {
        if (this.beneficiariosInfo.CodRegion === this.cmbDepartamento[i].codigo) {
          this.dep = this.cmbDepartamento[i].descripcion;
        }
      }
      for (const i in this.cmbProvincia) {
        if (this.beneficiariosInfo.CodProvincia === this.cmbProvincia[i].codigo) {
          this.prov = this.cmbProvincia[i].descripcion;
        }
      }
      // tslint:disable-next-line:forin
      for (const i in this.cmbDistritoAll) {
        const var1 = Number(this.beneficiariosInfo.CodDireccion);
        const var2 = Number(this.cmbDistritoAll[i].CodDireccion);
        if (var1 === var2) {
          const slip = this.cmbDistritoAll[i].GlsDistrito;
          this.dis = slip.split(' - ', 1);
        }
      }
      this.direccionStr = this.dep + '-' + this.prov + '-' + this.dis;
    }
  }

  ubigeoCorres() {
    if (this.beneficiariosInfo.CodDireccionCorresp !== 0) {
      for (const i in this.cmbDepartamento2) {
        if (this.Departamento2 === this.cmbDepartamento2[i].codigo) {
          this.dep2 = this.cmbDepartamento2[i].descripcion;
        }
      }
      for (const i in this.cmbProvincia2) {
        if (this.Provincia2 === this.cmbProvincia2[i].codigo) {
          this.prov2 = this.cmbProvincia2[i].descripcion;
        }
      }
      // tslint:disable-next-line:forin
      for (const i in this.cmbDistritoAll2) {
        const var1 = Number(this.beneficiariosInfo.CodDireccionCorresp);
        const var2 = Number(this.cmbDistritoAll2[i].CodDireccion);
        if (var1 === var2) {
          const slip = this.cmbDistritoAll2[i].GlsDistrito;
          this.dis2 = slip.split(' - ', 1);
        }
      }
      this.direccionStr2 = this.dep2 + '-' + this.prov2 + '-' + this.dis2;
    } else {
      this.direccionStr2 = '';
    }
  }

  // Función para validar los formatos de Números de Cuenta según el Tipo de Cuenta seleccionado al momento de Guardar.
  validaNumCuenta(pNumCuenta) {
    return this.regexNumCuenta.test(pNumCuenta) ? true : false;
  }

  // Función para Bancos(llena el combo de Tipos de Cuenta según el Banco seleccionado y limpia campos si la bandera es 'elegir').
  cambiarBanco(bandera: string) {
    this.beneficiariosInfo.CodTipCuenta = bandera === 'elegir' ? '00' : this.beneficiariosInfo.CodTipCuenta;
    this.beneficiariosInfo.NumCuenta = bandera === 'elegir' ? '' : this.beneficiariosInfo.NumCuenta;
    this.beneficiariosInfo.NumCuentaCci = bandera === 'elegir' ? '' : this.beneficiariosInfo.NumCuentaCci;

    this.http.get<any[]>(this.urlPrePolizas + '/CmbTipoCuenta?pCodBanco=' + this.beneficiariosInfo.CodBanco).subscribe(result => {
      this.cmbTipoCuenta = result;
      this.cambiarTipoCuenta(bandera);
    }, error => console.error(error));
  }

  // Función para Tipos de Cuenta(genera y valida los formatos de cada Tipo de Cuenta y limpia campos si la bandera es 'elegir').
  async cambiarTipoCuenta(bandera: string) {
    let contX = 0;
    this.beneficiariosInfo.NumCuenta = bandera === 'elegir' ? '' : this.beneficiariosInfo.NumCuenta;
    this.beneficiariosInfo.NumCuentaCci = bandera === 'elegir' ? '' : this.beneficiariosInfo.NumCuentaCci;

    if (this.beneficiariosInfo.CodTipCuenta !== '' && this.beneficiariosInfo.CodTipCuenta !== '00') {
      this.maxLengthNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.beneficiariosInfo.CodTipCuenta).NUM_DIGITOS;
      this.arrayNumCuenta = this.cmbTipoCuenta.find(item => item.COD_CUENTA === this.beneficiariosInfo.CodTipCuenta).NUM_CUENTA.split('X');

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

  //Función para comparar las listas.
  comparaObjetos(arr1, arr2) {
    var editado: boolean = false;

    if (arr1.CodViaPago == "02") {
      if (arr2.CodSucursal != arr2.CodSucursal) {
        arr1.CodSucursal = arr2.CodSucursal
      }
    }

    if (arr1.ApePaterno != arr2.ApePaterno) { editado = true }
    if (arr1.ApeMaterno != arr2.ApeMaterno) { editado = true }
    if (arr1.Nombre != arr2.Nombre) { editado = true }
    if (arr1.SegNombre != arr2.SegNombre) { editado = true }
    if (arr1.GlsDirben != arr2.GlsDirben) { editado = true }
    if (arr1.CodDireccion != arr2.CodDireccion) { editado = true }
    if (arr1.GlsDirbenExpediente != arr2.GlsDirbenExpediente) { editado = true }
    if (arr1.CodDireccionCorresp != arr2.CodDireccionCorresp) { editado = true }
    if (arr1.Departamento != arr2.Departamento) { editado = true }
    if (arr1.CodViaPago != arr2.CodViaPago) { editado = true }
    if (arr1.CodSucursal != arr2.CodSucursal) { editado = true }
    if (arr1.CodBanco != arr2.CodBanco) { editado = true }
    if (arr1.CodTipCuenta != arr2.CodTipCuenta) { editado = true }
    if (arr1.NumCuenta != arr2.NumCuenta) { editado = true }
    if (arr1.NumCuentaCci != arr2.NumCuentaCci) { editado = true }
    if (arr1.CodInsSalud != arr2.CodInsSalud) { editado = true }
    if (arr1.CodModSalud != arr2.CodModSalud) { editado = true }
    if (arr1.MtoPlanSalud != arr2.MtoPlanSalud) { editado = true }
    if (arr1.CodRegion != arr2.CodRegion) { editado = true }
    if (arr1.CodProvincia != arr2.CodProvincia) { editado = true }
    if (arr1.GlsFono != arr2.GlsFono) { editado = true }
    if (arr1.GlsFono2 != arr2.GlsFono2) { editado = true }
    if (arr1.GlsFono3 != arr2.GlsFono3) { editado = true }
    if (arr1.Correo1 != arr2.Correo1) { editado = true }
    if (arr1.Correo2 != arr2.Correo2) { editado = true }
    if (arr1.Correo3 != arr2.Correo3) { editado = true }
    if (arr1.IndEstudiante != arr2.IndEstudiante) { editado = true }

    return editado;
  }

  numberDecimal(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode === 47 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getExcelPensionAct() {
    this._polizaAntPenService.getInfoExcel(this.infoConsultado.NumPoliza).then((resp: any) => {
      this.excelInfoCabecera = resp.LstInfoCabecera;
      this.pensionAct = resp.LstPensionAct;

      //Generación de archivo Excel
      Swal.showLoading();
      this.generarAchivoXLSX.generateExcelPensionAct(this.pensionAct, this.excelInfoCabecera);
      Swal.close();
    });
  }

  generarArchivo() {
    Swal.showLoading();
    if(this.infoConsultado.NumPoliza != ""){
      this._polizaAntPenService.generaArchivoPDF(this.infoConsultado.NumPoliza).then( (resp: any) => {
        //FileSaver.saveAs(resp.Archivo,resp.Nombre);
        var blob = this._polizaAntPenService.downloadFile(resp.Nombre).subscribe(res=>{
          FileSaver.saveAs(res,resp.Nombre);
        }, err=>{
          console.log(err)
        });
      });
      Swal.close();
    }else{
      Swal.fire({title: 'ERROR',text: "Debe Ingresar el Periodo de Pago." , icon: 'error', allowOutsideClick: false});
    }
  }

  guardarBen(){

    var valido = true;
    if (this.beneficiariosInfo.Correo1 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo1);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 1 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.beneficiariosInfo.Correo2 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo2);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 2 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.beneficiariosInfo.Correo3 !== '') {
      const valEmail = this.validar_email(this.beneficiariosInfo.Correo3);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 3 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    var valido = true;
    if (this.beneficiariosInfo.GlsFono3 !== '') {
      if (this.beneficiariosInfo.GlsFono3.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.beneficiariosInfo.GlsFono3.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.beneficiariosInfo.GlsFono2 !== '') {
      if (this.beneficiariosInfo.GlsFono2.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.beneficiariosInfo.GlsFono2.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.beneficiariosInfo.GlsFono !== '') {
      if (this.beneficiariosInfo.GlsFono.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.beneficiariosInfo.GlsFono.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    this.beneficiariosInfo.MtoPlanSalud = +this.beneficiariosInfo.MtoPlanSaludString.replace(',', '');

      if (this.beneficiariosInfo.GlsDirben == "" || this.beneficiariosInfo.GlsDirben == null) {
        Swal.fire({ title: 'Advertencia', text: 'La dirección de expediente no puede ir vacía en el beneficiario ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      if (this.beneficiariosInfo.CodRegion == "" || this.beneficiariosInfo.CodRegion == null) {
        Swal.fire({ title: 'Advertencia', text: 'El ubigeo expediente no puede ir vacía para el beneficiario ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      if (this.beneficiariosInfo.CodProvincia == "" || this.beneficiariosInfo.CodProvincia == null) {
        Swal.fire({ title: 'Advertencia', text: 'El ubigeo expediente no puede ir vacía para el beneficiario ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      if (this.beneficiariosInfo.CodDireccion == 0 || this.beneficiariosInfo.CodDireccion == null) {
        Swal.fire({ title: 'Advertencia', text: 'El ubigeo expediente no puede ir vacía para el beneficiario ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      //Validaciones de vía pago.
      if (this.beneficiariosInfo.CodViaPago == "00") {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar Forma de Pago del beneficario ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }
      if ((this.beneficiariosInfo.CodViaPago == "01" || this.beneficiariosInfo.CodViaPago == "04") && (this.beneficiariosInfo.CodSucursal == "000")) {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar la Sucursal de la Vía de Pago ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }
      if ((this.beneficiariosInfo.CodViaPago === "02" || this.beneficiariosInfo.CodViaPago === "03" || this.beneficiariosInfo.CodViaPago === "05") && (this.beneficiariosInfo.CodBanco === "00")) {
        Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Banco ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
        return;
      }

      // if (this.beneficiariosInfo.CodViaPago == "02") {
      //   if (this.beneficiariosInfo.CodTipCuenta == "00") {
      //     Swal.fire({ title: 'Advertencia', text: 'Debe seleccionar el Tipo de Cuenta ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
      //     return;
      //   }
      //   if (!this.validaNumCuenta(this.beneficiariosInfo.NumCuenta) || this.beneficiariosInfo.NumCuenta.length !== Number(this.maxLengthNumCuenta)) {
      //     Swal.fire('Advertencia', 'Número de cuenta inválido para el beneficiario ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', 'warning');
      //     return;
      //   }
      //   if (this.beneficiariosInfo.NumCuenta == "" || this.beneficiariosInfo.NumCuentaCci == "") {
      //     Swal.fire({ title: 'Advertencia', text: 'Debe ingresar los Números de Cuenta para el beneficiario  ' + this.beneficiariosInfo.Nombre + ' ' + this.beneficiariosInfo.SegNombre + ' ' + this.beneficiariosInfo.ApePaterno + ' ' + this.beneficiariosInfo.ApeMaterno + '.', icon: 'warning', allowOutsideClick: false });
      //     return;
      //   }
      // }

    Swal.fire({ title: 'AVISO', text: 'La información del beneficiario ha sido actualizada.', icon: 'success', allowOutsideClick: false });
  }

  limpiar() {
    this.beneficiariosInfo = {
      TipoIden: "",
      Documento: "",
      ApePaterno: "",
      ApeMaterno: "",
      Nombre: "",
      SegNombre: "",
      FecNacBen: "",
      FecFallBen: "",
      CodSitInv: "",
      NumOrden: 0,
      GlsFono: "",
      GlsFono2: "",
      GlsFono3: "",
      GlsDirben: "",
      GlsDirbenExpediente: "",
      CodRegion: "",
      GlsRegion: "",
      CodProvincia: "",
      GlsProvincia: "",
      CodComuna: "",
      GlsComuna: "",
      MtoPension: 0,
      MtoPensiongar: 0,
      IndEstudiante: "",
      CodViaPago: "",
      CodSucursal: "",
      CodTipCuenta: "",
      CodBanco: "",
      NumCuenta: "",
      NumCuentaCci: "",
      CodInsSalud: "",
      CodModSalud: "",
      MtoPlanSalud: 0,
      CodTipoIden: 0,
      NumPoliza: "",
      NumEndoso: 0,
      FecIniVig: '',
      CodDirben: 0,
      DireccionAntigua: '',
      Correo1: "",
      Correo2: "",
      Correo3: "",
      CodDireccion: 0,
      CodDireccionCorresp: 0,
      Usuario: "",
      MtoPlanSaludString: "",
      COD_PAR: ""
  };
  }

}
