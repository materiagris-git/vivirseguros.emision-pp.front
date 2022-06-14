import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Globales } from 'src/interfaces/globales';
import { ConsultaMantenedorCertificadosSupervivenciaService } from 'src/providers/ConsultaMantenedorCertificadosSupervivencia.service';
import { InfoPolCertSupervivencia, InfoBeneficiario, InfoBenfCSE, ActualizarCertificado } from 'src/interfaces/mantenedorCertificadosSupervivencia.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-mantenedor-cert-supervivencia-estudios',
  templateUrl: './mantenedor-cert-supervivencia-estudios.component.html',
  styleUrls: ['./mantenedor-cert-supervivencia-estudios.component.css']
})
export class MantenedorCertSupervivenciaEstudiosComponent implements OnInit {

  infoConCertSup: InfoPolCertSupervivencia = new InfoPolCertSupervivencia();
  infoBeneficiario: InfoBeneficiario = new InfoBeneficiario();
  infiBenefCSE: InfoBenfCSE = new InfoBenfCSE();
  actBen: ActualizarCertificado = new ActualizarCertificado();
  EstadoCert: boolean;
  TipoCertificado = "";
  tipoCertFiltro = "";
  mostrarIcono: boolean = false;
  isDisabledFecIniCer = false;
  isDisabledFecTercer = false;
  isDisabledFecReccia = false;
  isDisabledNomInst = false;
  isDisabledTipoCert = false;
  isDisabledEst = true; 
  Desde = "";
  Hasta = "";
  TipoNumIdent = "";
  TipoDoc = "";
  NumDoc = "";
  Beneficiario = "";
  listaFiltrados=[];
  listaChida=[];
  columnas = [];
  columnas2 = [];
  public cmbTipoIdent: any[];
  public cmbTipoCertificado: any[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private cdRef: ChangeDetectorRef,
    private router: Router,
    public titleService: Title,
    private _serviceFecha: ServiciofechaService,
    private _MantCertSupService: ConsultaMantenedorCertificadosSupervivenciaService) {
    this.columnas = ["item", "Parentesco", "TipoIdentificacion", "NIdentificacion", "Nombre", "FechaNac", "Acciones"];
    this.columnas2 = ["Desde", "Hasta", "Institucion", "tCertificado", "archivo"];

    this._MantCertSupService.getCombos("SELECT_COMBOGENERAL", "TCB").then((resp: any) => {
      this.cmbTipoCertificado = resp;
    });
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
  dsBeneficiarios: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    this.isDisabledFecIniCer = true;
    this.isDisabledFecTercer = true;
    this.isDisabledFecReccia = true;
    this.isDisabledNomInst = true;
    this.isDisabledTipoCert = true;

    this.infoConCertSup.NumPoliza = Globales.datosAntPensionados.NumPoliza;
    this.infoConCertSup.NumEndoso = Globales.datosAntPensionados.NumEndoso;
    this.infoConCertSup.Num_Orden = Globales.datosAntPensionados.NumOrden;

    this._MantCertSupService.postCargaInfoPolSuperviviente(this.infoConCertSup).then((resp: any) => {
      this.infoConCertSup.NumPoliza = resp.NumPoliza;
      this.infoConCertSup.NumEndoso = resp.NumEndoso;
      this.infoConCertSup.CUSPP = resp.CUSPP;
      this.infoConCertSup.Fecha = resp.Fecha;
      this.infoConCertSup.Titular = resp.Titular;
      this.infoConCertSup.Documento = resp.Documento;
      this.infoConCertSup.CodIdenBen = resp.Cod_IdenBen;
      this.TipoNumIdent = resp.TipoNumIdent;
      this.infoConCertSup.NumIdent = resp.NumIdent;
      this.dataSource = new MatTableDataSource(resp.lstBeneficiariosTbl);
    });
  }

