import { Component, OnInit, ViewChild, ChangeDetectorRef, ɵConsole } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { Router } from '@angular/router';
import { ConsultaGeneralObj, ConsultaPolizaDatosPoliza, EnsososSimplesDatosBeneficiario, EndososSimplesyActuarialesGuardar, BeneficiarioEditado } from 'src/interfaces/consultaGeneral.model';
import { ConsultaPolizaServiceService } from 'src/providers/consulta-poliza-service.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import * as $AB from 'jquery';

import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import Swal from 'sweetalert2';
import { flatMap } from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Login } from 'src/interfaces/login.model';
import { saveAs } from 'file-saver';
import { AppConsts } from '../../AppConst';
import { HttpClient } from '@angular/common/http';
import { MantenedorPrepolizasService } from 'src/providers/mantenedorPrePolizas.service';
import { isNull } from 'util';

@Component({
  selector: 'app-mantenedor-endosos-simples-actuariales',
  templateUrl: './mantenedor-endosos-simples-actuariales.component.html',
  styleUrls: ['./mantenedor-endosos-simples-actuariales.component.css']
})
export class MantenedorEndososSimplesActuarialesComponent implements OnInit {

  private url = AppConsts.baseUrl + 'mantenedorprepolizas';
  TipoNumIdent="";

  consulta: ConsultaGeneralObj = new ConsultaGeneralObj();
  objetoGuardar: EndososSimplesyActuarialesGuardar = new EndososSimplesyActuarialesGuardar();
  objetoBeneficiarios: EnsososSimplesDatosBeneficiario = new EnsososSimplesDatosBeneficiario();
  fechaEfecto;
  FechaSolicitudEndoso;
  FechaRentaVitalicia;
  estadoSinCambios:any;
  columnasBeneficiarios = [];
  columnasResumen = [];
  lstTipoPension = [];
  lstTipoEndoso = [];
  lstCausaEndoso = [];
  lstTipoRenta = [];
  lstModalidad = [];
  lstEstadoVigencia = [];
  lstGenero = [];
  lstParentesco = [];
  lstGpoFamiliar = [];
  lstSitInv = [];  
  lstDerPension = [];
  cmbTipoIdent = [];
  datosPolizaOriginal : any;
  datosPolizaOriginalTmp : any;
  estadoOriginalBeneficiarios = [];
  listaNuevosBeneficiarios = [];
  arregloBeneficiarios = [];
  arregloBeneficiariosTemporal = [];
  lstBeneficiariosConsulta = [];
  NombreCompleto = "";
  glCausaEndoso = "";
  glBsqueda = ""
  estadoSC = [];
  estadoSR = [];
  VariableGlobalPoliza = [];
  TituloModal = "";
  CuerpoModal = "";
  maxLengthNumDocBen = '8'
  isDisabled: boolean;
  modalisDisabled: boolean;
  modalisDisabledfechanhm : boolean;
  mostrarRes: boolean;
  mostrarResP: boolean;
  iniEndoso: boolean;
  editarDatosPoliza: boolean;
  editarEndoso: boolean;
  cambios: boolean;
  agregar: boolean;
  editar:boolean;
  tipoEndosoRes:boolean;
  causaEndosoRes:boolean;
  observacionRes:boolean;
  tipoPensionRes:boolean;
  tipoRentaRes:boolean;
  modalidadRes:boolean;
  estadoVigenciaRes:boolean;
  noBeneficiariosRes:boolean;
  periodoVigenciaRes:boolean;
  fechaDevengueRes:boolean;
  aniosEscalRes:boolean;
  porcEscalRes:boolean;
  indCobRes:boolean;
  montoPrimaRes:boolean;
  montoPensionRes:boolean;
  coberturaConyRes:boolean;
  tasaVentaRes:boolean;
  tasaEquivRes:boolean;
  aniosDiferidosRes:boolean;
  aniosGarantizadosRes:boolean;
  derCrecerRes:boolean;
  gratificacionRes:boolean;
  btnAgregaBen: boolean;
  FechaNacimiento: boolean;
  Ben_Pol: boolean;
  DerPension:boolean;
  FechaFallec:boolean;
  FechaEfecto:boolean;
  Invalidez:boolean;
  PensionGar:boolean;
  Pension:boolean;
  BtnEditar:boolean;
  IdModal:boolean;
  PanelPoliza:boolean;
  PanelBeneficiarios:boolean;
  PanelResumen:boolean;
  iGlobal = 0;
  ModalEliminar:boolean;
  ModalDescartar:boolean;
  TipoMoneda = "";
  arregloNuevo = [];
  temporal = 0;
  btnCalcular: boolean;
  FechaSolicitud:boolean;
  fecRenta: boolean;
  fecRentaBtn: boolean;
  btnPre: boolean;
  opcionDir = 'Exp';
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
  direccionStrBen: any;
  dirCorrStrBen: any;
  modalisDisabledDCrecer: boolean;
  modalisDisabledFecMat: boolean;
  InvalidezCausa: boolean;
  InvalidezFec: boolean;

  public cmbDistrito: any[];
  public cmbDistritoBen: any[];
  public cmbDepartamento: any[];
  public cmbProvincia: any[];
  public cmbDistrito2: any[];
  public cmbDepartamento2: any[];
  public cmbProvincia2: any[];
  public cmbProvinciaBen: any[];
  public cmbDistrito2Ben: any[];
  public cmbProvincia2Ben: any[];
  public cmbDistritoAll: any[];
  public cmbDistritoAll2: any[];
  comboDistritoResp = [];
  comboDistrito2Resp = [];
  public lista: any[];
  public lista2: any[];
  
  direccionStrs: any = {
    DireccionStr: '',
    DirCorrStr: ''
  };

  direccionStr: any;
  dirCorrStr: any;
 
  pruebaTipoEnd = 'S';

  datosPoliza: ConsultaPolizaDatosPoliza = new ConsultaPolizaDatosPoliza();
  datosPolizaActuales:ConsultaPolizaDatosPoliza = new ConsultaPolizaDatosPoliza();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('cambiosSinGuardar', { static: true }) modalSG: any;
  constructor(private router: Router, private cdRef: ChangeDetectorRef, public titleService: Title, private service: ConsultaPolizaServiceService, private serviceFecha: ServiciofechaService, private http: HttpClient, private prePolizasService: MantenedorPrepolizasService,) {
    this.http.get<any[]>(this.url + '/CmbDepartamento').subscribe(result => {
      this.cmbDepartamento = result;
      this.cmbDepartamento2 = result;
    }, error => console.error(error));

    this.columnasBeneficiarios = ['item', 'tipoIdentificacion', 'apellidosNombres', 'genero', 'fechaNac', 'parentesco', 'mtoPension', 'acciones']
    this.columnasResumen = ['item', 'identificacion', 'apellidosNombres', 'genero', 'fechaNac', 'parentesco', 'gpoFamiliar','causaInvalidez','sitInv','fechaInv','fechaNHM','fechaMat','dCrecer','porcPension','montoPension','estatus']
  }
  dataSourceResumen: MatTableDataSource<any> = new MatTableDataSource(null);
  dataSourceBeneficiarios: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    this.isDisabled = true;
    this.mostrarRes = false;
    this.mostrarResP = false;
    this.iniEndoso = false;
    this.modalisDisabled = false;
    this.modalisDisabledfechanhm = true;
    this.editarDatosPoliza = true;
    this.editarEndoso = true;
    this.btnAgregaBen = false;
    this.FechaNacimiento = true;
    this.Ben_Pol = true;
    this.DerPension = true;
    this.FechaFallec = true;
    this.Invalidez = true;
    this.PensionGar = true;
    this.Pension = true;
    this.BtnEditar = false;
    this.IdModal = false;
    this.PanelPoliza = true;
    this.PanelBeneficiarios = false;
    this.PanelResumen = false;
    this.ModalEliminar = false;
    this.ModalDescartar = false;
    this.FechaEfecto = true;
    this.FechaSolicitud = true;
    this.btnCalcular = false;
    this.btnPre  = false;
    this.fecRenta = false;
    this.fecRentaBtn = false;
    this.modalisDisabledDCrecer = false;
    this.modalisDisabledFecMat = false;
    this.InvalidezCausa = false;
    this.InvalidezFec = false;

