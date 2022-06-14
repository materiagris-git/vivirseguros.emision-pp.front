import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MantencionPagosTercerosGastosSepelioService } from 'src/providers/mantencion-pagos-terceros-gastos-sepelio.service';
import { Globales } from 'src/interfaces/globales';
import { BusquedaGeneralPoliza } from 'src/interfaces/busquedaGeneralPoliza.model';
import { DatosGastosSepelio, Direccion, DatosGuardar, InfoCabezeraSepelio } from 'src/interfaces/mantencionPTGastosSepelio.model';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoginService } from 'src/providers/login.service';
import { AppConsts } from 'src/app/AppConst';
import { HttpClient } from '@angular/common/http';
import { MantenedorPrepolizasService } from 'src/providers/mantenedorPrePolizas.service';
import { PagoTercerosService } from 'src/providers/pago-terceros.service';
import { saveAs } from 'file-saver';
import { MatPaginator, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-mantencion-pagos-terceros-gastos-sepelio',
  templateUrl: './mantencion-pagos-terceros-gastos-sepelio.component.html',
  styleUrls: ['./mantencion-pagos-terceros-gastos-sepelio.component.css']
})
export class MantencionPagosTercerosGastosSepelioComponent implements OnInit {

  columnasReg = [];
  maxLengthNumCuenta = '20';
  regexNumCuenta: RegExp; // Para el número de cuenta
  arrayNumCuenta = []; // Para el número de cuenta
  lstBanco = [];
  lstDepartamento = [];
  lstSucursal = [];
  lstTipoCuenta = [];
  lstTipoDocumento = [];
  lstTipoPersona = [];
  lstViaPago = [];
  lstProvincia = [];
  lstDistrito = [];
  comboDistritoResp = [];
  direccionStr = '';
  dep = '';
  prov = '';
  dis = '';
  validaTipo: number;
  infoConsulta: InfoCabezeraSepelio = new InfoCabezeraSepelio();
  departamentoSel="";
  provinciaSel="";
  maxLengthNumDocBen = "8";
  public cmbDistritoAll: any[];
  public cmbDistrito: any[];
  datosGastosSepelio:DatosGastosSepelio = new DatosGastosSepelio();
  datosGuardar:DatosGuardar = new DatosGuardar();
  datosDireccion:Direccion = new Direccion();
  dataCabezera: BusquedaGeneralPoliza = new BusquedaGeneralPoliza();
  sucursal:boolean;
  tipoCta:boolean;
  banco:boolean;
  noCuenta:boolean;
  noCuentaCCI:boolean;
  public cmbParentesco: any[];
  codParBenSelect = '00';
  public cmbMoneda: any[];
  codMoneda = '00';
  valorInfo = '0';
  valorAFP = '000';
  private urlPrePolizas = AppConsts.baseUrl + 'mantenedorprepolizas';
  private urlGS = AppConsts.baseUrl + 'mantenedorprepolizas';
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private _pagoTerceroService: PagoTercerosService,
              private router:Router,
              private service:MantencionPagosTercerosGastosSepelioService,
              private _serviceFecha: ServiciofechaService,
              private cdRef:ChangeDetectorRef,
              private serviceLog:LoginService,
              private http: HttpClient,
              private mantenedorPrepolizasService :MantenedorPrepolizasService) {
      this.columnasReg = ['solicitud', 'mto_solicitado', 'mto_pago','tipoIden', 'numIden', 'solNombre', 'acciones'];
      // Carga todos los distritos
      this.mantenedorPrepolizasService.getComboDistritoAll().then( (resp: any) => {
        this.cmbDistritoAll = resp;
        this.comboDistritoResp = this.cmbDistritoAll.slice();
      });

   }
   dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if(Globales.datosGastosSepelio.NumeroPoliza== "") {
      this.router.navigate(['/consultaPagoTercerosGS'])
    }
    if(this.datosGastosSepelio){
      if(this.datosGastosSepelio.cod_viapago=="00") {
        this.sucursal = true;
        this.tipoCta = true;
        this.banco = true;
        this.noCuenta = true;
        this.noCuentaCCI = true;
      }
      if(this.datosGastosSepelio.cod_viapago=="01") {
        this.sucursal = false;
        this.tipoCta = true;
        this.banco = true;
        this.noCuenta = true;
        this.noCuentaCCI = true;
      }
      if(this.datosGastosSepelio.cod_viapago=="02") {
        this.sucursal = true;
        this.tipoCta = false;
        this.banco = false;
        this.noCuenta = false;
        this.noCuentaCCI = false;
      }
      if(this.datosGastosSepelio.cod_viapago=="04") {
        this.sucursal = false;
        this.tipoCta = true;
        this.banco = true;
        this.noCuenta = true;
        this.noCuentaCCI = true;
      }
      if(this.datosGastosSepelio.cod_viapago=="05") {
        this.sucursal = true;
        this.tipoCta = true;
        this.banco = false;
        this.noCuenta = true;
        this.noCuentaCCI = true;
      }
      

      if(!localStorage.getItem('currentUser')) {
        this.serviceLog.verificarSesion();
      }
    }
    this.cdRef.detectChanges();
  }
  
  ngOnInit() {
    this.service.getCombos().then((res:any) => {
      this.lstBanco = res.LstBanco;
      this.lstDepartamento = res.LstDepartamento;
      this.lstSucursal = res.LstSucursal;
      this.lstTipoDocumento = res.LstTipoDocumento;
      this.lstTipoPersona = res.LstTipoPersona;
      this.lstViaPago = res.LstViaPago;
    })
    this.http.get<any[]>(this.urlPrePolizas + '/Comb?combo=PA2').subscribe(result => {
      this.cmbParentesco = result;
    }, error => console.error(error));

    this.service.getComboMoneda().then((res:any) => {
      this.cmbMoneda = res;
    });

    this.dataCabezera = Globales.datosGastosSepelio;
    this.service.cargaCabezeraGS(this.dataCabezera).then((res:any) => {
      this.infoConsulta = res;
    });
    let numRegistro = 0;
    this.service.datosGastosSepelio(Globales.datosGastosSepelio.NumeroPoliza, numRegistro).then((res:any) => {
      this.dataSource = new MatTableDataSource(res.datosLista);
      
      if(res.verificaPoliza) {
        if(res.verificaPoliza.Mensaje == "Error1") {
          Swal.fire({title: 'Advertencia',text: 'El Causante de la Póliza No se encuentra Fallecido o el Tipo de Pensión de la Póliza no tiene derecho a este Beneficio.' , icon: 'warning', allowOutsideClick: false})
          .then(
            (result) => {
              this.router.navigate(['/consultaPagoTercerosGS'])

            }
          )
        }

        if(res.verificaPoliza.Mensaje == "Error2") {
          Swal.fire({title: 'Advertencia',text: 'La fecha de Fallecimiento del Titular se encuentra fuera del pago de la Compañía de Seguros.' , icon: 'warning', allowOutsideClick: false})
          .then(
            (result) => {
              this.router.navigate(['/consultaPagoTercerosGS'])

            }
          )
        }
        this.valorAFP = res.verificaPoliza.COD_AFP;
      }
    })
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  async seleccionaTblReg(reg: any) {
    let numRegistro =  reg.indRegistro;
    this.service.datosGastosSepelio(Globales.datosGastosSepelio.NumeroPoliza, numRegistro ).then((res:any) => {
      this.dataSource = new MatTableDataSource(res.datosLista);
      if(res.cargaHistorico) {
        this.valorInfo = res.cargaHistorico.indRegistro

        this.datosGastosSepelio = res.cargaHistorico;
        res.cargaHistorico.fec_pago = res.cargaHistorico.fec_pago === '' ? '' : this._serviceFecha.formatGuion( new Date(moment(res.cargaHistorico.fec_pago).format('LLLL')) );
        res.cargaHistorico.fec_solpago = res.cargaHistorico.fec_solpago === '' ? '' : this._serviceFecha.formatGuion( new Date(moment(res.cargaHistorico.fec_solpago).format('LLLL')) );
        this.datosDireccion = res.datosDireccion;
        res.cargaHistorico.fechaEmision = res.cargaHistorico.fechaEmision === '' ? '' : this._serviceFecha.formatGuion( new Date(moment(res.cargaHistorico.fechaEmision).format('LLLL')) );
        this.datosGastosSepelio.cod_viapago = this.datosGastosSepelio.cod_viapago === '' ? '00' : this.datosGastosSepelio.cod_viapago;
        this.datosGastosSepelio.cod_sucursal = this.datosGastosSepelio.cod_sucursal === '' ? '000' : this.datosGastosSepelio.cod_sucursal;
        this.datosGastosSepelio.cod_banco = this.datosGastosSepelio.cod_banco === '' ? '00' : this.datosGastosSepelio.cod_banco;
        this.datosGastosSepelio.cod_tipcuenta = this.datosGastosSepelio.cod_tipcuenta === '' ? '00' : this.datosGastosSepelio.cod_tipcuenta;
        
        var promise = new Promise((res,rej)=>{
          this.cambiarBanco('');
          //res();
        });

        if (Number (this.datosGastosSepelio.cod_tipoidensolicita) === 1) {
          this.validaTipo = 1;
        } else {
          this.validaTipo = 0;
        }

        if(this.datosDireccion.cod_Departamento == '' || this.datosDireccion.cod_Departamento == null) {
          this.provinciaSel = "";
          this.lstProvincia = [];
          this.lstDistrito = [];
          this.datosDireccion.cod_Direccion = 0;
        } else {
          this.service.getComboProvincia(this.datosDireccion.cod_Departamento).then((res:any) => {
            this.lstProvincia = res.LstProvincia;
            this.ubigeoExp();
          });
        }

        this.datosGuardar = Object.assign({},res.cargaHistorico);
        this.valorAFP = res.verificaPoliza.COD_AFP;
      } else {
        this.datosGastosSepelio = new DatosGastosSepelio();
        this.datosDireccion = new Direccion();
        this.datosGastosSepelio.cod_viapago = this.datosGastosSepelio.cod_viapago === '' ? '00' : this.datosGastosSepelio.cod_viapago;
        this.datosGastosSepelio.cod_sucursal = this.datosGastosSepelio.cod_sucursal === '' ? '000' : this.datosGastosSepelio.cod_sucursal;
        this.datosGastosSepelio.cod_banco = this.datosGastosSepelio.cod_banco === '' ? '00' : this.datosGastosSepelio.cod_banco;
        this.datosGastosSepelio.cod_tipcuenta = this.datosGastosSepelio.cod_tipcuenta === '' ? '00' : this.datosGastosSepelio.cod_tipcuenta;
        this.datosGastosSepelio.cod_tipoidensolicita = null;
        this.datosGastosSepelio.cod_direccion = 0;
        //this.datosGastosSepelio.cod_tipoidenfun = 0;
        this.datosGastosSepelio.num_endoso = 0;
        this.lstProvincia = [];
        this.validaTipo = 0;
        this.valorAFP = res.verificaPoliza.COD_AFP;
      }

      if(res.verificaPoliza) {
        if(res.verificaPoliza.Mensaje == "Error1") {
          Swal.fire({title: 'Advertencia',text: 'El Causante de la Póliza No se encuentra Fallecido o el Tipo de Pensión de la Póliza no tiene derecho a este Beneficio.' , icon: 'warning', allowOutsideClick: false})
          .then(
            (result) => {
              this.router.navigate(['/consultaPagoTercerosGS'])

            }
          )
        }

        if(res.verificaPoliza.Mensaje == "Error2") {
          Swal.fire({title: 'Advertencia',text: 'La fecha de Fallecimiento del Titular se encuentra fuera del pago de la Compañía de Seguros.' , icon: 'warning', allowOutsideClick: false})
          .then(
            (result) => {
              this.router.navigate(['/consultaPagoTercerosGS'])

            }
          )
        }
      }
    })
  }

  seleccionDepartamento() {
    if(this.datosDireccion.cod_Departamento == "") {
      this.provinciaSel = "";
      this.lstProvincia = [];
      this.lstDistrito = [];
      this.datosDireccion.cod_Direccion = 0;
    }
    this.service.getComboProvincia(this.datosDireccion.cod_Departamento).then((res:any) => {
      this.lstProvincia = res.LstProvincia;
      this.datosDireccion.cod_Direccion = 0;
    });
  }
  
  seleccionProvincia() {
    this.mantenedorPrepolizasService.getComboDistrito(this.datosDireccion.cod_Provincia).then( (resp: any) => {
      this.cmbDistrito = resp;
      this.datosDireccion.cod_Direccion = this.cmbDistrito[0].CodDireccion;
      this.ubigeoExp();
    });
    
  }

  guardarEditar() {
    var guardaEdita:boolean = true;
    
    this.datosGuardar = Object.assign({},this.datosGastosSepelio);
    this.datosGuardar.fec_pago = this.datosGuardar.fec_pago === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.datosGuardar.fec_pago).format('LLLL')))
    
    this.datosGuardar.fec_solpago = this.datosGuardar.fec_solpago === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.datosGuardar.fec_solpago).format('LLLL')))
    this.datosGuardar.fechaEmision = this.datosGuardar.fechaEmision === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.datosGuardar.fechaEmision).format('LLLL')))
    this.datosGuardar.cod_Departamento = this.datosDireccion.cod_Departamento;
    this.datosGuardar.cod_Direccion = this.datosDireccion.cod_Direccion;
    // this.datosGuardar.cod_Distrito = this.datosDireccion.cod_Distrito;
    this.datosGuardar.cod_Provincia  =this.datosDireccion.cod_Provincia;
    this.datosGuardar.num_poliza = Globales.datosGastosSepelio.NumeroPoliza;
    this.datosGuardar.num_endoso = Globales.datosGastosSepelio.NumeroEndoso;
    let contadorInfo = this.dataSource.data.length;
    let valorInd = this.valorInfo;
    if(this.valorInfo === '0')
    {
    if(contadorInfo > 0) 
    {contadorInfo = contadorInfo +1}
    else{contadorInfo = 1}
    this.valorInfo = contadorInfo.toString();
    }
    else{ this.valorInfo = this.valorInfo}
    this.datosGuardar.indRegistro = this.valorInfo;

    let sumaValores = 0;
    let sumaValorPagado = 0;
    let i = 0;
    for(let entry of this.dataSource.data)
    {
      if(this.valorInfo !== entry.indRegistro)
      {
       sumaValores = sumaValores + entry.mto_solicitado;
       sumaValorPagado = sumaValorPagado + entry.mto_pago;
       i++;
      }
    }

    let valorPagado = Number(this.datosGuardar.mto_pago);
    sumaValorPagado = sumaValorPagado + valorPagado;

    let valorSol = Number(this.datosGuardar.mto_solicitado);
    sumaValores = sumaValores + valorSol;
  
    sumaValorPagado = this.trunc(sumaValorPagado,2)
    
    
    if(this.datosGuardar.gls_nomsolicita == ""){
      Swal.fire({title: 'Advertencia',text: 'Debe ingresar Nombre del Receptor.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if(this.datosGuardar.gls_patsolicita == ""){
      Swal.fire({title: 'Advertencia',text: 'Debe ingresar Appellido Paterno del Receptor.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if(this.datosGuardar.gls_dirsolicita == ""){
      Swal.fire({title: 'Advertencia',text: 'Debe ingresar Domicilio del Receptor.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if(this.datosGuardar.fec_solpago == ""){
      Swal.fire({title: 'Advertencia',text: 'Debe ingresar Fecha de Recepción.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if(this.datosGuardar.fec_pago == ""){
      Swal.fire({title: 'Advertencia',text: 'Debe ingresar Fecha de Pago.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    //if(new Date(moment(this.datosGastosSepelio.fec_pago).format('LLLL'))>new Date(moment(this.datosGastosSepelio.fec_solpago).format('LLLL'))){
      //Swal.fire({title: 'Advertencia',text: 'La Fecha Pago debe ser menor a la Fecha Recepción.' , icon: 'warning', allowOutsideClick: false});
      //guardaEdita = false;
      //return;
    //}
    //Este campo siempre esta deshabilitado en el sistema viejo
    // if(this.datosGuardar.mto_cobra == null){
    //   Swal.fire({title: 'Advertencia',text: 'Debe ingresar el Valor Cobrado' , icon: 'warning', allowOutsideClick: false});
    //   guardaEdita = false;
    // }
    if(this.datosGuardar.mto_pago == null){
      Swal.fire({title: 'Advertencia',text: 'Debe ingresar el Valor Pagado.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if(this.datosGuardar.mto_pago > this.datosGuardar.mto_cobra){
      Swal.fire({title: 'Advertencia',text: 'El Valor a Pagar debe ser menor al Valor Tope.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if(this.datosGuardar.num_dctopago == ""){
      Swal.fire({title: 'Advertencia',text: 'Debe ingresar el Número de Factura.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if(this.datosGuardar.num_idenfun == "" || this.datosGuardar.num_idenfun.length!=11){
      Swal.fire({title: 'Advertencia',text: 'Debe ingresar el RUC de la Empresa Funeraria.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if(this.datosGuardar.cod_viapago == "00"){
      Swal.fire({title: 'Advertencia',text: 'Debe seleccionar Forma de Pago.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }
    if( (this.datosGuardar.cod_viapago == "01" || this.datosGuardar.cod_viapago == "04") && (this.datosGuardar.cod_sucursal == "000") ) {
        Swal.fire({title: 'Advertencia',text: 'Debe seleccionar la Sucursal de la Vía de Pago.' , icon: 'warning', allowOutsideClick: false});
        guardaEdita = false;
        return;
    }
    if( (this.datosGuardar.cod_viapago === "02" || this.datosGuardar.cod_viapago === "03" || this.datosGuardar.cod_viapago === "05") && (this.datosGuardar.cod_banco === "00") ) {
      Swal.fire({title: 'Advertencia',text: 'Debe seleccionar el Banco.' , icon: 'warning', allowOutsideClick: false});
      guardaEdita = false;
      return;
    }

    if(this.datosGuardar.cod_viapago == "02") {
      if(this.datosGuardar.cod_tipcuenta=="00") {
        Swal.fire({title: 'Advertencia',text: 'Debe seleccionar el Tipo de Cuenta.' , icon: 'warning', allowOutsideClick: false});
        guardaEdita = false;
        return;
      }
      if(this.datosGuardar.num_cuenta == "" || this.datosGuardar.cod_CCI == "") {
        Swal.fire({title: 'Advertencia',text: 'Debe ingresar los Números de Cuenta.' , icon: 'warning', allowOutsideClick: false});
        guardaEdita = false;
        return;
      }
      if (!this.validaNumCuenta(this.datosGuardar.num_cuenta) || this.datosGuardar.num_cuenta.length !== Number(this.maxLengthNumCuenta)) {
        Swal.fire('Advertencia', 'Número de cuenta inválido.', 'warning');
        guardaEdita = false;
        return;
      }
    }

    if (!this.validar_email(this.datosGastosSepelio.gls_correosolicita.trim()) && this.datosGastosSepelio.gls_correosolicita.trim() !== '') {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 1', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (!this.validar_email(this.datosGastosSepelio.gls_correosolicita2.trim()) && this.datosGastosSepelio.gls_correosolicita2.trim() !== '') {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 2', icon: 'error', allowOutsideClick: false });
      return;
    }
    if (!this.validar_email(this.datosGastosSepelio.gls_correosolicita3.trim()) && this.datosGastosSepelio.gls_correosolicita3.trim() !== '') {
      Swal.fire({ title: 'ERROR', text: 'Formato inválido en Correo Electrónico 3', icon: 'error', allowOutsideClick: false });
      return;
    }
    this.datosGuardar.Usuario = localStorage.getItem('currentUser');

    //if(sumaValorPagado > this.datosGuardar.mto_cobra){
      //Swal.fire({title: 'Advertencia',text: 'El monto pagado excede el maximo del monto Tope a la Fecha de Fallecimiento' , icon: 'warning', allowOutsideClick: false});
      //guardaEdita = false;
     // return;
   // }
    if(sumaValorPagado > this.datosGastosSepelio.mto_cobra)
    {
      Swal.fire({
        title: 'El monto solicitado es mayor al monto tope correspondiente a la fecha de fallecimiento',
        text: '¿Desea aplicar el monto total correspondiente a la fecha de fallecimiento al valor a pagar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          
          let restaValorSolicitado = 0;
          let restaValorPagado = sumaValorPagado - valorPagado;
          restaValorSolicitado = this.datosGastosSepelio.mto_cobra - restaValorPagado;
          if(restaValorSolicitado <= 0)
          {
            this.datosGuardar.mto_pago  = 0;
          }
          else
          {
            //this.datosGuardar.mto_solicitado = this.datosGastosSepelio.mto_cobra;
            this.datosGuardar.mto_pago = restaValorSolicitado;
          }
          
          let poliza = this.datosGastosSepelio.num_poliza;
    let tipoPago ;
    if(this.datosGuardar.cod_viapago == '02' || this.datosGuardar.cod_viapago == '04'){
      tipoPago = 1
    }
    else{tipoPago = 0}
    let archivos: string[] = null;   
    var archivo = "";
    this.datosGuardar.mensaje = '0';
    this.service.guardarEditar(this.datosGuardar).then((resp:any) => {
      if (resp.Mensaje === 1) {
        Swal.fire('Aviso', 'Datos actualizados correctamente.', 'success');
        this.limpiar();
        this.dataSource = new MatTableDataSource();
        let numRegistro =  0;
        this.service.datosGastosSepelio(Globales.datosGastosSepelio.NumeroPoliza, numRegistro ).then((res:any) => {
          this.dataSource = new MatTableDataSource(res.datosLista);
        });
        this.service.CrearReportes(poliza, tipoPago, this.datosGuardar.num_endoso, this.datosGuardar.indRegistro, this.datosGuardar.codMoneda)
                  .then( (resp: any) => {
                    archivos = resp.result;
              
                    this.service.CrearZip(archivos)
                    .then( (resp: any) => {
                      archivo = resp.result;
                      
                      var blob = this.service.DescargarZIP(archivo).subscribe(res=>{  
                        saveAs(res,archivo);
                      }, err=>{
                      //this.titulo = "Error";
                      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
                      //this.toastr.error(this.mensaje, this.titulo);
                      //console.log(err)
                    });
                    }); 
                  });
        return;
      }

      if (resp.Mensaje === 2) {
        Swal.fire('Aviso', 'Datos insertados correctamente.', 'success');
       this.limpiar();
        this.dataSource = new MatTableDataSource();
        let numRegistro =  0;
        this.service.datosGastosSepelio(Globales.datosGastosSepelio.NumeroPoliza, numRegistro ).then((res:any) => {
          this.dataSource = new MatTableDataSource(res.datosLista);
        });
        
        this.service.CrearReportes(poliza, tipoPago, this.datosGuardar.num_endoso, this.datosGuardar.indRegistro, this.datosGuardar.codMoneda)
                  .then( (resp: any) => {
                    archivos = resp.result;
              
                    this.service.CrearZip(archivos)
                    .then( (resp: any) => {
                      archivo = resp.result;
                      
                      var blob = this.service.DescargarZIP(archivo).subscribe(res=>{  
                        saveAs(res,archivo);
                      }, err=>{
                      //this.titulo = "Error";
                      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
                      //this.toastr.error(this.mensaje, this.titulo);
                      //console.log(err)
                    });
                    }); 
                  });
        return;
      }

      if (resp.Mensaje !== 1 || resp.Mensaje !== 2) {
        Swal.fire('Error', 'Error al actualizar o insertar la información.', 'error');
        return;
      }
    });
        }
      });
    }
    else{
      let poliza = Globales.datosGastosSepelio.NumeroPoliza;
      
    let tipoPago ;
    if(this.datosGuardar.cod_viapago == '02' || this.datosGuardar.cod_viapago == '04'){
      tipoPago = 1
    }
    else{tipoPago = 0}
    let archivos: string[] = null;   
    var archivo = "";
    this.datosGuardar.mensaje = '0';
    this.service.guardarEditar(this.datosGuardar).then((resp:any) => {
      if (resp.Mensaje === 1) {
        Swal.fire('Aviso', 'Datos actualizados correctamente.', 'success');
        this.limpiar();
        this.dataSource = new MatTableDataSource();
        let numRegistro =  0;
        this.service.datosGastosSepelio(Globales.datosGastosSepelio.NumeroPoliza, numRegistro ).then((res:any) => {
          this.dataSource = new MatTableDataSource(res.datosLista);
        });
        
        this.service.CrearReportes(poliza, tipoPago, this.datosGuardar.num_endoso, this.datosGuardar.indRegistro, this.datosGuardar.codMoneda)
                  .then( (resp: any) => {
                    archivos = resp.result;
              
                    this.service.CrearZip(archivos)
                    .then( (resp: any) => {
                      archivo = resp.result;
                      
                      var blob = this.service.DescargarZIP(archivo).subscribe(res=>{  
                        saveAs(res,archivo);
                      }, err=>{
                      //this.titulo = "Error";
                      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
                      //this.toastr.error(this.mensaje, this.titulo);
                      //console.log(err)
                    });
                    }); 
                  });
        return;
      }

      if (resp.Mensaje === 2) {
        Swal.fire('Aviso', 'Datos insertados correctamente.', 'success');
        this.limpiar();
        this.dataSource = new MatTableDataSource();
        let numRegistro =  0;
        this.service.datosGastosSepelio(Globales.datosGastosSepelio.NumeroPoliza, numRegistro ).then((res:any) => {
          this.dataSource = new MatTableDataSource(res.datosLista);
        });
        this.service.CrearReportes(poliza, tipoPago, this.datosGuardar.num_endoso, this.datosGuardar.indRegistro, this.datosGuardar.codMoneda)
                  .then( (resp: any) => {
                    archivos = resp.result;
              
                    this.service.CrearZip(archivos)
                    .then( (resp: any) => {
                      archivo = resp.result;
                      
                      var blob = this.service.DescargarZIP(archivo).subscribe(res=>{  
                        saveAs(res,archivo);
                      }, err=>{
                      //this.titulo = "Error";
                      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
                      //this.toastr.error(this.mensaje, this.titulo);
                      //console.log(err)
                    });
                    }); 
                  });
        return;
      }

      if (resp.Mensaje !== 1 || resp.Mensaje !== 2) {
        Swal.fire('Error', 'Error al actualizar o insertar la información.', 'error');
        return;
      }
    });
    }
    
  }

  fechaPagoChange(event) {
    var fecha = event === '' ? '' : this._serviceFecha.formatBD(new Date(moment(event).format('LLLL')))
    var numPoliza = Globales.datosGastosSepelio.NumeroPoliza;
    var numEndoso = Globales.datosGastosSepelio.NumeroEndoso;
      this.service.moneda(fecha, numPoliza, numEndoso).then((resp:any) => {
        this.datosGastosSepelio.mto_cobra = resp.tipoMoneda;
      });
  }

  cerrarModalTel() {

    this.validarTelefonos();
    (<any>$('#modalTelefonos')).modal('hide');
  }

  validarTelefonos() {
    if (this.datosGastosSepelio.gls_fonosolicita3 !== '') {
      if (this.datosGastosSepelio.gls_fonosolicita3.length < 7) {
        this.datosGastosSepelio.gls_fonosolicita3 = "";
      }
      if (this.datosGastosSepelio.gls_fonosolicita3.length > 9) {
        this.datosGastosSepelio.gls_fonosolicita3 = "";
      }
    }

    if (this.datosGastosSepelio.gls_fonosolicita2 !== '') {
      if (this.datosGastosSepelio.gls_fonosolicita2.length < 7) {
        this.datosGastosSepelio.gls_fonosolicita2 = "";
      }
      if (this.datosGastosSepelio.gls_fonosolicita2.length > 9) {
        this.datosGastosSepelio.gls_fonosolicita2 = "";
      }
    }

    if (this.datosGastosSepelio.gls_fonosolicita !== '') {
      if (this.datosGastosSepelio.gls_fonosolicita.length < 7) {
        this.datosGastosSepelio.gls_fonosolicita = "";
      }
      if (this.datosGastosSepelio.gls_fonosolicita.length > 9) {
        this.datosGastosSepelio.gls_fonosolicita = "";
      }
    }
  }

  aceptarModalTel(){
    var valido = true;
    if (this.datosGastosSepelio.gls_fonosolicita3 !== '') {
      if (this.datosGastosSepelio.gls_fonosolicita3.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.datosGastosSepelio.gls_fonosolicita3.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.datosGastosSepelio.gls_fonosolicita2 !== '') {
      if (this.datosGastosSepelio.gls_fonosolicita2.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.datosGastosSepelio.gls_fonosolicita2.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }

    if (this.datosGastosSepelio.gls_fonosolicita !== '') {
      if (this.datosGastosSepelio.gls_fonosolicita.length < 7) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 1 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
      if (this.datosGastosSepelio.gls_fonosolicita.length > 9) {
        Swal.fire({ title: 'Advertencia', text: 'El teléfono 1 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
        valido = false;
      }
    }
    if(valido == true){
      (<any>$('#modalTelefonos')).modal('hide');
    }
  }

  // Función para Bancos(llena el combo de Tipos de Cuenta según el Banco seleccionado y limpia campos si la bandera es 'elegir').
  async cambiarBanco(bandera: string) {
    this.datosGastosSepelio.cod_tipcuenta = bandera === 'elegir' ? '00' : this.datosGastosSepelio.cod_tipcuenta;
    this.datosGastosSepelio.num_cuenta = bandera === 'elegir' ? '' : this.datosGastosSepelio.num_cuenta;
    this.datosGastosSepelio.cod_CCI = bandera === 'elegir' ? '' : this.datosGastosSepelio.cod_CCI;

    await this.http.get<any[]>(this.urlPrePolizas + '/CmbTipoCuenta?pCodBanco=' + this.datosGastosSepelio.cod_banco).subscribe(result => {
        this.lstTipoCuenta = result;
        this.cambiarTipoCuenta(bandera);
    }, error => console.error(error));
  }

  // Función para Tipos de Cuenta(genera y valida los formatos de cada Tipo de Cuenta y limpia campos si la bandera es 'elegir').
  async cambiarTipoCuenta(bandera: string) {
    let contX = 0;
    this.datosGastosSepelio.num_cuenta = bandera === 'elegir' ? '' : this.datosGastosSepelio.num_cuenta;
    this.datosGastosSepelio.cod_CCI = bandera === 'elegir' ? '' : this.datosGastosSepelio.cod_CCI;

    if (this.datosGastosSepelio.cod_tipcuenta !== '' && this.datosGastosSepelio.cod_tipcuenta !== '00') {
      this.maxLengthNumCuenta = this.lstTipoCuenta.find(item => item.COD_CUENTA === this.datosGastosSepelio.cod_tipcuenta).NUM_DIGITOS;
      this.arrayNumCuenta = this.lstTipoCuenta.find(item => item.COD_CUENTA === this.datosGastosSepelio.cod_tipcuenta).NUM_CUENTA.split('X');

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

  // Función para validar los formatos de Números de Cuenta según el Tipo de Cuenta seleccionado al momento de Guardar.
  validaNumCuenta(pNumCuenta) {
    return this.regexNumCuenta.test(pNumCuenta) ? true : false;
  }

  // Función para el combo de Vía de Pago, para limpiar los campos.
  cambiarViaPago() {
    this.datosGastosSepelio.cod_sucursal = this.datosGastosSepelio.cod_viapago === '04' ? this.valorAFP : '000';
    this.datosGastosSepelio.cod_banco = '00';
    this.datosGastosSepelio.cod_tipcuenta = '00';
    this.datosGastosSepelio.num_cuenta = '';
    this.datosGastosSepelio.cod_CCI = '';
  }

  // Función para el combo de Sucursal, para limpiar los campos.
  cambiarSucursal() {
    this.datosGastosSepelio.cod_banco = '00';
    this.datosGastosSepelio.cod_tipcuenta = '00';
  }

  getInfo(codDir) {
    this.mantenedorPrepolizasService.getComboProvinciaAll(codDir).then( (resp: any) => {
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
      this.lstProvincia = listaLlenado;

      this.mantenedorPrepolizasService.getProvinciaUnica(codDir).then( (resp: any) => {
        this.datosDireccion.cod_Provincia = resp[0].CodProvincia;
        this.datosDireccion.cod_Departamento = resp[0].CodRegion.toString();
        this.ubigeoExp();
      });
   });
  }

  ubigeoExp() {
    if (this.datosDireccion.cod_Direccion !== 0) {
      for (const i in this.lstDepartamento) {
        if (this.datosDireccion.cod_Departamento === this.lstDepartamento[i].codigo) {
          this.dep = this.lstDepartamento[i].descripcion;
        }
      }
      for (const i in this.lstProvincia) {
        if (this.datosDireccion.cod_Provincia === this.lstProvincia[i].codigo) {
          this.prov = this.lstProvincia[i].descripcion;
        }
      }
      // tslint:disable-next-line:forin
      for (const i in this.cmbDistritoAll) {
        const var1 = Number(this.datosDireccion.cod_Direccion);
        const var2 = Number(this.cmbDistritoAll[i].CodDireccion);
        if (var1 === var2) {
          const slip = this.cmbDistritoAll[i].GlsDistrito;
          this.dis = slip.split(' - ', 1);
        }
      }
      this.direccionStr = this.dep + '-' + this.prov + '-' + this.dis;
    }
  }

  cambiarTipo(){
    const tipoDoc = Number(this.datosGastosSepelio.cod_tipoidensolicita);
    this.datosGastosSepelio.num_idensolicita = '';
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

  checkType(event): boolean  {
    if (Number(this.validaTipo) === 1) {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    } else {
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

  validar_email(email) {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  aceptarModalCorreos() {
    var valido = true;
    if (this.datosGastosSepelio.gls_correosolicita3 !== '') {
      const valEmail = this.validar_email(this.datosGastosSepelio.gls_correosolicita3);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 3 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.datosGastosSepelio.gls_correosolicita2 !== '') {
      const valEmail = this.validar_email(this.datosGastosSepelio.gls_correosolicita2);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 2 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (this.datosGastosSepelio.gls_correosolicita !== '') {
      const valEmail = this.validar_email(this.datosGastosSepelio.gls_correosolicita);
      if (!valEmail) {
        Swal.fire('Error', 'El correo electrónico 1 no tiene formato válido.', 'error');
        valido = false;
      }
    }

    if (valido == true) {
      (<any>$('#modalCorreos')).modal('hide');
    }
  }

  cerrarModalCorreos() {
    this.aceptarModalCorreos();
    (<any>$('#modalCorreos')).modal('hide') ;
  }

  exportar(){
    var archivo = "";
    var poliza = Globales.datosGastosSepelio.NumeroPoliza
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

   // Limpiar campos de la pantalla
  limpiar() {
    this.datosGastosSepelio = {
      cod_banco: "00",
    cod_conpago: "",
    cod_direccion: 0,
    cod_sucursal: "000",
    cod_tipcuenta: "00",
    cod_tipodctopago: "",
    //cod_tipoidenfun: null,
    cod_tipoidensolicita: null,
    cod_tipopersona: "",
    cod_viapago: "00",
    fec_pago: "",
    fec_solpago:"",
    gls_correosolicita: "",
    gls_correosolicita2:"",
    gls_correosolicita3: "",
    gls_dirsolicita:"",
    gls_fonosolicita: "",
    gls_fonosolicita2:"",
    gls_fonosolicita3: "",
    gls_matsolicita: "",
    gls_nomsegsolicita: "",
    gls_nomsolicita: "",
    gls_patsolicita: "",
    mto_cobra: null,
    mto_pago: null,
    num_cuenta: "",
    num_dctopago: "",
    num_endoso: null,
    num_idenfun: "",
    num_idensolicita: "",
    num_poliza: this.datosGastosSepelio.num_poliza,
    cod_CCI:  "",
    cod_Departamento: "",
    cod_Distrito:  "",
    cod_Provincia: "",
    cod_Direccion: null,
    fechaEmision: "",
    mto_solicitado: null,
    codMoneda: "00",
    mensaje: "",
    CodPar: "00",
    indRegistro: "0",
    Usuario: "",
    };
    this.valorInfo = '0';
    this.direccionStr = '';
    this.dep = '';
    this.prov = '';
    this.dis = '';
    this.datosDireccion = {
    cod_Departamento: "",
    cod_Distrito: "",
    cod_Provincia: "",
    cod_Direccion: 0,
    };
  }

  trunc (x, posiciones) {
    var s = x.toString()
    var l = s.length
    var decimalLength = s.indexOf('.') + 1
    var numStr = s.substr(0, decimalLength + posiciones)
    return Number(numStr)
  }
}