  ngAfterViewInit(): void {
    if (Globales.datosAntPensionados.NumPoliza == "" && Globales.datosAntPensionados.NumEndoso == "" && Globales.datosAntPensionados.NumOrden == 0) {
      this.router.navigate(['/consultaPolizaMantCertSE']);
    }
    Globales.titlePag = 'Mantenedor de Certificados de Supervivencia/Certificados de Estudios';
    this.titleService.setTitle(Globales.titlePag);
    this.cdRef.detectChanges();
  }

  onlyAlphaNumeric(event) {
    if ((event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57)) {
      event.preventDefault();
    }
  }

  cargaBeneficiarioInfo(row) {
    this.isDisabledFecIniCer = false;
    this.isDisabledFecTercer = false;
    this.isDisabledFecReccia = false;
    this.isDisabledNomInst = false;
    this.isDisabledTipoCert = false;
    this.isDisabledEst = false;
    //this.EstadoCert
    this.TipoCertificado = "0";
    //this.infiBenefCSE.FecInicer = row.FechaActual;
    this.infiBenefCSE.FecIngcia = row.FechaActual;
    this._MantCertSupService.getBeneficiarioInfo(this.infoConCertSup.NumPoliza, row.NumEndoso, row.Num_IdenBen).then((resp: any) => {
      this.infoBeneficiario = resp;

      this.infiBenefCSE.FecInicer = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD');
      this.infiBenefCSE.FecTercer = moment(this.infiBenefCSE.FecInicer).add(6, 'months').add(-1, 'day').format('YYYY-MM-DD');
      this.infiBenefCSE.FecReccia = moment(new Date()).format('YYYY-MM-DD');
      this.fechaEfecto()
    });

    this.selectedFiles = undefined;
    this.fileName = "";
    this.fileNameArch = "";

    this.infiBenefCSE.directorio="";
    this.infiBenefCSE.archivo="";
    this.infiBenefCSE.type="";
    this.EstadoCert = this.TipoCertificado == "0" ?  false : true ;
  }

  comboTipoCert(tipoCer)
  {
    this.EstadoCert = tipoCer == "0" ?  false : true ;
  }

  cargarBenInfoCertEstudios(lesson) {
    this._MantCertSupService.getBenefInfoCSE("CERTIFICADOS_CONSULTA", this.infoConCertSup.NumPoliza, lesson.Num_Orden).then((resp: any) => {
      this.TipoDoc = lesson.TipoIdentificacion;
      this.NumDoc = lesson.Num_IdenBen;
      this.Beneficiario = lesson.NombreCompleto;
      this.dsBeneficiarios = new MatTableDataSource(resp);
      this.listaChida = resp;
      this.tipoCertFiltro="";
      this.isDisabledEst = false;
      this.infiBenefCSE.Estado = resp.Estado;
      this.EstadoCert == true;
      this.EstadoCert = this.TipoCertificado == "1" ?  true : false ;
    });
  }

  filtrarTC(){
    this.listaFiltrados = this.listaChida.map(x => Object.assign({}, x));
    if(this.tipoCertFiltro!=''){
      this.listaFiltrados = this.listaFiltrados.filter(beneficiario => beneficiario.Identificador.indexOf(this.tipoCertFiltro) > -1);
    }

    this.dsBeneficiarios = new MatTableDataSource(this.listaFiltrados);
  }