    //console.log(Globales.datosEndososSimplesActuariales.NumeroPoliza, Globales.datosEndososSimplesActuariales.NoEndoso);
    this.getCombo();
    if (Globales.datosEndososSimplesActuariales.NumeroPoliza != 0 && Globales.datosEndososSimplesActuariales.NoEndoso != 0) {
      Globales.titlePag = 'Mantenedor de Endosos Simples y Actuariales';
      this.titleService.setTitle(Globales.titlePag);
      this.consulta.NumeroPoliza = Globales.datosEndososSimplesActuariales.NumeroPoliza.toString();
      this.consulta.NoEndoso = Globales.datosEndososSimplesActuariales.NoEndoso;
      this.consultaPoliza();
    }

  }

  ngAfterViewChecked() {
    if (Globales.datosEndososSimplesActuariales.NumeroPoliza == 0 && Globales.datosEndososSimplesActuariales.NoEndoso == 0) {
      this.router.navigate(['/consultaPoliza'])
    }
    if(this.mostrarRes){
      this.datosPolizaActuales;
      this.datosPoliza;

      if(this.datosPolizaActuales.IdTipoEndoso != this.datosPoliza.IdTipoEndoso){
        this.tipoEndosoRes = true;
      }
      else{
        this.tipoEndosoRes = false;
      }

      if(this.datosPolizaActuales.IdCausaEndoso != this.datosPoliza.IdCausaEndoso){
        this.causaEndosoRes = true;
      }
      else{
        this.causaEndosoRes = false;
      }

      if(this.datosPolizaActuales.IdPension != this.datosPoliza.IdPension){
        this.tipoPensionRes = true;
      }
      else{
        this.tipoPensionRes = false;
      }

      if(this.datosPolizaActuales.IdTipoRenta != this.datosPoliza.IdTipoRenta){
        this.tipoRentaRes = true;
      }
      else{
        this.tipoRentaRes = false;
      }

      if(this.datosPolizaActuales.IdModalid != this.datosPoliza.IdModalid){
        this.modalidadRes = true;
      }
      else{
        this.modalidadRes = false;
      }

      if(this.datosPolizaActuales.IdEstadoVigencia != this.datosPoliza.IdEstadoVigencia){
        this.estadoVigenciaRes = true;
      }
      else{
        this.estadoVigenciaRes = false;
      }

      if(this.datosPolizaActuales.NumBeneficiarios != this.datosPoliza.NumBeneficiarios){
        this.noBeneficiariosRes = true;
      }
      else{
        this.noBeneficiariosRes = false;
      }

  // observacionRes:boolean;

      if(this.datosPolizaActuales.IniVigencia != this.datosPoliza.IniVigencia || this.datosPolizaActuales.FinVigencia != this.datosPoliza.FinVigencia){
        this.periodoVigenciaRes = true;
      }
      else{
        this.periodoVigenciaRes = false;
      }

      if(this.datosPolizaActuales.FechaDevengue != this.datosPoliza.FechaDevengue ){
        this.fechaDevengueRes = true;
      }
      else{
        this.fechaDevengueRes = false;
      }

      if(this.datosPolizaActuales.Escal1Tramo != this.datosPoliza.Escal1Tramo ){
        this.aniosEscalRes = true;
      }
      else{
        this.aniosEscalRes = false;
      }

      if(this.datosPolizaActuales.RentaEsc2Tramo != this.datosPoliza.RentaEsc2Tramo ){
        this.porcEscalRes = true;
      }
      else{
        this.porcEscalRes = false;
      }

      if(this.datosPolizaActuales.IndCovertura != this.datosPoliza.IndCovertura ){
        this.indCobRes = true;
      }
      else{
        this.indCobRes = false;
      }

      if(this.datosPolizaActuales.MontoPrima != this.datosPoliza.MontoPrima ){
        this.montoPrimaRes = true;
      }
      else{
        this.montoPrimaRes = false;
      }

      if(this.datosPolizaActuales.MontoPension != this.datosPoliza.MontoPension ){
        this.montoPensionRes = true;
      }
      else{
        this.montoPensionRes = false;
      }

      if(this.datosPolizaActuales.CoberConyuge != this.datosPoliza.CoberConyuge ){
        this.coberturaConyRes = true;
      }
      else{
        this.coberturaConyRes = false;
      }

      if(this.datosPolizaActuales.TasaVenta != this.datosPoliza.TasaVenta ){
        this.tasaVentaRes = true;
      }
      else{
        this.tasaVentaRes = false;
      }

      if(this.datosPolizaActuales.TasaEquivalente != this.datosPoliza.TasaEquivalente ){
        this.tasaEquivRes = true;
      }
      else{
        this.tasaEquivRes = false;
      }

      if(this.datosPolizaActuales.Diferidos != this.datosPoliza.Diferidos ){
        this.aniosDiferidosRes = true;
      }
      else{
        this.aniosDiferidosRes = false;
      }

      if(this.datosPolizaActuales.Garantizados != this.datosPoliza.Garantizados ){
        this.aniosGarantizadosRes = true;
      }
      else{
        this.aniosGarantizadosRes = false;
      }

      if(this.datosPolizaActuales.DerCrecer != this.datosPoliza.DerCrecer ){
        this.derCrecerRes = true;
      }
      else{
        this.derCrecerRes = false;
      }

      if(this.datosPolizaActuales.Gratificacion != this.datosPoliza.Gratificacion ){
        this.gratificacionRes = true;
      }
      else{
        this.gratificacionRes = false;
      }

        // Comparación de arreglos de beneficiarios

          this.arregloNuevo = [];
          var ind:number = -1;
          if(this.estadoOriginalBeneficiarios.length == this.listaNuevosBeneficiarios.length){
            //console.log(this.estadoOriginalBeneficiarios);
            //console.log(this.listaNuevosBeneficiarios);
            //console.log(this.arregloNuevo);
            
            for (let i = 0; i < this.estadoOriginalBeneficiarios.length; i++) {
              var index = this.estadoOriginalBeneficiarios.indexOf(this.estadoOriginalBeneficiarios.find(x=>x.Orden == this.listaNuevosBeneficiarios[i].Orden))

              if(index == -1){

                for (let ind = 0; ind < this.arregloNuevo.length; ind++) {
                   ind = this.arregloNuevo.indexOf(this.arregloNuevo.find(x=> x.Orden == this.listaNuevosBeneficiarios[i].Orden))
                   if(ind == -1){
                    //no existe
                    var registro = JSON.parse(JSON.stringify(this.estadoOriginalBeneficiarios[i]));
                    registro.Estado = "Agregado"
                    this.arregloNuevo.push(registro);
                   }
                   else{
                    //this.listaNuevosBeneficiarios[i].FechaInv = this.listaNuevosBeneficiarios[i].FechaInv = "01/01/1900" ? null : this.listaNuevosBeneficiarios[i].FechaInv;
                    //this.listaNuevosBeneficiarios[i].FechaNHM = this.listaNuevosBeneficiarios[i].FechaNHM = "01/01/1900" ? null : this.listaNuevosBeneficiarios[i].FechaNHM;
                    //this.listaNuevosBeneficiarios[i].FechaMatrimonio = this.listaNuevosBeneficiarios[i].FechaMatrimonio = "01/01/1900" ? null : this.listaNuevosBeneficiarios[i].FechaMatrimonio;
                    //this.listaNuevosBeneficiarios[i].FechaFallecimiento = this.listaNuevosBeneficiarios[i].FechaFallecimiento = "01/01/1900" ? null : this.listaNuevosBeneficiarios[i].FechaFallecimiento;
                     var comparacion = this.comparaObjetos(this.estadoOriginalBeneficiarios[ind],this.listaNuevosBeneficiarios[i])
                     if(comparacion == true){
                      var registro = JSON.parse(JSON.stringify(this.listaNuevosBeneficiarios[i]));
                      registro.Estado = "Editado"
                      this.arregloNuevo.push(registro);
                     }
                   }

                }
              }
              else{
                //this.listaNuevosBeneficiarios[i].FechaInv = this.listaNuevosBeneficiarios[i].FechaInv == "01/01/1900" ? null: this.listaNuevosBeneficiarios[i].FechaInv;
                //this.listaNuevosBeneficiarios[i].FechaNHM = this.listaNuevosBeneficiarios[i].FechaNHM == "01/01/1900" ? null: this.listaNuevosBeneficiarios[i].FechaNHM;
                //this.listaNuevosBeneficiarios[i].FechaMatrimonio = this.listaNuevosBeneficiarios[i].FechaMatrimonio == "01/01/1900" ? null: this.listaNuevosBeneficiarios[i].FechaMatrimonio;
                //this.listaNuevosBeneficiarios[i].FechaFallecimiento = this.listaNuevosBeneficiarios[i].FechaFallecimiento == "01/01/1900" ? null: this.listaNuevosBeneficiarios[i].FechaFallecimiento;
                var comparacion = this.comparaObjetos(this.estadoOriginalBeneficiarios[index],this.listaNuevosBeneficiarios[i]);
                if(comparacion.editado == true){
                  var registro = this.listaNuevosBeneficiarios[i];
                  registro.Estado = "Editado"
                  this.arregloNuevo.push(registro);
                  //console.log(this.estadoOriginalBeneficiarios[index]);
                  //console.log(this.listaNuevosBeneficiarios[i]);


                 }
                //compara cambios

              }
            }
            for (let i = 0; i < this.listaNuevosBeneficiarios.length; i++) {
              var index = this.listaNuevosBeneficiarios.indexOf(this.listaNuevosBeneficiarios.find(x=>x.Orden == this.estadoOriginalBeneficiarios[i].Orden))
              if(index == -1){

                //console.log(this.listaNuevosBeneficiarios[i], "no existe");
                var registro = JSON.parse(JSON.stringify(this.estadoOriginalBeneficiarios[i]));
                    registro.Estado = "Eliminado"
                    this.arregloNuevo.push(registro);
              }
              else{
                //existe
                if(this.listaNuevosBeneficiarios[i]){}

                //arregloNuevo.push(this.listaNuevosBeneficiarios[i]);
              }

              var index = this.estadoOriginalBeneficiarios.indexOf(this.estadoOriginalBeneficiarios.find(x=>x.Orden == this.listaNuevosBeneficiarios[i].Orden))
              if(index==-1){
                var registro = JSON.parse(JSON.stringify(this.listaNuevosBeneficiarios[i]));
                    registro.Estado = "Agregado";
                    this.arregloNuevo.push(registro);
              }
              else{

              }
            }

          }
          else if(this.estadoOriginalBeneficiarios.length>this.listaNuevosBeneficiarios.length){
            //al eliminar

            for (let i = 0; i < this.estadoOriginalBeneficiarios.length; i++) {
              var index = this.listaNuevosBeneficiarios.indexOf(this.listaNuevosBeneficiarios.find(x=>x.Orden == this.estadoOriginalBeneficiarios[i].Orden))
              if(index == -1){
                var registro = JSON.parse(JSON.stringify(this.estadoOriginalBeneficiarios[i]));
                    registro.Estado = "Eliminado"
                    this.arregloNuevo.push(registro);
              }else{
                //console.log("se mantiene");
                //verifica cambios
                //arregloNuevo.push(this.listaNuevosBeneficiarios[i]);
                //this.listaNuevosBeneficiarios[index].FechaInv = this.listaNuevosBeneficiarios[index].FechaInv == "01/01/1900" ? null : this.listaNuevosBeneficiarios[index].FechaInv;
                //this.listaNuevosBeneficiarios[index].FechaNHM = this.listaNuevosBeneficiarios[index].FechaNHM == "01/01/1900" ? null : this.listaNuevosBeneficiarios[index].FechaNHM;
                //this.listaNuevosBeneficiarios[index].FechaMatrimonio = this.listaNuevosBeneficiarios[index].FechaMatrimonio == "01/01/1900" ? null : this.listaNuevosBeneficiarios[index].FechaMatrimonio;
                //this.listaNuevosBeneficiarios[index].FechaFallecimiento = this.listaNuevosBeneficiarios[index].FechaFallecimiento == "01/01/1900" ? null : this.listaNuevosBeneficiarios[index].FechaFallecimiento;
                var comparacion = this.comparaObjetos(this.estadoOriginalBeneficiarios[i],this.listaNuevosBeneficiarios[index])
                     if(comparacion == true){
                      var registro = JSON.parse(JSON.stringify(this.listaNuevosBeneficiarios[index]));
                      registro.Estado = "Editado"
                      this.arregloNuevo.push(registro);
                     }

              }
            }
          }
          else if(this.estadoOriginalBeneficiarios.length<this.listaNuevosBeneficiarios.length){
            //al agregar
            for (let i = 0; i < this.listaNuevosBeneficiarios.length; i++) {
              var index = this.estadoOriginalBeneficiarios.indexOf(this.estadoOriginalBeneficiarios.find(x=>x.Orden == this.listaNuevosBeneficiarios[i].Orden ));
              if(index==-1){
                //console.log("este es nuevo", this.listaNuevosBeneficiarios[i]);
                var registro = JSON.parse(JSON.stringify(this.listaNuevosBeneficiarios[i]));
                      registro.Estado = "Agregado"
                      this.arregloNuevo.push(registro);
              }
              else{
                //console.log("este ya estaba");
                //arregloNuevo.push(this.listaNuevosBeneficiarios[i]);
                //this.listaNuevosBeneficiarios[i].FechaInv = this.listaNuevosBeneficiarios[i].FechaInv == "01/01/1900" ? null : this.listaNuevosBeneficiarios[i].FechaInv;
                //this.listaNuevosBeneficiarios[i].FechaNHM = this.listaNuevosBeneficiarios[i].FechaNHM == "01/01/1900" ? null : this.listaNuevosBeneficiarios[i].FechaNHM;
                //this.listaNuevosBeneficiarios[i].FechaMatrimonio = this.listaNuevosBeneficiarios[i].FechaMatrimonio == "01/01/1900" ? null : this.listaNuevosBeneficiarios[i].FechaMatrimonio;
                //this.listaNuevosBeneficiarios[i].FechaFallecimiento = this.listaNuevosBeneficiarios[i].FechaFallecimiento == "01/01/1900" ? null : this.listaNuevosBeneficiarios[i].FechaFallecimiento;
                var comparacion = this.comparaObjetos(this.estadoOriginalBeneficiarios[index],this.listaNuevosBeneficiarios[i])
                     if(comparacion == true){
                      var registro = JSON.parse(JSON.stringify(this.listaNuevosBeneficiarios[i]));
                      registro.Estado = "Editado"
                      this.arregloNuevo.push(registro);
                     }
              }

            }
          }
        for (let i = 0; i < this.arregloNuevo.length; i++) {
          if(this.arregloNuevo[i].Estado != "Editado"){
            var beneficiarioEditado:BeneficiarioEditado = new BeneficiarioEditado();
            this.arregloNuevo[i].editados = beneficiarioEditado;
          }

        }
        //console.log(this.estadoOriginalBeneficiarios);
        //console.log(this.listaNuevosBeneficiarios);
        this.dataSourceResumen = new MatTableDataSource(this.arregloNuevo);
        //console.log(this.arregloNuevo);

        // var index = this.unidades[i].areas.indexOf(this.unidades[i].areas.find(x=>x.id == area));

        //console.log(this.estadoOriginalBeneficiarios,this.listaNuevosBeneficiarios);



        //Termina comparacion de arreglos de beneficiarios



    }
    else{
      this.dataSourceResumen = new MatTableDataSource([]);
    }

    this.cdRef.detectChanges();
  }
  comparaObjetos(arr1, arr2){
    // if(arr1.Orden == arr2){}
    var editado:boolean = false;
    var beneficiarioEditado:BeneficiarioEditado = new BeneficiarioEditado();
    arr2.editados = beneficiarioEditado;
    if(arr1.IdTipoIden != arr2.IdTipoIden){ editado = true; arr2.editados.IdTipoIden = true}
    if(arr1.NoIden != arr2.NoIden){ editado = true; arr2.editados.NoIden = true}
    if(arr1.Nombre != arr2.Nombre){ editado = true; arr2.editados.Nombre = true}
    if(arr1.SegundoNom != arr2.SegundoNom){ editado = true; arr2.editados.SegundoNom = true}
    if(arr1.Paterno != arr2.Paterno){ editado = true; arr2.editados.Paterno = true}
    if(arr1.Materno != arr2.Materno){ editado = true; arr2.editados.Materno = true}
    if(arr1.IdGenero != arr2.IdGenero){ editado = true; arr2.editados.IdGenero = true}
    if(arr1.FechaNac != arr2.FechaNac){ editado = true; arr2.editados.FechaNac = true}
    if(arr1.IdParentesco != arr2.IdParentesco){ editado = true; arr2.editados.IdParentesco = true}
    if(arr1.IdGpoFam != arr2.IdGpoFam){ editado = true; arr2.editados.IdGpoFam = true}
    if(arr1.IdCausaInv != arr2.IdCausaInv){ editado = true; arr2.editados.IdCausaInv = true}
    if(arr1.IdSitInv != arr2.IdSitInv){ editado = true; arr2.editados.IdSitInv = true}
    if(arr1.FechaInv != arr2.FechaInv){ editado = true; arr2.editados.FechaInv = true}
    if(arr1.FechaFallecimiento != arr2.FechaFallecimiento){ editado = true; arr2.editados.FechaFallecimiento = true}
    if(arr1.FechaMatrimonio != arr2.FechaMatrimonio){ editado = true; arr2.editados.FechaMatrimonio = true}
    if(arr1.IdDerPension != arr2.IdDerPension){ editado = true; arr2.editados.IdDerPension = true}
    if(arr1.DCrecer != arr2.DCrecer){ editado = true; arr2.editados.DCrecer = true}
    if(arr1.PorcPensionLegal != arr2.PorcPensionLegal){ editado = true; arr2.editados.PorcPensionLegal = true}
    if(arr1.MontoPension != arr2.MontoPension){ editado = true; arr2.editados.MontoPension = true}
    if(arr1.FechaFallecimiento != arr2.FechaFallecimiento){ editado = true; arr2.editados.FechaFallecimiento = true}
    if(arr1.PorcPension != arr2.PorcPension){ editado = true; arr2.editados.PorcPension = true}
    if(arr1.PensionGar != arr2.PensionGar){ editado = true; arr2.editados.PensionGar = true}
    if(arr1.PorcPensionGar != arr2.PorcPensionGar){ editado = true; arr2.editados.PorcPensionGar = true}
    if(arr1.FechaIniPension != arr2.FechaIniPension){ editado = true; arr2.editados.FechaIniPension = true}
    if(editado==true){
      arr2.editado = true;
    }
    else{
      arr2.editado = false;
    }
    return arr2;

  }

  changeTab(tab) {
    if(tab == "datosPoliza")
    {
    this.PanelPoliza = true;
    this.PanelBeneficiarios = false;
    this.PanelResumen = false;
    }
    if(tab == "datosBeneficiario")
    {
    this.PanelPoliza = false;
    this.PanelBeneficiarios = true;
    this.PanelResumen = false;
    }
    if(tab == "datosResumen")
    {
    this.PanelPoliza = false;
    this.PanelBeneficiarios = false;
    this.PanelResumen = true;
    }
  }
  consultaPoliza() {
    this.service.getPoliza(this.consulta).then((res: any) => {
      //console.log(res);
      
      this.estadoSinCambios = res;

      this.iniEndoso = this.consulta.NoEndoso == this.estadoSinCambios.EndosoFinal ? true : false;
      this.consulta = this.estadoSinCambios.DatosGenerales;
      this.lstTipoPension = this.estadoSinCambios.LstTipoPension;
      this.lstTipoEndoso = this.estadoSinCambios.LstTipoEndosoInact;
      //console.log("Array 1 " , this.estadoSinCambios.LstTipoEndosoInact);
      //console.log("Array 1 " , this.lstTipoEndoso);
      this.lstCausaEndoso = this.estadoSinCambios.LstCausaEndosoInact;
      this.lstTipoRenta = this.estadoSinCambios.LstTipoRenta;
      this.lstModalidad = this.estadoSinCambios.LstModalidad;
      this.lstEstadoVigencia = this.estadoSinCambios.LstEstadoVigencia;
      //this.cmbDepartamento = this.estadoSinCambios.LstRegion;
      //this.cmbDepartamento2 = this.estadoSinCambios.LstRegion;

      this.lstGenero = this.estadoSinCambios.LstGenero;
      this.lstParentesco = this.estadoSinCambios.LstParentesco;
      this.lstGpoFamiliar = this.estadoSinCambios.LstGpoFamiiar;
      this.lstSitInv = this.estadoSinCambios.LstSitInv;
      this.lstDerPension = this.estadoSinCambios.LstDerPension;
      this.TipoMoneda = this.estadoSinCambios.DatosPoliza[0].TipoMoneda;
      this.estadoOriginalBeneficiarios = JSON.parse(JSON.stringify(this.estadoSinCambios.LstBeneficiarios));
      this.TipoNumIdent = this.estadoSinCambios.DatosGenerales.TipoDocumento+'-'+this.estadoSinCambios.DatosGenerales.NoDocumetnto;

      if (this.estadoSinCambios.DatosPolizaTemporal.length > 0) {
        this.temporal = 1;
        this.datosPoliza = this.estadoSinCambios.DatosPolizaTemporal[0];
        if(this.datosPoliza.MontoPension == null){
          this.datosPoliza.MontoPension = 0;
        }
        if(this.datosPoliza.FechaDevengue != null){
          this.datosPoliza.FechaDevengue = this.serviceFecha.formatGuion(new Date(this.fechaConv(res.DatosPolizaTemporal[0].FechaDevengue)))
        }

        //this.datosPoliza.FinVigencia = moment(res.DatosPoliza[0].FinVigencia).format('YYYY-MM-DD').toString();
        if(this.datosPoliza.FechaEfecto != null){
          this.datosPoliza.FechaEfecto = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.estadoSinCambios.DatosPolizaTemporal[0].FechaEfecto)))
        }

        if(this.datosPoliza.FinVigencia != null){
          this.datosPoliza.FinVigencia = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.estadoSinCambios.DatosPolizaTemporal[0].FinVigencia)))
        }

        if(this.datosPoliza.IniVigencia != null){
          this.datosPoliza.IniVigencia = this.serviceFecha.formatGuion(new Date(this.fechaConv(res.DatosPolizaTemporal[0].IniVigencia)));
        }

        this.datosPolizaActuales = JSON.parse(JSON.stringify( this.estadoSinCambios.DatosPoliza[0]));
        if(this.datosPolizaActuales.MontoPension == null){
          this.datosPolizaActuales.MontoPension = 0;
        }
        if(this.datosPolizaActuales.FechaDevengue != null){
          this.datosPolizaActuales.FechaDevengue = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.datosPolizaActuales.FechaDevengue)))
        }

        //this.datosPoliza.FinVigencia = moment(res.DatosPoliza[0].FinVigencia).format('YYYY-MM-DD').toString();
        if(this.datosPolizaActuales.FechaEfecto != null){
          this.datosPolizaActuales.FechaEfecto = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.datosPolizaActuales.FechaEfecto)))
        }

        if(this.datosPolizaActuales.FinVigencia != null){
          this.datosPolizaActuales.FinVigencia = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.datosPolizaActuales.FinVigencia)))
        }

        if(this.datosPolizaActuales.IniVigencia != null){
          this.datosPolizaActuales.IniVigencia = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.datosPolizaActuales.IniVigencia)));
        }
        this.listaNuevosBeneficiarios = JSON.parse(JSON.stringify(this.estadoSinCambios.LstBeneficiariosTemporal));

        this.dataSourceBeneficiarios = new MatTableDataSource(this.estadoSinCambios.LstBeneficiariosTemporal);
        this.dataSourceBeneficiarios.paginator = this.paginator;


        this.inicioEndoso();

      }
      else{
        this.temporal = 0;
        this.datosPoliza = this.estadoSinCambios.DatosPoliza[0];
        if(this.datosPoliza.MontoPension == null){
          this.datosPoliza.MontoPension = 0;
        }
        if(this.datosPoliza.FechaDevengue != null){
          this.datosPoliza.FechaDevengue = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.estadoSinCambios.DatosPoliza[0].FechaDevengue)))
        }

        //this.datosPoliza.FinVigencia = moment(res.DatosPoliza[0].FinVigencia).format('YYYY-MM-DD').toString();
        if(this.datosPoliza.FechaEfecto != null){
          this.datosPoliza.FechaEfecto = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.estadoSinCambios.DatosPoliza[0].FechaEfecto)))
        }

        if(this.datosPoliza.FinVigencia != null){
          this.datosPoliza.FinVigencia = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.estadoSinCambios.DatosPoliza[0].FinVigencia)))
        }

        if(this.datosPoliza.IniVigencia != null){
          this.datosPoliza.IniVigencia = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.estadoSinCambios.DatosPoliza[0].IniVigencia)))
        }

        //this.datosPoliza.FinVigencia = moment(res.DatosPoliza[0].FinVigencia).format('YYYY-MM-DD').toString();


        this.listaNuevosBeneficiarios = JSON.parse(JSON.stringify(this.estadoSinCambios.LstBeneficiarios));
        this.dataSourceBeneficiarios = new MatTableDataSource(this.estadoSinCambios.LstBeneficiarios);
        this.dataSourceBeneficiarios.paginator = this.paginator;
        this.datosPolizaActuales =  JSON.parse(JSON.stringify(this.datosPoliza));

      }
      //console.log(this.datosPoliza, this.datosPolizaActuales);
      //console.log(res);
      this.glCausaEndoso = this.datosPoliza.IdCausaEndoso;


      this.NombreCompleto = this.estadoSinCambios.DatosGenerales.Nombre + " " + this.estadoSinCambios.DatosGenerales.SegundoNombre + " " + this.estadoSinCambios.DatosGenerales.Paterno + " " + this.estadoSinCambios.DatosGenerales.Materno;
    })
  }

  consultaPoliza2() {
    this.service.getPoliza(this.consulta).then((r: any) => {
      this.datosPolizaOriginal = r;
      this.datosPolizaOriginalTmp = JSON.parse(JSON.stringify(this.datosPolizaOriginal));
      this.estadoOriginalBeneficiarios = JSON.parse(JSON.stringify(this.datosPolizaOriginal.LstBeneficiarios));
      if (this.datosPolizaOriginal.DatosPolizaTemporal.length > 0) {
        this.temporal = 1;
        this.datosPolizaOriginalTmp.DatosPoliza[0] = JSON.parse(JSON.stringify(this.datosPolizaOriginalTmp.DatosPolizaTemporal[0]));
        this.listaNuevosBeneficiarios = JSON.parse(JSON.stringify(this.datosPolizaOriginal.LstBeneficiariosTemporal));

        this.dataSourceBeneficiarios = new MatTableDataSource(this.datosPolizaOriginal.LstBeneficiariosTemporal);
        this.dataSourceBeneficiarios.paginator = this.paginator;
      }
      else{
        this.temporal = 0;
        if(this.datosPolizaOriginal.DatosPoliza[0].FechaDevengue != null){
          this.datosPoliza.FechaDevengue = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.datosPolizaOriginal.DatosPoliza[0].FechaDevengue)))
        }
        this.listaNuevosBeneficiarios = JSON.parse(JSON.stringify(this.datosPolizaOriginal.LstBeneficiarios));
        this.dataSourceBeneficiarios = new MatTableDataSource(this.datosPolizaOriginal.LstBeneficiarios);
        this.dataSourceBeneficiarios.paginator = this.paginator;
      }
     })
  }

  inicioEndoso() {

    //console.log("valorId ", this.datosPoliza.IdTipoEndoso);
    this.datosPoliza.Observaciones = "";

    this.lstTipoEndoso = this.estadoSinCambios.LstTipoEndosoInact;
    this.lstCausaEndoso = this.estadoSinCambios.LstCausaEndoso;

    this.mostrarRes = true;
    this.mostrarResP = false;
    this.editarEndoso = false;
    this.btnCalcular = false;
    this.fecRenta = false
    this.fecRentaBtn = false
    this.btnPre = false;
    this.FechaSolicitud = true;
    this.glCausaEndoso = this.datosPoliza.IdCausaEndoso;


    this.consultaPoliza2();    

    var fechaFall = this.dataSourceBeneficiarios.data[0].FechaFallecimiento;
    
     /* if(this.datosPoliza.IdCausaEndoso == "07")
      {
        this.lstTipoEndoso = this.lstTipoEndoso.filter(x => x.cod_elemento == "S")
        this.lstCausaEndoso = this.lstCausaEndoso.filter(x => x.cod_elemento == "08")
        this.FechaEfecto = false;
        this.mostrarResP = false;
        this.btnPre = true;
      }
      else
      { */       
        /*this.lstTipoEndoso = this.lstTipoEndoso.filter(x => x.cod_elemento != "S")
        this.lstCausaEndoso = fechaFall == null ? this.lstCausaEndoso.filter(x => x.cod_elemento != "08") : this.lstCausaEndoso.filter(x => x.cod_elemento != "07" &&  x.cod_elemento != "08")
       */
      /* if(this.datosPoliza.Diferidos == "0")
       {
        this.lstCausaEndoso = this.lstCausaEndoso
       }
       else{
        this.lstCausaEndoso = this.lstCausaEndoso.filter(x => x.cod_elemento != "13") 
       }*/
       
       
        this.FechaEfecto = this.datosPoliza.IdCausaEndoso == "10" ? false :true;
        //this.lstCausaEndoso = this.lstCausaEndoso.filter(x => x.cod_elemento != "17");

        if(this.temporal == 0)
        {
          if(this.lstCausaEndoso.filter(x => x.cod_elemento ==  this.datosPoliza.IdCausaEndoso).length == 0)
            {
              this.datosPoliza.IdCausaEndoso = this.lstCausaEndoso[0].cod_elemento;
              this.datosPoliza.CausaEndoso = this.lstCausaEndoso[0].gls_elemento;
            }
          this.lstCausaEndoso = this.datosPoliza.Diferidos == "0" ? this.lstCausaEndoso.filter(x => x.cod_elemento != "13") : this.lstCausaEndoso;
          this.fecRenta = this.lstCausaEndoso[0].cod_elemento == "13" ? true :false;  
          this.fecRentaBtn = this.lstCausaEndoso[0].cod_elemento == "13" ? true :false;
          //this.FechaSolicitud = this.lstCausaEndoso[0].cod_elemento == "13" || this.lstCausaEndoso[0].cod_elemento == "05" || this.lstCausaEndoso[0].cod_elemento == "02" ? false :true;    
          this.FechaSolicitud = false; 
          this.FechaSolicitudEndoso = this.serviceFecha.formatGuion(new Date(this.fechaConv(moment().format("DD/MM/YYYY"))))        
          this.FechaRentaVitalicia = this.serviceFecha.formatGuion(new Date(this.fechaConv(moment().format("DD/MM/YYYY"))))
          this.lstCausaEndoso = fechaFall == null || fechaFall == '' ? this.lstCausaEndoso.filter(x => x.cod_elemento != "08") : this.lstCausaEndoso.filter(x => x.cod_elemento != "07")
          this.datosPoliza.IdCausaEndoso = "";
        }
        else  {   
          this.lstCausaEndoso = this.datosPoliza.Diferidos == "0" && this.datosPoliza.IdCausaEndoso != '13' ? this.lstCausaEndoso.filter(x => x.cod_elemento != "13") : this.lstCausaEndoso;
          this.btnPre = true;
          this.fecRenta = this.datosPoliza.IdCausaEndoso == "13"? true :false; 
          this.fecRentaBtn = this.datosPoliza.IdCausaEndoso == "13"? true :false; 
          //this.FechaSolicitud = this.datosPoliza.IdCausaEndoso == "13" || this.lstCausaEndoso[0].cod_elemento == "05" || this.lstCausaEndoso[0].cod_elemento == "02" ? false :true;   
          this.FechaSolicitud = false; 
          this.FechaSolicitudEndoso = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.datosPoliza.FechaSolicitud))));
          this.FechaRentaVitalicia = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.datosPoliza.FechaRentaVit)))); 
            
        }
      //}
    
    /*else{
      if(this.datosPoliza.IdCausaEndoso == "07")
      {
        this.lstTipoEndoso = this.lstTipoEndoso.filter(x => x.cod_elemento != "S")
        this.lstCausaEndoso = fechaFall == null ? this.lstCausaEndoso.filter(x => x.cod_elemento != "08") : this.lstCausaEndoso.filter(x => x.cod_elemento != "07" &&  x.cod_elemento != "08")
        this.FechaEfecto = true;    
      }
      else
      {
        this.lstTipoEndoso = this.lstTipoEndoso.filter(x => x.cod_elemento == "S")
        this.lstCausaEndoso = this.lstCausaEndoso.filter(x => x.cod_elemento == "08")
        this.FechaEfecto = this.datosPoliza.IdCausaEndoso == "10" ? true :false;
      }
    }*/



    if(this.datosPoliza.FechaEfecto !=null){
      this.fechaEfecto = moment(this.datosPoliza.FechaEfecto).format('YYYY-MM-DD').toString();
    }    
    
    //console.log(this.datosPoliza.IdTipoEndoso);
    //console.log(this.datosPoliza.IdCausaEndoso);
    if(this.lstTipoEndoso.filter(x => x.cod_elemento ==  this.datosPoliza.IdTipoEndoso).length == 0)
    {
    this.datosPoliza.IdTipoEndoso = this.lstTipoEndoso[0].cod_elemento;
    this.datosPoliza.TipoEndoso = this.lstTipoEndoso[0].gls_elemento;
      
    }
    if(this.datosPoliza.IdCausaEndoso == '08')
    {
    this.btnPre = true;
    }
   
    if(this.datosPoliza.IdCausaEndoso == '')
    {
      this.btnPre = false;
    }
    //console.log("valorId ", this.datosPoliza.IdTipoEndoso);
  }

  cancelar() {
    this.mostrarRes = false;
    this.mostrarResP = false;
    this.editarDatosPoliza = true;
    this.fechaEfecto = null;
    this.FechaSolicitudEndoso = null;
    this.FechaRentaVitalicia = null;
    $('#iniTab').addClass('active');
    $('#benTab').removeClass('active');
    this.PanelPoliza = true;
    this.PanelBeneficiarios = false;
    this.PanelResumen = false;

    this.datosPolizaActuales =  JSON.parse(JSON.stringify(this.datosPoliza));
  }

  getCombo() {
    this.service.getCombo()
      .then((resp: any) => {
        //console.log(resp);
        this.cmbTipoIdent = resp;
      })
  }

  abrirModal(lesson, busq) {
    this.glBsqueda = busq;
    //console.log(this.datosPolizaOriginal);
    this.TituloModal = busq == 'nuevo' ? "Agregar Beneficiario" : "Modificar Beneficiario";

    this.agregar = false;
    this.editar = false;
    //console.log(this.datosPolizaOriginal)
    if (busq == 'busq') {
      this.TituloModal = "Consultar Beneficiario";
      this.IdModal = false;
      this.objetoBeneficiarios = lesson;
      this.FechaNacimiento = true;
      this.Ben_Pol = true;
      this.DerPension = true;
      this.FechaFallec = true;
      this.Invalidez = true;
      this.InvalidezCausa = true;
      this.InvalidezFec = true;
      this.PensionGar = true;
      this.Pension = true;
      //console.log(this.objetoBeneficiarios.FechaNac);
      //this.objetoBeneficiarios.FechaNac =(moment(this.objetoBeneficiarios.FechaNac).format('YYYY-MM-DD').toString())

      if (this.objetoBeneficiarios.FechaNac != null) {
        this.objetoBeneficiarios.FechaNac = this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaNac)));
      }
      if (this.objetoBeneficiarios.FechaNHM != null) {
        this.objetoBeneficiarios.FechaNHM = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaNHM))));
      }
      if (this.objetoBeneficiarios.FechaMatrimonio != null) {
        this.objetoBeneficiarios.FechaMatrimonio = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaMatrimonio))));

      }
      if (this.objetoBeneficiarios.FechaInv != null) {
        this.objetoBeneficiarios.FechaInv = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaInv))));

      }
      if (this.objetoBeneficiarios.FechaIniPension != null) {
        this.objetoBeneficiarios.FechaIniPension = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaIniPension))));

      }
      if (this.objetoBeneficiarios.FechaFallecimiento != null) {
        this.objetoBeneficiarios.FechaFallecimiento = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaFallecimiento))));

      }
      this.modalisDisabled = true;
      this.modalisDisabledDCrecer = true;
      this.modalisDisabledFecMat = true;
      this.llenaCombosDir(this.objetoBeneficiarios.CodDireccion, this.objetoBeneficiarios.CodUbigeoCorresp)
      
    }
    else if (busq == 'nuevo') {
      this.TituloModal = "Agregar Beneficiario";
      this.IdModal = true;
      this.objetoBeneficiarios = new EnsososSimplesDatosBeneficiario();
      this.modalisDisabled = false;
      this.modalisDisabledfechanhm = true;
      this.agregar = true;
      this.FechaNacimiento = false;
      this.Ben_Pol = false;
      this.DerPension = false;
      this.Invalidez = false;
      this.PensionGar = false;
      this.Pension = true;
      this.llenaCombosDir(0, 0)

      this.Departamento = '';
      this.Provincia = '';
      this.Distrito =  0;
      this.Departamento2 = '';
      this.Provincia2 = '';
      this.Distrito2 =  0;
      this.objetoBeneficiarios.DCrecer = this.glCausaEndoso == "02" ? 'N' : this.objetoBeneficiarios.DCrecer;
    }
    else if (busq == 'edit') {
      this.TituloModal = "Modificar Beneficiario";
      this.IdModal = true;
      this.FechaNacimiento = this.glCausaEndoso == "03" ? false : true;
      this.Ben_Pol = this.glCausaEndoso == "04" ? this.Ben_Pol = false : true;
      this.DerPension = this.glCausaEndoso == "04" || this.glCausaEndoso == "05" ? false : true;
      this.FechaFallec = this.glCausaEndoso == "05" || this.glCausaEndoso == "07" || this.glCausaEndoso == "09" ? false : true;
      this.Invalidez = this.glCausaEndoso == "06" ? false : true;
      this.InvalidezCausa = this.glCausaEndoso == "06" ? false : true;
      this.InvalidezFec = this.glCausaEndoso == "06" ? false : true;
      this.PensionGar = this.glCausaEndoso == "10" ? false : true;

      this.objetoBeneficiarios = lesson;
      
      if (this.objetoBeneficiarios.FechaNac != null) {
        this.objetoBeneficiarios.FechaNac = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaNac))));
      }
      if (this.objetoBeneficiarios.FechaNHM != null) {
        this.objetoBeneficiarios.FechaNHM = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaNHM))));
      }
      if (this.objetoBeneficiarios.FechaMatrimonio != null) {
        this.objetoBeneficiarios.FechaMatrimonio = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaMatrimonio))));

      }
      if (this.objetoBeneficiarios.FechaInv != null) {
        this.objetoBeneficiarios.FechaInv = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaInv))));

      }
      if (this.objetoBeneficiarios.FechaIniPension != null) {
        this.objetoBeneficiarios.FechaIniPension = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaIniPension))));

      }
      if (this.objetoBeneficiarios.FechaFallecimiento != null) {
        this.objetoBeneficiarios.FechaFallecimiento = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaFallecimiento))));

      }
      //console.log(this.datosPolizaOriginal)
      this.modalisDisabled = true;
      this.modalisDisabledDCrecer = true;
      this.modalisDisabledFecMat = true;
      this.editar = false;
      this.llenaCombosDir(this.objetoBeneficiarios.CodDireccion, this.objetoBeneficiarios.CodUbigeoCorresp)

      if(this.objetoBeneficiarios.Estatus == 'N')
      {
        this.IdModal = true;
        this.modalisDisabled = false;
        this.modalisDisabledDCrecer = false;
        this.modalisDisabledFecMat = false;
        this.agregar = true;
        this.FechaNacimiento = false;
        this.Ben_Pol = false;
        this.DerPension = false;
        this.FechaFallec = false;
        this.Invalidez = false;
        this.InvalidezCausa = false;
        this.InvalidezFec = false;
        this.PensionGar = false;
        this.Pension = true;
      }
    }

  }

  async llenaCombosDir(CodDireccion, CodUbigeoCorresp)
  {
    if (CodDireccion !== 0) {
      this.cmbDistrito = await this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + CodDireccion.toString()).toPromise();
      this.cmbDistritoAll = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.Departamento = this.cmbDistritoAll.find( dis => dis.CodDireccion === Number(CodDireccion) ).CodRegion;
      this.Provincia = this.cmbDistritoAll.find( dis => dis.CodDireccion === Number(CodDireccion) ).CodProvinciaDis;
      this.cmbProvincia = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento).toPromise();
      this.comboDistritoResp = this.cmbDistritoAll.slice();
    } else {
      this.cmbDistritoAll = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistritoResp = this.cmbDistritoAll.slice();
    }

    if (CodUbigeoCorresp !== 0) {
      this.cmbDistrito2 = await this.http.get<any[]>(this.url + '/CmbDistrito?pCodDireccion=' + CodUbigeoCorresp.toString()).toPromise();
      this.cmbDistritoAll2 = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.Departamento2 = this.cmbDistritoAll2.find( dis => dis.CodDireccion === Number(CodUbigeoCorresp) ).CodRegion;
      this.Provincia2 = this.cmbDistritoAll2.find( dis => dis.CodDireccion === Number(CodUbigeoCorresp) ).CodProvinciaDis;
      this.cmbProvincia2 = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento2).toPromise();
      this.comboDistrito2Resp = this.cmbDistritoAll2.slice();
    } else {
      this.cmbDistritoAll2 = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistrito2Resp = this.cmbDistritoAll2.slice();
    }
    this.direccionStr = this.objetoBeneficiarios.DireccionStr;
    this.dirCorrStr = this.objetoBeneficiarios.DirCorrStr;
  }
  cerrarModal() {
    //console.log(this.objetoBeneficiarios)
    //console.log(this.datosPolizaOriginal);
    var x = -1;
    if (this.glBsqueda == 'edit') {
       this.objetoBeneficiarios = JSON.parse(JSON.stringify(this.datosPolizaOriginalTmp.LstBeneficiarios.filter(x => x.Orden == this.objetoBeneficiarios.Orden)));
       //this.objetoBeneficiarios = this.objetoBeneficiarios[0];
        //console.log(this.objetoBeneficiarios[0]);

      for (let i = 0; i < this.datosPolizaOriginalTmp.LstBeneficiarios.length; i++) {
        //console.log(this.dataSourceBeneficiarios.data[i].Orden );
        //console.log(this.objetoBeneficiarios[0].Orden);

        if (this.dataSourceBeneficiarios.data[i].Orden ==  this.objetoBeneficiarios[0].Orden)
          {
            //console.log(this.objetoBeneficiarios[0]);

            this.objetoBeneficiarios = this.objetoBeneficiarios[0];
            //console.log(this.objetoBeneficiarios.FechaNac);
            if (this.objetoBeneficiarios.FechaNac != null) {
              this.objetoBeneficiarios.FechaNac = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaNac))));
            }
            if (this.objetoBeneficiarios.FechaNHM != null) {
              this.objetoBeneficiarios.FechaNHM = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaNHM))));
            }
            if (this.objetoBeneficiarios.FechaMatrimonio != null) {
              this.objetoBeneficiarios.FechaMatrimonio = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaMatrimonio))));

            }
            if (this.objetoBeneficiarios.FechaInv != null) {
              this.objetoBeneficiarios.FechaInv = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaInv))));

            }
            if (this.objetoBeneficiarios.FechaIniPension != null) {
              this.objetoBeneficiarios.FechaIniPension = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaIniPension))));

            }
            if (this.objetoBeneficiarios.FechaFallecimiento != null) {
              this.objetoBeneficiarios.FechaFallecimiento = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoBeneficiarios.FechaFallecimiento))));

            }
          x = i;

          break;
        }
      }
      //console.log(this.objetoBeneficiarios)
    }


    if (this.objetoBeneficiarios.FechaNac == "") {
      this.objetoBeneficiarios.FechaNac = null;
    }
    if (this.objetoBeneficiarios.FechaNHM == "") {
      this.objetoBeneficiarios.FechaNHM = null;
    }
    if (this.objetoBeneficiarios.FechaMatrimonio == "") {
      this.objetoBeneficiarios.FechaMatrimonio = null;

    }
    if (this.objetoBeneficiarios.FechaInv == "") {
      this.objetoBeneficiarios.FechaInv = null;

    }
    if (this.objetoBeneficiarios.FechaIniPension == "") {
      this.objetoBeneficiarios.FechaIniPension == null;

    }
    if (this.objetoBeneficiarios.FechaFallecimiento == "") {
      this.objetoBeneficiarios.FechaFallecimiento = null;

    }

    if (this.objetoBeneficiarios.FechaNac != null) {
      this.objetoBeneficiarios.FechaNac = (this.serviceFecha.format(new Date(moment(this.objetoBeneficiarios.FechaNac).format('LLLL'))));
    }
    if (this.objetoBeneficiarios.FechaNHM != null) {
      this.objetoBeneficiarios.FechaNHM = (this.serviceFecha.format(new Date(moment(this.objetoBeneficiarios.FechaNHM).format('LLLL'))));
    }
    if (this.objetoBeneficiarios.FechaMatrimonio != null) {
      this.objetoBeneficiarios.FechaMatrimonio = (this.serviceFecha.format(new Date(moment(this.objetoBeneficiarios.FechaMatrimonio).format('LLLL'))));

    }
    if (this.objetoBeneficiarios.FechaInv != null) {
      this.objetoBeneficiarios.FechaInv = (this.serviceFecha.format(new Date(moment(this.objetoBeneficiarios.FechaInv).format('LLLL'))));

    }
    if (this.objetoBeneficiarios.FechaIniPension != null) {
      this.objetoBeneficiarios.FechaIniPension = (this.serviceFecha.format(new Date(moment(this.objetoBeneficiarios.FechaIniPension).format('LLLL'))));

    }
    if (this.objetoBeneficiarios.FechaFallecimiento != null) {
      this.objetoBeneficiarios.FechaFallecimiento = (this.serviceFecha.format(new Date(moment(this.objetoBeneficiarios.FechaFallecimiento).format('LLLL'))));

    }
    if(x!=-1){
      this.dataSourceBeneficiarios.data[x] =  this.objetoBeneficiarios;
      var lista = this.dataSourceBeneficiarios.data;
      this.dataSourceBeneficiarios = new MatTableDataSource(lista)
    }

    this.datosPolizaOriginalTmp.LstBeneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data));
    //this.estadoOriginalBeneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data));
    //console.log(this.dataSourceBeneficiarios.data);
    //console.log(this.datosPolizaOriginalTmp);

    ($('#modalAgregarBeneficiario') as any).modal('hide');

}

  fechaConv(fecha) {
    var date1 = fecha.split('/')
    var fechaConv = date1[1] + '/' + date1[0] + '/' + date1[2];
    return fechaConv;
  }

  volverConsulta() {
    this.router.navigate(['/consultaPoliza']);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onlyDecimalNumberKey(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
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

  onlyAlphaNumeric(event) {
    if ((event.which < 32 || event.which > 32) && (event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57) && (event.which < 228 || event.which > 228) && (event.which < 239 || event.which > 239) && (event.which < 249 || event.which > 249) ){
      event.preventDefault();
    }
  }

  verificarCambios() {
    if(this.editarEndoso == true)
      this.volverConsulta();
    else{
      this.cambios = false;
      var datosTabla = this.dataSourceBeneficiarios.data;

      this.cambios = this.datosPolizaOriginalTmp.DatosPoliza[0].IdTipoEndoso != this.datosPoliza.IdTipoEndoso ? true : this.cambios;
      this.cambios = this.datosPolizaOriginalTmp.DatosPoliza[0].IdCausaEndoso != this.datosPoliza.IdCausaEndoso ? true : this.cambios;
      this.cambios = this.datosPoliza.Observaciones == null || this.datosPolizaOriginalTmp.DatosPoliza[0].Observaciones != this.datosPoliza.Observaciones? false : this.cambios;

      if (datosTabla.length != this.estadoOriginalBeneficiarios.length) {
        //console.log("se hicieron cambios");
        this.cambios = true;
        (<any>$('#modalCambiosSinGuardar')).modal('show');
      }
      else {
        for (let i = 0; i < this.estadoOriginalBeneficiarios.length; i++) {
          if (this.dataSourceBeneficiarios.data[i].Orden != this.estadoOriginalBeneficiarios[i].Orden) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].IdTipoIden != this.estadoOriginalBeneficiarios[i].IdTipoIden) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].TipoIden != this.estadoOriginalBeneficiarios[i].TipoIden) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].NoIden != this.estadoOriginalBeneficiarios[i].NoIden) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].Nombre != this.estadoOriginalBeneficiarios[i].Nombre) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].SegundoNom != this.estadoOriginalBeneficiarios[i].SegundoNom) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].Paterno != this.estadoOriginalBeneficiarios[i].Paterno) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].Materno != this.estadoOriginalBeneficiarios[i].Materno) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].IdGenero != this.estadoOriginalBeneficiarios[i].IdGenero) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].Genero != this.estadoOriginalBeneficiarios[i].Genero) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].FechaNac != this.estadoOriginalBeneficiarios[i].FechaNac) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].IdParentesco != this.estadoOriginalBeneficiarios[i].IdParentesco) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].Parentesco != this.estadoOriginalBeneficiarios[i].Parentesco) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].IdGpoFam != this.estadoOriginalBeneficiarios[i].IdGpoFam) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].GpoFamiliar != this.estadoOriginalBeneficiarios[i].GpoFamiliar) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].IdCausaInv != this.estadoOriginalBeneficiarios[i].IdCausaInv) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].CausaInv != this.estadoOriginalBeneficiarios[i].CausaInv) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].SitInv != this.estadoOriginalBeneficiarios[i].SitInv) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].FechaInv != this.estadoOriginalBeneficiarios[i].FechaInv) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].FechaFallecimiento != this.estadoOriginalBeneficiarios[i].FechaFallecimiento) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].FechaMatrimonio != this.estadoOriginalBeneficiarios[i].FechaMatrimonio) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].IdDerPension != this.estadoOriginalBeneficiarios[i].IdDerPension) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].DerPension != this.estadoOriginalBeneficiarios[i].DerPension) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].DCrecer != this.estadoOriginalBeneficiarios[i].DCrecer) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].PorcPensionLegal != this.estadoOriginalBeneficiarios[i].PorcPensionLegal) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].MontoPension != this.estadoOriginalBeneficiarios[i].MontoPension) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].FechaFallecimiento != this.estadoOriginalBeneficiarios[i].FechaFallecimiento) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].PorcPension != this.estadoOriginalBeneficiarios[i].PorcPension) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].PensionGar != this.estadoOriginalBeneficiarios[i].PensionGar) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].PorcPensionGar != this.estadoOriginalBeneficiarios[i].PorcPensionGar) {
            this.cambios = true;
          }
          if (this.dataSourceBeneficiarios.data[i].FechaIniPension != this.estadoOriginalBeneficiarios[i].FechaIniPension) {
            this.cambios = true;
          }


          if (this.cambios == true) {
            //console.log("se hicieron cambios");
            (<any>$('#modalCambiosSinGuardar')).modal('show');

          }
          else {
            //console.log("sin cambios");
            this.volverConsulta();
          }


        }
      }
    }
  }

  agregarBeneficiario(objetoBeneficiarios) {
    this.glBsqueda = "editGuardar";
    if(this.TituloModal == "Agregar Beneficiario" || (this.TituloModal == "Modificar Beneficiario" && this.objetoBeneficiarios.Estatus == 'N'))
    {
    if (this.objetoBeneficiarios.IdTipoIden == Number("-1")){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Tipo Documento.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if (this.objetoBeneficiarios.NoIden == ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo N° de Ident.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if (this.objetoBeneficiarios.Paterno == ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Apellido Paterno.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if (this.objetoBeneficiarios.Materno == ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Apellido Materno.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if (this.objetoBeneficiarios.Nombre == ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Nombre.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.IdGenero == ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Genero.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.FechaNac == null){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene la campo Fecha de Nacimiento.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.FechaNac  > this.serviceFecha.formatGuion(new Date(this.fechaConv(moment().format("DD/MM/YYYY"))))){
      Swal.fire({title: 'Advertencia',text: 'La fecha de nacimiento no puede ser mayor a la fecha actual.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.IdParentesco== ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Parentesco.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.IdGpoFam == ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Grupo Familiar.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.IdDerPension == ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo D° Pensión.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.IdSitInv == ""){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Sit de Inv.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.CausaInv == "" && this.objetoBeneficiarios.IdSitInv != "N"){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo campo Causa de Invalidez.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if  (this.objetoBeneficiarios.Direccion == ("")){
      Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Dirección.' , icon: 'warning', allowOutsideClick: false});
      return;
    }  else if  (this.objetoBeneficiarios.FechaFallecimiento  > this.serviceFecha.formatGuion(new Date(this.fechaConv(moment().format("DD/MM/YYYY"))))){
        Swal.fire({title: 'Advertencia',text: 'La fecha de Fallecimiento no puede ser mayor a la fecha actual.' , icon: 'warning', allowOutsideClick: false});
        return;
    }

    var index = this.cmbTipoIdent.indexOf(this.cmbTipoIdent.find(x => x.Codigo == objetoBeneficiarios.IdTipoIden));
    objetoBeneficiarios.TipoIden = this.cmbTipoIdent[index].Nombre;

    var index2 = this.lstGenero.indexOf(this.lstGenero.find(x => x.cod_elemento == objetoBeneficiarios.IdGenero));
    objetoBeneficiarios.Genero = this.lstGenero[index2].gls_elemento;

    var index3 = this.lstParentesco.indexOf(this.lstParentesco.find(x=>x.cod_elemento == objetoBeneficiarios.IdParentesco));
    objetoBeneficiarios.Parentesco = this.lstParentesco[index3].gls_elemento;


    var ultimo =this.dataSourceBeneficiarios.data.length;
    this.estadoOriginalBeneficiarios.length;
    this.listaNuevosBeneficiarios.length;
    if(this.estadoOriginalBeneficiarios[this.estadoOriginalBeneficiarios.length-1].Orden>this.listaNuevosBeneficiarios[this.listaNuevosBeneficiarios.length-1].Orden){
      ultimo  = Number(this.estadoOriginalBeneficiarios[this.estadoOriginalBeneficiarios.length-1].Orden);
    }
    if(this.estadoOriginalBeneficiarios[this.estadoOriginalBeneficiarios.length-1].Orden <= this.listaNuevosBeneficiarios[this.listaNuevosBeneficiarios.length-1].Orden){
      ultimo  = Number(this.listaNuevosBeneficiarios[this.listaNuevosBeneficiarios.length-1].Orden);
    }
    if(!this.editar &&  this.TituloModal != "Modificar Beneficiario"){
      objetoBeneficiarios.Orden =  Number(ultimo) +1;
      objetoBeneficiarios.Estatus =  'N';
    }

    if (objetoBeneficiarios.FechaNac == "") {
      objetoBeneficiarios.FechaNac = null;
    }
    if (objetoBeneficiarios.FechaNHM == "") {
      objetoBeneficiarios.FechaNHM = null;
    }
    if (objetoBeneficiarios.FechaMatrimonio == "") {
      objetoBeneficiarios.FechaMatrimonio = null;

    }
    if (objetoBeneficiarios.FechaInv == "") {
      objetoBeneficiarios.FechaInv = null;

    }
    if (objetoBeneficiarios.FechaIniPension == "") {
      objetoBeneficiarios.FechaIniPension == null;

    }
    if (objetoBeneficiarios.FechaFallecimiento == "") {
      objetoBeneficiarios.FechaFallecimiento = null;

    }

    if (objetoBeneficiarios.FechaNac != null) {
      objetoBeneficiarios.FechaNac = (this.serviceFecha.format(new Date(moment(objetoBeneficiarios.FechaNac).format('LLLL'))));
    }
    if (objetoBeneficiarios.FechaNHM != null) {
      objetoBeneficiarios.FechaNHM = (this.serviceFecha.format(new Date(moment(objetoBeneficiarios.FechaNHM).format('LLLL'))));
    }
    if (objetoBeneficiarios.FechaMatrimonio != null) {
      objetoBeneficiarios.FechaMatrimonio = (this.serviceFecha.format(new Date(moment(objetoBeneficiarios.FechaMatrimonio).format('LLLL'))));

    }
    if (objetoBeneficiarios.FechaInv != null) {
      objetoBeneficiarios.FechaInv = (this.serviceFecha.format(new Date(moment(objetoBeneficiarios.FechaInv).format('LLLL'))));

    }
    if (objetoBeneficiarios.FechaIniPension != null) {
      objetoBeneficiarios.FechaIniPension = (this.serviceFecha.format(new Date(moment(objetoBeneficiarios.FechaIniPension).format('LLLL'))));

    }
    if (objetoBeneficiarios.FechaFallecimiento != null) {
      objetoBeneficiarios.FechaFallecimiento = (this.serviceFecha.format(new Date(moment(objetoBeneficiarios.FechaFallecimiento).format('LLLL'))));

    }
    this.listaNuevosBeneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data));

    var index = this.lstSitInv.indexOf(this.lstSitInv.find(x => x.cod_elemento == this.objetoBeneficiarios.IdSitInv));
      this.objetoBeneficiarios.SitInv  = this.lstSitInv[index].gls_elemento;

      var index = this.lstGpoFamiliar.indexOf(this.lstGpoFamiliar.find(x => x.cod_elemento == this.objetoBeneficiarios.IdGpoFam));
      this.objetoBeneficiarios.GpoFamiliar  = this.lstGpoFamiliar[index].gls_elemento;

      var index = this.lstDerPension.indexOf(this.lstDerPension.find(x => x.cod_elemento == this.objetoBeneficiarios.IdDerPension));
      this.objetoBeneficiarios.DerPension  = this.lstDerPension[index].gls_elemento;

    //console.log(objetoBeneficiarios);
    if(!this.editar && this.TituloModal != "Modificar Beneficiario"){
      this.listaNuevosBeneficiarios.push(objetoBeneficiarios);
      this.btnPre = false;
    }
    var nombre = objetoBeneficiarios.Nombre + ' '+ (objetoBeneficiarios.SegundoNom  == null ? '' : objetoBeneficiarios.SegundoNom) + ' '+ objetoBeneficiarios.Paterno + ' '+ (objetoBeneficiarios.Materno == null ? '' : objetoBeneficiarios.Materno);
    this.dataSourceBeneficiarios = new MatTableDataSource(this.listaNuevosBeneficiarios);
    this.dataSourceBeneficiarios.paginator = this.paginator;
    this.objetoBeneficiarios = new EnsososSimplesDatosBeneficiario();

    Swal.close();
    Swal.fire({title: 'Con éxito',html: '<br /> <br /> El beneficiario ' + nombre +  ' ha sido agregado exitosamente. Los cambios realizados calcularán nuevos montos, los mismos se mostrarán en un documento que generaremos en automático. Estos cambios no alterarán la póliza.' , icon: 'success', allowOutsideClick: false}).then((result) => {
      if (result.value) {
        
        Swal.fire(
          'CALCULANDO!',
          'Espere un momento mientras se realiza el Cálculo.',
          'warning'
        )
        this.Calcular();
      }
    })
  }

  if(this.TituloModal == "Modificar Beneficiario" )
  {
    if (this.objetoBeneficiarios.FechaNac  > this.serviceFecha.formatGuion(new Date(this.fechaConv(moment().format("DD/MM/YYYY"))))){
      Swal.fire({title: 'Advertencia',text: 'La fecha de Nacimiento no puede ser mayor a la fecha actual.' , icon: 'warning', allowOutsideClick: false});
      return;
    } else if (this.objetoBeneficiarios.FechaFallecimiento  > this.serviceFecha.formatGuion(new Date(this.fechaConv(moment().format("DD/MM/YYYY"))))) {
      Swal.fire({title: 'Advertencia',text: 'La fecha de Fallecimiento no puede ser mayor a la fecha actual.' , icon: 'warning', allowOutsideClick: false});
      return;
    }

    if(this.datosPoliza.IdCausaEndoso == "06")
    {
      if  (this.objetoBeneficiarios.IdSitInv == ""){
        Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Sit de Inv.' , icon: 'warning', allowOutsideClick: false});
        return;
      } else if  (this.objetoBeneficiarios.CausaInv == "" && this.objetoBeneficiarios.IdSitInv != "N"){
        Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo campo Causa de Invalidez.' , icon: 'warning', allowOutsideClick: false});
        return;
      } else if  (this.objetoBeneficiarios.FechaInv == "" || this.objetoBeneficiarios.FechaInv == null && this.objetoBeneficiarios.IdSitInv != "N"){
        Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo fecha de Invalidez.' , icon: 'warning', allowOutsideClick: false});
        return;
      }

      var index = this.lstSitInv.indexOf(this.lstSitInv.find(x => x.cod_elemento == this.objetoBeneficiarios.IdSitInv));
      this.objetoBeneficiarios.SitInv  = this.lstSitInv[index].gls_elemento;
    }

    if(this.datosPoliza.IdCausaEndoso == "04")
    {
      if  (this.objetoBeneficiarios.IdGenero == ""){
        Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Genero.' , icon: 'warning', allowOutsideClick: false});
        return;
      } else if  (this.objetoBeneficiarios.IdParentesco== ""){
        Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Parentesco.' , icon: 'warning', allowOutsideClick: false});
        return;
      } else if  (this.objetoBeneficiarios.IdGpoFam == ""){
        Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo Grupo Familiar.' , icon: 'warning', allowOutsideClick: false});
        return;
      } else if  (this.objetoBeneficiarios.IdDerPension == ""){
        Swal.fire({title: 'Advertencia',text: 'Por favor llene el campo D° Pensión.' , icon: 'warning', allowOutsideClick: false});
        return;
      } 

      var index = this.lstGenero.indexOf(this.lstGenero.find(x => x.cod_elemento == this.objetoBeneficiarios.IdGenero));
      this.objetoBeneficiarios.Genero  = this.lstGenero[index].gls_elemento;

      var index = this.lstParentesco.indexOf(this.lstParentesco.find(x => x.cod_elemento == this.objetoBeneficiarios.IdParentesco));
      this.objetoBeneficiarios.Parentesco  = this.lstParentesco[index].gls_elemento;

      var index = this.lstGpoFamiliar.indexOf(this.lstGpoFamiliar.find(x => x.cod_elemento == this.objetoBeneficiarios.IdGpoFam));
      this.objetoBeneficiarios.GpoFamiliar  = this.lstGpoFamiliar[index].gls_elemento;

      var index = this.lstDerPension.indexOf(this.lstDerPension.find(x => x.cod_elemento == this.objetoBeneficiarios.IdDerPension));
      this.objetoBeneficiarios.DerPension  = this.lstDerPension[index].gls_elemento;


    }

    if(this.datosPoliza.IdCausaEndoso == "03" || this.datosPoliza.IdCausaEndoso == "04" || this.datosPoliza.IdCausaEndoso == "06" || this.datosPoliza.IdCausaEndoso == "09" || this.datosPoliza.IdCausaEndoso == "10")
    {
      this.btnCalcular = true;
    }
    else
      this.btnPre = true;

      this.listaNuevosBeneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data));
  }

    this.cerrarModal();
  }

  Modal(i, bandera){

    if(bandera == "ModalE"){
      this.TituloModal = "Eliminar Beneficiario"
      this.CuerpoModal = "¿Desea Eliminar Beneficiario?"
      this.iGlobal = i;
      this.ModalDescartar = false;
      this.ModalEliminar = true;
      (<any>$('#modalConfirmacion')).modal('show');
    }
    if(bandera == "ModalD"){
      this.TituloModal = "Descartar Cambios";
      this.CuerpoModal = "Los cambios realizados y guardados en la póliza se eliminarán";
      this.ModalDescartar = true;
      this.ModalEliminar = false;
      (<any>$('#modalConfirmacion')).modal('show');
    }
    if(bandera == "Eliminar"){
      Swal.showLoading();
      var nombre = this.dataSourceBeneficiarios.data[this.iGlobal].Nombre + ' '+ (this.dataSourceBeneficiarios.data[this.iGlobal].SegundoNom  == null ? '' : this.dataSourceBeneficiarios.data[this.iGlobal].SegundoNom) + ' '+ this.dataSourceBeneficiarios.data[this.iGlobal].Paterno + ' '+ (this.dataSourceBeneficiarios.data[this.iGlobal].Materno == null ? '' : this.dataSourceBeneficiarios.data[this.iGlobal].Materno);
    this.dataSourceBeneficiarios.data.splice(this.iGlobal,1);
    this.dataSourceBeneficiarios = new MatTableDataSource(this.dataSourceBeneficiarios.data);
    this.listaNuevosBeneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data));    
    Swal.close();
    Swal.fire({title: 'Con éxito',html: '<br /> <br /> El beneficiario ' + nombre +  ' se ha eliminado exitosamente. Los cambios realizados calcularán nuevos montos, los mismos se mostrarán en un documento que generaremos en automático. Estos cambios no alterarán la póliza.' , icon: 'success', allowOutsideClick: false}).then((result) => {
      if (result.value) {
        if(this.glCausaEndoso == "17")
        {
          this.btnPre = true;
        }
        else{
        Swal.fire(
          'CALCULANDO!',
          'Espere un momento mientras se realiza el Cálculo.',
          'warning'
        )
        this.Calcular();
      }}
    })
    }
}

  guardarCambios(){

    this.objetoGuardar = new EndososSimplesyActuarialesGuardar();
    this.objetoGuardar = this.datosPoliza;
    this.objetoGuardar.NumeroPoliza = Globales.datosEndososSimplesActuariales.NumeroPoliza.toString();
    this.objetoGuardar.NoEndoso =  Globales.datosEndososSimplesActuariales.NoEndoso;
    this.objetoGuardar.LstBeneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data))
    this.objetoGuardar.Usuario = localStorage.getItem('currentUser');
    this.objetoGuardar.MtoPencionOrig = this.datosPoliza.MontoPensionOri == null ? 0 : this.datosPoliza.MontoPensionOri;
    this.objetoGuardar.MtoPensionCalc = this.datosPoliza.MontoPensionOri == null ? 0 : this.datosPoliza.MontoPensionOri;

    //console.log(this.datosPoliza);

    if(this.objetoGuardar.MontoPension == null){
      this.objetoGuardar.MontoPension = 0;
    }
    this.objetoGuardar.FechaEfecto = moment(this.fechaEfecto).format('LLLL').toString();
    this.objetoGuardar.FechaSolicitudEndoso = this.FechaSolicitudEndoso;
    this.objetoGuardar.FechaRentaVitalicia = this.FechaRentaVitalicia;
    this.dataSourceBeneficiarios.data;
    for (let i = 0; i < this.objetoGuardar.LstBeneficiarios.length; i++) {
        if(this.objetoGuardar.LstBeneficiarios[i].FechaNac!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaNac = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaNac))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaInv!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaInv = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaInv))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaNHM!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaNHM = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaNHM))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaIniPension!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaIniPension = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaIniPension))))
        }

    }
    //console.log(this.objetoGuardar, this.dataSourceBeneficiarios.data);
    this.service.guardarDatos(this.objetoGuardar).then((res: any) => {
      if(res == 1){
        this.datosPolizaOriginalTmp.DatosPoliza[0].IdTipoEndoso = this.datosPoliza.IdTipoEndoso;
        this.datosPolizaOriginalTmp.DatosPoliza[0].IdCausaEndoso = this.datosPoliza.IdCausaEndoso;
        this.datosPolizaOriginalTmp.DatosPoliza[0].Observaciones = this.datosPoliza.Observaciones;

        Swal.fire({title: 'Con éxito',html: '<br /> <br /> Los datos se han guardado exitosamente.' , icon: 'success', allowOutsideClick: false});
        return;
      }else{
        Swal.fire({title: 'Error',text: 'Ha ocurrido un error, intentelo de nuevo.' , icon: 'error', allowOutsideClick: false});
        return;
      }
    }
    );

  }

  generarPreEndoso(){
    ($('#modalPreendoso') as any).modal('hide');
    this.datosPolizaActuales
    this.datosPoliza
    //console.log(this.datosPoliza, this.datosPolizaActuales);
    this.estadoOriginalBeneficiarios
    this.listaNuevosBeneficiarios

    let valorCausaEndoso = this.datosPoliza.IdCausaEndoso;
    if(this.arregloNuevo.length > 0 || valorCausaEndoso == '08' || valorCausaEndoso == '13')
    {
          Swal.close();
          Swal.fire(
            'GENERANDO PDF!',
            'Espere un momento mientras se genera documento.',
            'warning'
          )
           Swal.showLoading();
      var LstOriginal:any = JSON.parse(JSON.stringify(this.datosPolizaActuales));
      LstOriginal.LstBeneficiarios = JSON.parse(JSON.stringify(this.estadoOriginalBeneficiarios));
      LstOriginal.NumeroPoliza = Globales.datosEndososSimplesActuariales.NumeroPoliza;
      LstOriginal.NoEndoso = Globales.datosEndososSimplesActuariales.NoEndoso;
      var LstMod:any = JSON.parse(JSON.stringify(this.datosPoliza));
      LstMod.LstBeneficiarios = JSON.parse(JSON.stringify(this.listaNuevosBeneficiarios));

      var data = {LstOriginal: LstOriginal, LstMod: LstMod}

      this.service.generaPreEndoso(data).then((resp: any) => {
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
    else
    Swal.fire({title: 'Error',text: 'No se puede generar el Preendoso ya que no se identifican Cambios con respecto al endoso anterior ' , icon: 'error', allowOutsideClick: false});
    
  }

  descartarCambios(){
    this.editarEndoso = true;
    this.btnAgregaBen = false;
    this.objetoGuardar = new EndososSimplesyActuarialesGuardar();
    this.objetoGuardar.NumeroPoliza = Globales.datosEndososSimplesActuariales.NumeroPoliza.toString();
    this.objetoGuardar.NoEndoso =  Globales.datosEndososSimplesActuariales.NoEndoso;
    this.objetoGuardar.Usuario = localStorage.getItem('currentUser');

    this.service.descartarCambios(this.objetoGuardar).then((res)=>{
      if(res==0){

        this.lstTipoEndoso = this.estadoSinCambios.LstTipoEndosoInact;
        this.lstCausaEndoso = this.estadoSinCambios.LstCausaEndosoInact;

        this.datosPoliza = JSON.parse(JSON.stringify(this.datosPolizaOriginal.DatosPoliza[0]))
        //var lstBen = Object.assign({},this.datosPolizaOriginal.LstBeneficiarios)
        this.datosPoliza.FechaDevengue = moment(this.datosPoliza.FechaDevengue).format('YYYY-MM-DD').toString();
        //this.datosPoliza.FinVigencia = moment(res.DatosPoliza[0].FinVigencia).format('YYYY-MM-DD').toString();
        var newdate = this.datosPoliza.FinVigencia.split("/").reverse().join("-");
        this.datosPoliza.FinVigencia = newdate;
        this.datosPoliza.IniVigencia = moment(this.datosPoliza.IniVigencia).format('YYYY-MM-DD').toString();

        this.dataSourceBeneficiarios = new MatTableDataSource(this.datosPolizaOriginal.LstBeneficiarios);
        this.dataSourceBeneficiarios.paginator = this.paginator;

        this.cancelar();
      }
    })
  }
  generarEndoso(){    
    this.objetoGuardar = new EndososSimplesyActuarialesGuardar();
    this.objetoGuardar = this.datosPoliza;
    this.objetoGuardar.NumeroPoliza = Globales.datosEndososSimplesActuariales.NumeroPoliza.toString();
    this.objetoGuardar.NoEndoso =  Globales.datosEndososSimplesActuariales.NoEndoso;
    this.objetoGuardar.LstBeneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data))
    this.objetoGuardar.Usuario = localStorage.getItem('currentUser');
    this.objetoGuardar.MtoPencionOrig = this.datosPoliza.MontoPensionOri == null ? 0 : this.datosPoliza.MontoPensionOri;
    this.objetoGuardar.MtoPensionCalc = this.datosPoliza.MontoPensionCal == null ? 0 : this.datosPoliza.MontoPensionCal;

    if(this.objetoGuardar.MontoPension == null){
      this.objetoGuardar.MontoPension = 0;
    }
    this.objetoGuardar.FechaEfecto = moment(this.fechaEfecto).format('LLLL').toString();
    this.objetoGuardar.FechaSolicitudEndoso = this.FechaSolicitudEndoso;
    this.objetoGuardar.FechaRentaVitalicia = this.FechaRentaVitalicia;
    this.dataSourceBeneficiarios.data;
    for (let i = 0; i < this.objetoGuardar.LstBeneficiarios.length; i++) {
        if(this.objetoGuardar.LstBeneficiarios[i].FechaNac!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaNac = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaNac))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaInv!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaInv = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaInv))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaNHM!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaNHM = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaNHM))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaIniPension!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaIniPension = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaIniPension))))
        }

    }
    //console.log(this.objetoGuardar)
    this.service.generarEndoso(this.objetoGuardar).then((res: any) => {
      //console.log(res);
      if(res == 0){
        this.cambios = false;
        Swal.fire({title: 'Con éxito',html: '<br /> <br /> Se ha generado el endoso correctamente.' , icon: 'success', allowOutsideClick: false});
        this.router.navigate(['/consultaPoliza']);
        Globales.datosEndososSimplesActuariales.NoEndoso = Globales.datosEndososSimplesActuariales.NoEndoso+1;
        this.consulta.NumeroPoliza = Globales.datosEndososSimplesActuariales.NumeroPoliza.toString();
        this.consulta.NoEndoso = Globales.datosEndososSimplesActuariales.NoEndoso;
        this.consultaPoliza();
        this.mostrarRes = false;
        this.editarDatosPoliza = true;
        return;
      }else if(res == -2){
        Swal.fire({title: 'Error',text: 'Ha ocurrido un error, al recalcular porcentajes de pension.' , icon: 'error', allowOutsideClick: false});
        return;
      }else{
        Swal.fire({title: 'Error',text: 'Ha ocurrido un error, intentelo de nuevo.' , icon: 'error', allowOutsideClick: false});
        return;
      }
    }
    );
  }

  comboTipoEndoso(idTipoEndoso){
    //this.lstCausaEndoso = this.datosPoliza.Diferidos == "0" ? 
    //var lstTipoEndoso2 = this.lstTipoEndoso;
    var index = this.lstTipoEndoso.indexOf(this.lstTipoEndoso.find(x => x.cod_elemento == idTipoEndoso));
    this.datosPoliza.TipoEndoso = this.lstTipoEndoso[index].gls_elemento;
    //this.lstCausaEndoso = idTipoEndoso == 'S' ? this.lstCausaEndoso.filter(x => x.cod_elemento == "07" || x.cod_elemento == "08" || x.cod_elemento == "09") : this.lstCausaEndoso.filter(x => x.cod_elemento != "07" && x.cod_elemento != "08" && x.cod_elemento != "09");
  }
  comboCausaEndoso(idCausaEndoso){
    this.glCausaEndoso = idCausaEndoso;

    this.consultaPoliza2();

    //console.log(this.datosPoliza)
    //console.log(this.datosPolizaOriginal)
    this.btnAgregaBen = false;
    this.FechaNacimiento = true;
    this.Ben_Pol = true;
    this.DerPension = true;
    this.FechaFallec = true;
    this.FechaEfecto = true;
    this.FechaSolicitud = true;
    this.btnCalcular = false;
    this.btnPre = false;
    this.fecRenta = false;
    this.fecRentaBtn = false;
    this.mostrarResP = false;

    this.btnAgregaBen = idCausaEndoso == "02" ?  true : false ;
    this.FechaNacimiento  = idCausaEndoso == "03" ? false : true;
    this.Ben_Pol = idCausaEndoso == "04" ? false : true;
    this.DerPension = idCausaEndoso == "04" || idCausaEndoso == "05" ? false : true;
    this.FechaFallec = idCausaEndoso == "05" || idCausaEndoso == "07" || idCausaEndoso == "09" ? false : true;
    this.Invalidez = idCausaEndoso == "06" ? false : true;
    this.InvalidezCausa = idCausaEndoso == "06" ? false : true;
    this.InvalidezFec = idCausaEndoso == "06" ? false : true;
    this.PensionGar = idCausaEndoso == "10" ? false : true;
    this.FechaEfecto = idCausaEndoso == "10" ? false : true;
    //this.FechaSolicitud = idCausaEndoso == "13" || idCausaEndoso == "05" || idCausaEndoso == "02"? false : true;
    this.FechaSolicitud = false;
    this.fecRenta = idCausaEndoso == "13" ?  true : false ;
    this.fecRentaBtn = idCausaEndoso == "13" ?  true : false ;
    this.btnPre = idCausaEndoso == "08" ?  true : false ;
    var index = this.lstCausaEndoso.indexOf(this.lstCausaEndoso.find(x => x.cod_elemento == idCausaEndoso));
    this.datosPoliza.CausaEndoso = this.lstCausaEndoso[index].gls_elemento;

    this.FechaSolicitudEndoso = this.serviceFecha.formatGuion(new Date(this.fechaConv(moment().format("DD/MM/YYYY"))))
    this.FechaRentaVitalicia = this.serviceFecha.formatGuion(new Date(this.fechaConv(moment().format("DD/MM/YYYY"))))
    
    this.modalisDisabledDCrecer = idCausaEndoso == "02" ? true : false;
    this.modalisDisabledFecMat = idCausaEndoso == "02" ? true : false;
    this.FechaFallec = idCausaEndoso == "02" ? true : false;
    if(idCausaEndoso == "" || idCausaEndoso == "03" || idCausaEndoso == "04" || idCausaEndoso == "06" || idCausaEndoso == "07" || idCausaEndoso == "09" || idCausaEndoso == "10" || idCausaEndoso == "11" || idCausaEndoso == "12")
    {
      this.mostrarResP = true;
    }
    if(idCausaEndoso == "07" || idCausaEndoso == "08" || idCausaEndoso == "09" || idCausaEndoso === "17")
    {
      //console.log("Valor Combo " , this.datosPoliza.IdTipoEndoso );
      this.datosPoliza.IdTipoEndoso = 'S';
      //console.log("Valor Combo " , this.datosPoliza.IdTipoEndoso );
    }
    else
    {
      this.datosPoliza.IdTipoEndoso = 'A';
    }
  }
  comboTipoPension(idTipoPension){
    var index = this.lstTipoPension.indexOf(this.lstTipoPension.find(x => x.cod_elemento == idTipoPension));
    this.datosPoliza.Pension = this.lstTipoPension[index].gls_elemento;

  }
  comboTipoRenta(idTipoRenta){
    var index = this.lstTipoRenta.indexOf(this.lstTipoRenta.find(x => x.cod_elemento == idTipoRenta));
    this.datosPoliza.TipoRenta = this.lstTipoRenta[index].gls_elemento;
  }
  comboModalidad(idModalidad){
    var index = this.lstModalidad.indexOf(this.lstModalidad.find(x => x.cod_elemento == idModalidad));
    this.datosPoliza.Modalidad = this.lstModalidad[index].gls_elemento;
  }
  comboEstadoVigencia(idEstadoVigencia){
    var index = this.lstEstadoVigencia.indexOf(this.lstEstadoVigencia.find(x => x.cod_elemento == idEstadoVigencia));
    this.datosPoliza.EstadoVigencia = this.lstEstadoVigencia[index].gls_elemento;
  }

  validaEditar(lesson)
  {
    if(lesson.IdParentesco == "99")
        return this.glCausaEndoso == "07" ? true : false;
    else if (lesson.Estatus == 'N')
      return true;
    else
        return this.glCausaEndoso == "02" || this.glCausaEndoso == "05"  || this.glCausaEndoso == "07"|| this.glCausaEndoso == "13"? false : true;

  }

  Calcular(){    
    Swal.fire(
      'CALCULANDO!',
      'Espere un momento mientras se realiza el Cálculo.',
      'warning'
    );
    Swal.showLoading();
  
    this.objetoGuardar = new EndososSimplesyActuarialesGuardar();
    this.objetoGuardar = this.datosPoliza;
    this.objetoGuardar.NumeroPoliza = Globales.datosEndososSimplesActuariales.NumeroPoliza.toString();
    this.objetoGuardar.NoEndoso =  Globales.datosEndososSimplesActuariales.NoEndoso;
    this.objetoGuardar.LstBeneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data))
    this.objetoGuardar.Usuario = localStorage.getItem('currentUser');
    this.objetoGuardar.MtoPencionOrig = this.datosPoliza.MontoPensionOri == null ? 0 : this.datosPoliza.MontoPensionOri;
    this.objetoGuardar.MtoPensionCalc = this.datosPoliza.MontoPensionOri == null ? 0 : this.datosPoliza.MontoPensionOri;
    this.objetoGuardar.FechaRentaVitalicia = this.FechaRentaVitalicia;
    this.objetoGuardar.FechaSolicitudEndoso = this.FechaSolicitudEndoso;
    if(this.objetoGuardar.MontoPension == null){
      this.objetoGuardar.MontoPension = 0;
    }
    this.objetoGuardar.FechaEfecto = moment(new Date()).format('LLLL').toString();
    this.dataSourceBeneficiarios.data;
    for (let i = 0; i < this.objetoGuardar.LstBeneficiarios.length; i++) {
        if(this.objetoGuardar.LstBeneficiarios[i].FechaNac!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaNac = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaNac))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaInv!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaInv = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaInv))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaNHM!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaNHM = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaNHM))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaMatrimonio))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaFallecimiento))))
        }
        if(this.objetoGuardar.LstBeneficiarios[i].FechaIniPension!=null){
          this.objetoGuardar.LstBeneficiarios[i].FechaIniPension = (this.serviceFecha.formatGuion(new Date(this.fechaConv(this.objetoGuardar.LstBeneficiarios[i].FechaIniPension))))
        }

    }

    this.service.calculaReserva(this.objetoGuardar).then((res: any) => {
      //console.log(res);
      if(res.IsOk == true){
        //console.log(res);
        
        this.datosPoliza.MontoPension = res.mtoPension;
        this.datosPoliza.MontoPensionCal = res.mtoPension;
        this.datosPoliza.MontoPensionRea = res.mtoPensionRea;

        var beneficiarios = JSON.parse(JSON.stringify(this.dataSourceBeneficiarios.data))
         if(this.datosPoliza.IdCausaEndoso == "13")
         {
           let fec = new Date(this.FechaRentaVitalicia);
           fec.setDate(fec.getDate() + 1);
          this.datosPoliza.FechaDevengue =  (this.serviceFecha.formatGuion(new Date(fec.getFullYear(), fec.getMonth(), 1)));
          this.datosPoliza.Diferidos = "0";
          this.datosPoliza.IdTipoRenta = "1";
         }  
          var benCalculo = res.Beneficiarios;
          for (let i = 0; i < beneficiarios.length; i++) {
            var numOrden = beneficiarios[i].Orden;
            var beneficiario = benCalculo

            var index = benCalculo.indexOf(benCalculo.find(x => x.NumOrd == numOrden));
            beneficiarios[i].PorcPension= benCalculo[index].PrcPen;
            this.datosPolizaOriginalTmp.LstBeneficiarios[i].PorcPension= benCalculo[index].PrcPen;

            beneficiarios[i].PorcPensionLegal= benCalculo[index].PrcLeg;
            this.datosPolizaOriginalTmp.LstBeneficiarios[i].PorcPensionLegal= benCalculo[index].PrcLeg;

            beneficiarios[i].MontoPension = (res.mtoPension * (beneficiarios[i].PorcPension / 100)).toFixed(2);
            this.datosPolizaOriginalTmp.LstBeneficiarios[i].MontoPension = (res.mtoPension * (beneficiarios[i].PorcPension / 100)).toFixed(2);
          }         
          this.dataSourceBeneficiarios = new MatTableDataSource(beneficiarios);
          this.dataSourceBeneficiarios.paginator = this.paginator; 
        


        this.cambios = false;
        this.btnCalcular = false;
        this.btnPre = true;
        this.fecRentaBtn = false;
        Swal.close();
        Swal.fire({title: 'Con éxito',html: '<br /> <br /> Se ha generado el Calculo correctamente.' , icon: 'success', allowOutsideClick: false});
        
        return;
      }else{
        this.btnCalcular = true;
        this.fecRentaBtn = true;
        Swal.close();
        Swal.fire({title: 'Error',text: res.Message , icon: 'error', allowOutsideClick: false});
        return;
      }
    }
    );
  }
  
  selectDirecciones(valor: string) {
    this.opcionDir = valor;
  }

   // Para cargar combo provincia al seleccionar un departamento.
   async selectDepto(bandera: string) {
    if (this.opcionDir === 'Exp') {
      this.cmbProvincia = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento).toPromise();
      this.Provincia = '';
      this.Distrito =  0;

      var index = this.cmbDepartamento.indexOf(this.cmbDepartamento.find(x => x.CodRegion == this.Departamento));
      var dpto = this.cmbDepartamento[index].GlsRegion;

      this.direccionStr = dpto;
    } else {
      this.cmbProvincia2 = await this.http.get<any[]>(this.url + '/CmbProvincia?pCodRegion=' + this.Departamento2).toPromise();
      this.Provincia2 = '';
      this.Distrito2 =  0;
    }
  }

  // Para cargar combo distrito al seleccionar una provincia.
  async selectProvincia(bandera: string) {
    if (this.opcionDir === 'Exp') {
      this.cmbDistrito = await this.http.get<any[]>(this.url + '/CmbDistritoDos?pCodProvincia=' + this.Provincia).toPromise();
      this.cmbDistritoAll = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistritoResp = this.cmbDistritoAll.slice();
      
      var index = this.cmbDepartamento.indexOf(this.cmbDepartamento.find(x => x.CodRegion == this.Departamento));
      var dpto = this.cmbDepartamento[index].GlsRegion;

      index = this.cmbProvincia.indexOf(this.cmbProvincia.find(x => x.CodProvincia == this.Provincia));
      var prov = this.cmbProvincia[index].GlsProvincia;

      this.direccionStr  = dpto + '-' +  prov + '-' +this.cmbDistrito[0].GlsDistrito;
    } else {
      this.cmbDistrito2 = await this.http.get<any[]>(this.url + '/CmbDistritoDos?pCodProvincia=' + this.Provincia2).toPromise();
      this.cmbDistritoAll2 = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
      this.comboDistrito2Resp = this.cmbDistritoAll2.slice();
      this.Distrito2 = this.cmbDistrito2[0].CodDireccion;

      var index = this.cmbDepartamento2.indexOf(this.cmbDepartamento2.find(x => x.CodRegion == this.Departamento2));
      var dpto = this.cmbDepartamento2[index].GlsRegion;

      index = this.cmbProvincia2.indexOf(this.cmbProvincia2.find(x => x.CodProvincia == this.Provincia2));
      var prov = this.cmbProvincia2[index].GlsProvincia;

      this.dirCorrStr = dpto + '-' +  prov + '-' +this.cmbDistrito[0].GlsDistrito;
    }
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

  selectDistrito(bandera: string) {
    if (this.opcionDir === 'Exp') {
      if (Number(this.Distrito) !== 0) {
        this.objetoBeneficiarios.CodDireccion = Number(this.Distrito);
        this.cambioDir();
      }
    } else {
      if (Number(this.Distrito2) !== 0) {
        this.objetoBeneficiarios.CodUbigeoCorresp = Number(this.Distrito2);
        this.cambioDirCorr();
      }
    }
  }

  async cambioDir() {
    await this.prePolizasService.getDireccion(this.objetoBeneficiarios.CodDireccion)
    .then((resp: any) => {
      this.direccionStrs = resp;
      this.direccionStr = this.direccionStrs.DireccionStr;
      // this.dirCorrStr = this.direccionStrs.DirCorrStr;
    });
  }

  async cambioDirCorr() {
    await this.prePolizasService.getDireccion(this.objetoBeneficiarios.CodUbigeoCorresp)
    .then((resp: any) => {
      this.direccionStrs = resp;
      this.dirCorrStr = this.direccionStrs.DireccionStr;
    });
  }

  AdelantoRentaVit()
  {
    if(this.datosPoliza.IdCausaEndoso == "13")
    {
        this.btnPre = false;
        this.fecRentaBtn = true;

    }    
  }

  comboSitInvBen(idSituacionInv) {
    this.InvalidezCausa = idSituacionInv == "N" || idSituacionInv == "" ? true : false;
    this.InvalidezFec = idSituacionInv == "N" || idSituacionInv == "" ? true : false;
  }

  comboParentesco(idParentesco) {
   this.modalisDisabledfechanhm =  idParentesco >= '10' &&  idParentesco <= '21' ? false : true;
  }
}