  infoBenfModal(row) {

    this.isDisabledFecIniCer = true;
    this.isDisabledFecTercer = false;
    this.isDisabledFecReccia = false;
    this.isDisabledNomInst = false;
    this.isDisabledTipoCert = true;
    this.TipoCertificado = row.Identificador;
    this.Desde = row.FecInicer === '' ? '' : row.FecInicer.split("/").reverse().join("-");
    this.Hasta = row.FecTercer === '' ? '' : row.FecTercer.split("/").reverse().join("-");

    this.infiBenefCSE.FecInicer = row.FecInicer;
    this.infiBenefCSE.FecTercer = row.FecTercer;
    this.infiBenefCSE.FecReccia = row.FecReccia;
    this.infiBenefCSE.FecIngcia = row.FecIngcia;
    this.infiBenefCSE.FecEfecto = row.FecEfecto;
    this.infiBenefCSE.GlsNomInstitucion = row.GlsNomInstitucion;
    this.infiBenefCSE.NumPoliza = row.NumPoliza;
    this.infiBenefCSE.NumEndoso = row.NumEndoso;
    this.infiBenefCSE.NumOrden = row.NumOrden;
    this.infiBenefCSE.CodFrecuencia = row.CodFrecuencia;

    this.infiBenefCSE.FecInicer = this.infiBenefCSE.FecInicer === '' ? '' : this.infiBenefCSE.FecInicer.split("/").reverse().join("-");
    this.infiBenefCSE.FecTercer = this.infiBenefCSE.FecTercer === '' ? '' : this.infiBenefCSE.FecTercer.split("/").reverse().join("-");
    this.infiBenefCSE.FecReccia = this.infiBenefCSE.FecReccia === '' ? '' : this._serviceFecha.formatGuion(new Date(moment(this.infiBenefCSE.FecReccia).format('LLLL')));
    this.selectedFiles = undefined;
    this.fileName = row.archivo;
    this.fileNameArch = "";

    this.infiBenefCSE.directorio = row.directorio;
    this.infiBenefCSE.archivo = row.archivo;
    this.infiBenefCSE.type = row.type;
    this.infiBenefCSE.Estado = row.Estado;
    this.EstadoCert = this.TipoCertificado == "0" ?  false : true ;

  }

  fechaEfecto() {
    var fecIni = this.infiBenefCSE.FecInicer === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.infiBenefCSE.FecInicer).format('LLLL')));
    var fecTer = this.infiBenefCSE.FecTercer === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.infiBenefCSE.FecTercer).format('LLLL')));
    
    this._MantCertSupService.getFechaEfecto(fecIni, this.infiBenefCSE.NumPoliza, this.infiBenefCSE.NumOrden, fecTer).then((resp: any) => {
      this.infiBenefCSE.FecEfecto = resp.datos;
      this.infiBenefCSE.FecTercer = moment(this.infiBenefCSE.FecInicer).add(6, 'months').add(-1, 'day').format('YYYY-MM-DD');
    });
  }

  guardarCert() {
    this.actBen.NumPoliza = this.infoConCertSup.NumPoliza;
    this.actBen.NumEndoso = Number(this.infoConCertSup.NumEndoso);//this.infiBenefCSE.NumEndoso === 0 ? Number(this.infoConCertSup.NumEndoso) : this.infiBenefCSE.NumEndoso;
    this.actBen.FecInicer = this.infiBenefCSE.FecInicer;
    this.actBen.FecTercer = this.infiBenefCSE.FecTercer;
    this.actBen.CodIdenBen = this.infoConCertSup.CodIdenBen;
    this.actBen.NumIdenben = this.NumDoc;
    this.actBen.CodTabla = this.TipoCertificado;
    this.actBen.NumOrden = Number(this.infoBeneficiario.NumOrden);
    this.actBen.CodFrecuencia = this.infiBenefCSE.CodFrecuencia;
    this.actBen.FecEfecto = this.infiBenefCSE.FecEfecto.split("/").reverse().join("-");
    this.actBen.GlsNomInstitucion = this.infiBenefCSE.GlsNomInstitucion;
    this.actBen.FecReccia = this.infiBenefCSE.FecReccia;
    this.actBen.FecIngcia = this.infiBenefCSE.FecIngcia;
    this.actBen.Estado = this.infiBenefCSE.Estado;


    this.Desde = this.infiBenefCSE.FecInicer === '' ? '' : this.infiBenefCSE.FecInicer.split("/").reverse().join("-");
    this.Hasta = this.infiBenefCSE.FecTercer === '' ? '' : this.infiBenefCSE.FecTercer.split("/").reverse().join("-");

    let FecIniVig = moment(this.actBen.FecInicer).format('LLLL');
    let FecFinVig = moment(this.actBen.FecTercer).format('LLLL');
    let FecRecepcion = moment(this.actBen.FecReccia).format('LLLL');
    let DesdeFormat = moment(this.Desde).format('LLLL');
    let HastaFormat = moment(this.Hasta).format('LLLL');

    this.actBen.FecInicer = this.actBen.FecInicer === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.actBen.FecInicer).format('LLLL')));
    this.actBen.FecTercer = this.actBen.FecTercer === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.actBen.FecTercer).format('LLLL')));
    this.actBen.FecReccia = this.actBen.FecReccia === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.actBen.FecReccia).format('LLLL')));
    this.actBen.FecEfecto = this.actBen.FecEfecto === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.actBen.FecEfecto).format('LLLL')));
    //this.actBen.FecIngcia = this.actBen.FecIngcia === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.actBen.FecIngcia).format('LLLL')));
    this.actBen.FecIngcia = this.actBen.FecIngcia.split('/').reverse().join('') ;

    if (this.selectedFiles != undefined) {
      this.actBen.file = this.selectedFiles[0];
    }else{
      this.actBen.directorio = this.infiBenefCSE.directorio;
      this.actBen.archivo = this.infiBenefCSE.archivo;
      this.actBen.type = this.infiBenefCSE.type;
    }

    if (this.TipoCertificado == "") {
      Swal.fire({ title: 'Advertencia', text: 'Seleccione una opción de Tipo Certificado.', icon: 'warning', allowOutsideClick: false });
      return;
    }

    if (FecIniVig == 'Invalid date') {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar Fecha de Inicio de Vigencia.', icon: 'warning', allowOutsideClick: false });
      return;
    }

    if (FecFinVig == 'Invalid date') {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar Fecha de Término de Vigencia', icon: 'warning', allowOutsideClick: false });
      return;
    }

    if (FecIniVig < FecIniVig) {
      Swal.fire({ title: 'Advertencia', text: 'La Fecha Término es menor a la Fecha de Inicio de Vigencia.', icon: 'warning', allowOutsideClick: false });
      return;
    }

    if (FecRecepcion == 'Invalid date') {
      Swal.fire({ title: 'Advertencia', text: 'Debe Ingresar Fecha de Recepción.', icon: 'warning', allowOutsideClick: false });
      return;
    }

    if (this.infiBenefCSE.FecIngcia == '') {
      Swal.fire({ title: 'Advertencia', text: 'Falta Fecha de Ingreso.', icon: 'warning', allowOutsideClick: false });
      return;
    } else if (this.infiBenefCSE.FecEfecto == '') {
      Swal.fire({ title: 'Advertencia', text: 'Falta Fecha de Efecto.', icon: 'warning', allowOutsideClick: false });
      return;
    }

    Swal.fire({ title: 'Advertencia', text: 'Este proceso puede tardar unos minutos, por favor espere.', icon: 'warning', allowOutsideClick: false });
    Swal.showLoading();
    // Swal.close();

    if (this.actBen.file != undefined) {

      this._MantCertSupService.ArchivoBeneficiario(this.actBen).then((resp: any) => {
        this.actBen.directorio = resp.directorio;
        this.actBen.archivo = resp.archivo;
        this.actBen.type = resp.Type;

        this._MantCertSupService.ActualizarCertificado(this.actBen).then((resp: any) => {

          if (resp.Mensaje == 0) {
            Swal.fire({ title: 'Operación Cancelada', text: 'La Fecha Ingresada no se Encuentra dentro del Rango de Vigencia de la Póliza o esta no Vigente. No se Ingresara Ni Modificara Información.', icon: 'warning', allowOutsideClick: false });
            return;
          }
          if (resp.Mensaje == 1) {
            Swal.fire({ title: 'Operación Cancelada', text: 'No es posible registrar el Certificado, ya que el Pensionado/Beneficiario se encuentra Fallecido.', icon: 'warning', allowOutsideClick: false });
            return;
          }
          if (resp.Mensaje == 2) {
            Swal.fire({ title: 'Operación Cancelada', text: 'No es posible registrar los datos del Certificado de este Beneficiario, ya que no se encuentra Registrado.', icon: 'warning', allowOutsideClick: false });
            return;
          }
          if (resp.Mensaje == 5) {
            Swal.fire({ title: 'Operación Cancelada', text: 'Rango de Fechas ya se encuentran en un período de Vigencia.', icon: 'warning', allowOutsideClick: false });
            return;
          }
          if (resp.Mensaje == 3) {
            Swal.fire({ title: 'Operación de Actualización', text: 'Los datos se han actualizado correctamente.', icon: 'success', allowOutsideClick: false });
            return;
          }
          if (resp.Mensaje == 4) {
            Swal.fire({ title: 'Operación de Inserción', text: 'Los datos se han insertado correctamente.', icon: 'success', allowOutsideClick: false });
            return;
          }
        });
      });

    } else {
      this._MantCertSupService.ActualizarCertificado(this.actBen).then((resp: any) => {

        if (resp.Mensaje == 0) {
          Swal.fire({ title: 'Operación Cancelada', text: 'La Fecha Ingresada no se Encuentra dentro del Rango de Vigencia de la Póliza o esta no Vigente. No se Ingresara Ni Modificara Información.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if (resp.Mensaje == 1) {
          Swal.fire({ title: 'Operación Cancelada', text: 'No es posible registrar el Certificado, ya que el Pensionado/Beneficiario se encuentra Fallecido.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if (resp.Mensaje == 2) {
          Swal.fire({ title: 'Operación Cancelada', text: 'No es posible registrar los datos del Certificado de este Beneficiario, ya que no se encuentra Registrado.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if (resp.Mensaje == 5) {
          Swal.fire({ title: 'Operación Cancelada', text: 'Rango de Fechas ya se encuentran en un período de Vigencia.', icon: 'warning', allowOutsideClick: false });
          return;
        }
        if (resp.Mensaje == 3) {
          Swal.fire({ title: 'Operación de Actualización', text: 'Los datos se han actualizado correctamente.', icon: 'success', allowOutsideClick: false });
          return;
        }
        if (resp.Mensaje == 4) {
          Swal.fire({ title: 'Operación de Inserción', text: 'Los datos se han insertado correctamente.', icon: 'success', allowOutsideClick: false });
          return;
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/consultaPolizaMantCertSE']);
  }

  selectedFiles: FileList;
  fileName: string;
  fileNameArch: string;
  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.fileName = "";
    if (this.selectedFiles.length > 0) {
      if (this.selectedFiles[0].name.indexOf(".pdf") < 0 && this.selectedFiles[0].name.indexOf(".docx") < 0 && this.selectedFiles[0].type.indexOf("image/") < 0) {
        this.fileNameArch = "";
        Swal.fire({ title: 'ERROR', text: "El archivo seleccionado no es valido", icon: 'error', allowOutsideClick: false });
      } else {
        this.fileName = this.selectedFiles[0].name;
      }
    }
  }

  generarArchivo(row) {
    Swal.showLoading();
    if (row.archivo != "") {

      var blob = this._MantCertSupService.downloadFile(row.directorio, row.type).subscribe(res => {
        FileSaver.saveAs(res,row.archivo);
        Swal.close();
      }, err => {
        console.log(err)
        Swal.close();
      });
      
    } else {
      Swal.fire({ title: 'ERROR', text: "No tiene un archivo asociado.", icon: 'error', allowOutsideClick: false });

    }
  }

}
