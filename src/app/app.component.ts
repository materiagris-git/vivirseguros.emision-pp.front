import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConsultaObtencionImagenesService } from 'src/providers/consulta-obtencion-imagenes.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';

import { LoginService } from 'src/providers/login.service';
import { Login } from 'src/interfaces/login.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  urlCotizador: string;
  urlCotizadorCerrarSesion: string;
  imagenLogo: any;
  titleLogo: string;
  titlePag: string;
  currentUser:Login;
  userActivity;
  userInactive:Subject<any> = new Subject();
  title = 'ProduccionPagoPensiones';
  activo: boolean = false;

  // emision
  menuEmision: boolean;

  menuProcCalc: boolean;
  menuMantPrepoliza: boolean;
  menuTraspasoAFP: boolean;

  menuProduccion: boolean;

  menuRecepcionPrimas: boolean;
  menuArchivoConf: boolean;
  menuPrimasRecepcionadas: boolean;

  menuTraspasoPagoPensiones: boolean;

  menuTraspasoPolizas: boolean;
  menuTraspasos: boolean;

  menuArchivosContables: boolean;

  menuPrimaUnica: boolean;
  menuPrimerosPagos: boolean;

  menuConsultaGeneral: boolean;
  menuReporteHerederos: boolean;

  // pago pensiones
  menuPagoPensiones: boolean;

  menuMantencionInformacion: boolean;

  menuAntecedentesPensionado: boolean;
  menuAntecedentesGenerales: boolean;
  menuAsignacionTutorApoderado: boolean;
  menuCertificadoSupervivenciaEstudios: boolean;
  menuArchivoDatosBeneficiario: boolean;

  menuRetencionJudicial: boolean;

  menuIngresoOrdenJudicial: boolean;
  menuInformeControl: boolean;

  menuEndosos: boolean;

  menuGenerarEndosos: boolean;

  menuCalculoPension:boolean;
  menuRegistroPagosTerceros:boolean;
  menuPagosRecurrentes:boolean;

  // Menú Catálogos
  menuCatalogos: boolean;



  ppPrePolizas:boolean;
  ppPrimaAfp:boolean;
  ppRecepcionPrimas:boolean;
  ppArchivoConf:boolean;
  ppPrimasRecepcionadas:boolean;
  ppTraspasoPolizas:boolean;
  ppConsultaTraspasos:boolean;
  ppGernArPrimaUnica:boolean;
  ppGenArPrimerosPagos:boolean;
  ppConsultaGeneral:boolean;
  ppReporteHerederos: boolean;
  ppAntecedentesPensionado:boolean;
  ppTutoresApoderados:boolean;
  ppCertSupervivencia:boolean;
  ppHijosMayores:boolean;
  ppCorreoInicioPoliza: boolean;
  ppPagosSuspendidos: boolean;
  ppGenArDatosBen:boolean;
  ppRetencionJudicial:boolean;
  ppInformeContRetencionJudicial:boolean;
  ppGenerarEndoso:boolean;
  ppCalendarioPagos:boolean;
  ppCalculoPagosRecu:boolean;
  ppPagosTercerosGS:boolean;
  ppPagosTercerosPG:boolean;
  ppPagosTerceros:boolean;
  ppArPagosRecurrentes:boolean;
  PPInformeNormativo: boolean;
  ppMantenedorUbigeo: boolean;
  ppCatalogoGeneral: boolean;
  ppMantenedorTipoDoc: boolean;
  ppMantenimientoGeneral: boolean;
  menuReportesPP:boolean;
  ppFechaPagosRecu:boolean;
  ppEstadisticas: boolean;
  ppConsultaIndicadores:boolean;

  constructor(public titleService: Title,
              private consultaImagen: ConsultaObtencionImagenesService,
              private sanitizer: DomSanitizer,
              private serviceLog:LoginService,
              private cdRef:ChangeDetectorRef,
              private router:Router ) {
      const objectURL = 'data:image/png;base64,' ;
      this.imagenLogo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.titlePag = Globales.titlePag;
      this.serviceLog.currentUser.subscribe(x=>this.currentUser = x);
      this.setTimeout();
      this.userInactive.subscribe(()=>this.logout())
              }
ngAfterViewChecked(): void {

  if (localStorage.getItem('currentUser') !== null) {
    this.urlCotizador = 'http://rrvv-bk.vivirseguros.pe/Estudio/Oficiales?idUsuario=' + localStorage.getItem('currentUser');
  }
  if (localStorage.getItem('currentUser') !== null) {
    this.urlCotizadorCerrarSesion = 'http://rrvv-bk.vivirseguros.pe/Estudio/Login';
  }
  if(localStorage.getItem('permisos')){
    Globales.permisos = JSON.parse(localStorage.getItem('permisos'));
    // this.currentUser.IdUserEncrypt = localStorage.getItem("currentUser").toString();
    //Globales.idUsuarioEncriptado = localStorage.getItem("currentUser").toString();
    //console.log(Login.User);
    if(Globales.permisos.length>0){
      var indPrePol = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPPrePolizasIndex"));
      if(indPrePol>-1){ this.ppPrePolizas = true} else{this.ppPrePolizas=false;}

      var indPPrima = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPPrimaAfpIndex"));
      if(indPPrima>-1){ this.ppPrimaAfp = true} else{this.ppPrimaAfp=false;}

      var indPPRecepcionPrimas = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPRecepcionPrimasIndex"));
      if(indPPRecepcionPrimas>-1){ this.ppRecepcionPrimas = true} else{this.ppRecepcionPrimas=false;}

      var indPPArchivoConf = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPArchivoConfirmacionIndex"));
      if(indPPArchivoConf>-1){ this.ppArchivoConf = true} else{this.ppArchivoConf=false;}

      var indPPConsultaRecepcionPrima = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPPrimasRecepcionadasIndex"));
      if(indPPConsultaRecepcionPrima>-1){ this.ppPrimasRecepcionadas = true} else{this.ppPrimasRecepcionadas=false;}

      var indPPTraspasoPolizas = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPTraspasoPolizasIndex"));
      if(indPPTraspasoPolizas>-1){ this.ppTraspasoPolizas = true} else{this.ppTraspasoPolizas=false;}

      var indPPConsultaTraspaso = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPConsultaTraspasosIndex"));
      if(indPPConsultaTraspaso>-1){ this.ppConsultaTraspasos = true} else{this.ppConsultaTraspasos=false;}

      var indPPGenArPrimaUnica = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPGenArPrimaUnicaIndex"));
      if(indPPGenArPrimaUnica>-1){ this.ppGernArPrimaUnica = true} else{this.ppGernArPrimaUnica=false;}

      var indPPGenArPrimerosPagos = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPGenArPrimerosPagosIndex"));
      if(indPPGenArPrimerosPagos>-1){ this.ppGenArPrimerosPagos = true} else{this.ppGenArPrimerosPagos=false;}

      var indPPConsultaIndicadores = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPConsultaIndicadoresIndex"));
      if(indPPConsultaIndicadores>-1){ this.ppConsultaIndicadores = true} else{this.ppConsultaIndicadores=false;}

      var indPPConsultaGeneral = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPConsultaGeneralIndex"));
      if(indPPConsultaGeneral>-1){ this.ppConsultaGeneral = true} else{this.ppConsultaGeneral=false;}

      var indPPReporteHerederos = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPReporteHerederosIndex"));
      if(indPPReporteHerederos>-1){ this.ppReporteHerederos = true} else{this.ppReporteHerederos=false;}

      var indPPAntecedentesPensionado = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPAntecedentesPensionadoIndex"));
      if(indPPAntecedentesPensionado>-1){ this.ppAntecedentesPensionado = true} else{this.ppAntecedentesPensionado=false;}

      var indPPTutoresApoderados = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPTutoresApoderadosIndex"));
      if(indPPTutoresApoderados>-1){ this.ppTutoresApoderados = true} else{this.ppTutoresApoderados=false;}

      var indPPCertSupervivencia = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPCertSupervivenciaIndex"));
      if(indPPCertSupervivencia>-1){ this.ppCertSupervivencia = true} else{this.ppCertSupervivencia=false;}

      var indPPHijosMayores = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPHijosMayoresIndex"));
      if(indPPHijosMayores>-1){ this.ppHijosMayores = true} else{this.ppHijosMayores=false;}

      var indPPCorreoInicioPoliza = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPCorreoInicioPolizaIndex"));
      if(indPPCorreoInicioPoliza>-1){ this.ppCorreoInicioPoliza = true} else{this.ppCorreoInicioPoliza=false;}

      var indPPPagosSuspendidos = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPPagosSuspendidosIndex"));
      if(indPPPagosSuspendidos>-1){ this.ppPagosSuspendidos = true} else{this.ppPagosSuspendidos=false;}

      var indPPGenArDatosBen = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPGenArDatosBenIndex"));
      if(indPPGenArDatosBen>-1){ this.ppGenArDatosBen = true} else{this.ppGenArDatosBen=false;}

      var indPPRetencionJudicial = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPRetencionJudicialIndex"));
      if(indPPRetencionJudicial>-1){ this.ppRetencionJudicial = true} else{this.ppRetencionJudicial=false;}

      var indPPInformeRetJud = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPInformeRetencionJudicial"));
      if(indPPInformeRetJud>-1){ this.ppInformeContRetencionJudicial = true} else{this.ppInformeContRetencionJudicial=false;}

      var indPPGenerarEndoso = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPGenerarEndosoIndex"));
      if(indPPGenerarEndoso>-1){ this.ppGenerarEndoso = true} else{this.ppGenerarEndoso=false;}

      var indPPCalendarioPagos = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPCalendarioPagosIndex"));
      if(indPPCalendarioPagos>-1){ this.ppCalendarioPagos = true} else{this.ppCalendarioPagos=false;}

      var indPPCalendarioPagos = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPCalculoPagosRecuIndex"));
      if(indPPCalendarioPagos>-1){ this.ppCalculoPagosRecu = true} else{this.ppCalculoPagosRecu=false;}

      var indPPCalculoPagosRecu = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPCalculoPagosRecuIndex"));
      if(indPPCalculoPagosRecu>-1){ this.ppCalculoPagosRecu = true} else{this.ppCalculoPagosRecu=false;}

      var indPPFechaPagosRecu = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPFechaPagosRecuIndex"));
      if(indPPFechaPagosRecu>-1){ this.ppFechaPagosRecu = true} else{this.ppFechaPagosRecu=false;}

      var indPPPagosTercerosGS = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPPagosTercerosGSIndex"));
      if(indPPPagosTercerosGS>-1){ this.ppPagosTercerosGS = true} else{this.ppPagosTercerosGS=false;}
      
      var indPPPagosTercerosPG = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPPagosTercerosPGIndex"));
      if(indPPPagosTercerosPG>-1){ this.ppPagosTercerosPG = true} else{this.ppPagosTercerosPG=false;}

      var indPPPagosTerceros = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPPagosTerceros"));
      if(indPPPagosTerceros>-1){ this.ppPagosTerceros = true} else{this.ppPagosTerceros=false;}

      var indPPArPagosRecurrentes = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPArPagosRecurrentes"));
      if(indPPArPagosRecurrentes>-1){ this.ppArPagosRecurrentes = true} else{this.ppArPagosRecurrentes=false;}

      var indPPInformeNormativo = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPInformeNormativo"));
      if(indPPInformeNormativo>-1){ this.PPInformeNormativo = true} else{this.PPInformeNormativo=false;}

      var indPPMantenimientoUbigeo = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPMantenedorUbigeo"));
      if(indPPMantenimientoUbigeo>-1){ this.ppMantenedorUbigeo = true} else{this.ppMantenedorUbigeo=false;}

      var indPPCatalogoGeneral = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPCatalogoGeneral"));
      if(indPPCatalogoGeneral>-1){ this.ppCatalogoGeneral = true} else{this.ppCatalogoGeneral=false;}

      var indPPMantenimientoTipoDoc = Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPMantenedorTipoDoc"));
      if(indPPMantenimientoTipoDoc>-1){ this.ppMantenedorTipoDoc = true} else{this.ppMantenedorTipoDoc=false;}

      var indPPMantenimientoGeneral= Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPMantenimientoGeneral"));
      if(indPPMantenimientoGeneral>-1){ this.ppMantenimientoGeneral = true} else{this.ppMantenimientoGeneral=false;}

      var indPPEstadisticas= Globales.permisos.indexOf(Globales.permisos.find(x=>x.Pantallas == "PPEstadisticas"));
      if(indPPEstadisticas>-1){ this.ppEstadisticas = true} else{this.ppEstadisticas=false;}
    }
  }
  else{
    this.ppPrePolizas = false;
    this.ppPrimaAfp = false;
    this.ppRecepcionPrimas = false;
    this.ppArchivoConf = false;
    this.ppPrimasRecepcionadas = false;
    this.ppTraspasoPolizas = false;
    this.ppConsultaTraspasos = false;
    this.ppGernArPrimaUnica = false;
    this.ppGenArPrimerosPagos = false;
    this.ppConsultaGeneral = false;
    this.ppReporteHerederos = false;
    this.ppAntecedentesPensionado = false;
    this.ppTutoresApoderados = false;
    this.ppCertSupervivencia = false;
    this.ppHijosMayores = false;
    this.ppCorreoInicioPoliza = false;
    this.ppPagosSuspendidos = false;
    this.ppGenArDatosBen = false;
    this.ppRetencionJudicial = false;
    this.ppGenerarEndoso=false;
    this.ppCalendarioPagos = false;
    this.ppCalculoPagosRecu = false;
    this.ppPagosTercerosGS = false;
    this.ppPagosTercerosPG = false;
    this.ppArPagosRecurrentes = false;
    this.PPInformeNormativo = false;
    this.ppMantenedorUbigeo = false;
    this.ppCatalogoGeneral = false;
    this.ppMantenedorTipoDoc = false;
    this.ppMantenimientoGeneral = false;
    this.ppFechaPagosRecu = false;
    this.ppFechaPagosRecu = false;
    this.ppEstadisticas = false;
    this.ppConsultaIndicadores = false;
  }


  this.cdRef.detectChanges();

}
  setDocTitle(title: string) {
    // console.log('current title:::::' + this.titleService.getTitle());
    this.titleService.setTitle(title);
  }

  claseActive() {
    this.activo = !this.activo;
    this.cerrarMenu();
  }
  menuActive(menu) {
    if (menu == 'menuEmision') {
      if (this.activo == true) {
        this.activo = false;
      }
      this.menuEmision = !this.menuEmision;
      this.menuPagoPensiones = false;
      this.menuMantencionInformacion = false;
      this.menuAntecedentesPensionado = false;
      this.menuAntecedentesGenerales = false;
      this.menuAsignacionTutorApoderado = false;
      this.menuCertificadoSupervivenciaEstudios = false;
      this.menuArchivoDatosBeneficiario = false;
      this.menuRetencionJudicial = false;
      this.menuIngresoOrdenJudicial = false;
      this.menuInformeControl = false;
      this.menuEndosos = false;
      this.menuGenerarEndosos = false;
      this.menuCatalogos = false;
    } else if (menu == 'menuConsultaGeneral') {
      this.menuConsultaGeneral = !this.menuConsultaGeneral;
      this.menuEmision = false;
      this.menuPagoPensiones = false;
      this.menuCatalogos = false;
    }else if (menu == 'menuReporteHerederos') {
      this.menuReporteHerederos = !this.menuReporteHerederos;
      this.menuEmision = false;
      this.menuPagoPensiones = false;
      this.menuCatalogos = false;
      this.menuConsultaGeneral = false;
    } else if (menu == 'menuPagoPensiones') {
      if (this.activo == true) {
        this.activo = false;
      }
      this.menuPagoPensiones = !this.menuPagoPensiones;
      this.menuEmision = false;
      this.menuProcCalc = false;
      this.menuMantPrepoliza = false;
      this.menuTraspasoAFP = false;
      this.menuProduccion = false;
      this.menuRecepcionPrimas = false;
      this.menuArchivoConf = false;
      this.menuPrimasRecepcionadas = false;
      this.menuTraspasoPagoPensiones = false;
      this.menuTraspasoPolizas = false;
      this.menuTraspasos = false;
      this.menuArchivosContables = false;
      this.menuPrimaUnica = false;
      this.menuPrimerosPagos = false;
      this.menuCatalogos = false;
    } else if (menu == "menuProduccion") {
      this.menuProduccion = !this.menuProduccion;
      this.menuProcCalc = false;
      this.menuMantPrepoliza = false;
      this.menuTraspasoAFP = false;
      this.menuTraspasoPagoPensiones = false;
      this.menuTraspasoPolizas = false;
      this.menuTraspasos = false;
      this.menuArchivosContables = false;
      this.menuPrimaUnica = false;
      this.menuPrimerosPagos = false;
      this.menuCatalogos = false;
    } else if (menu == "menuMantencionInformacion") {
      this.menuMantencionInformacion = !this.menuMantencionInformacion;
      this.menuRegistroPagosTerceros = false;
      this.menuCalculoPension = false;
      this.menuReportesPP = false;
      this.menuCatalogos = false;
    } else if (menu == "menuCatalogos") {
      this.menuCatalogos = !this.menuCatalogos;
      this.menuEmision = false;
      this.menuProcCalc = false;
      this.menuProduccion = false;
      this.menuArchivoConf = false;
      this.menuTraspasoPagoPensiones = false;
      this.menuArchivosContables = false;
      this.menuPagoPensiones = false;
      this.menuMantencionInformacion = false;
      this.menuAntecedentesPensionado = false;
      this.menuRetencionJudicial = false;
      this.menuEndosos = false;
      this.menuCalculoPension = false;
      this.menuRegistroPagosTerceros = false;
      this.menuReportesPP = false;
    }

  }

  subMenu(submenu) {
    if (submenu == "menuProcCalc") {
      this.menuProcCalc = !this.menuProcCalc;
      this.menuProduccion = false;
      this.menuRecepcionPrimas = false;
      this.menuArchivoConf = false;
      this.menuPrimasRecepcionadas = false;
      this.menuTraspasoPagoPensiones = false;
      this.menuTraspasoPolizas = false;
      this.menuTraspasos = false;
      this.menuArchivosContables = false;
      this.menuPrimaUnica = false;
      this.menuPrimerosPagos = false;
    } else if (submenu == "menuRecepcionPrimas") {
      this.menuRecepcionPrimas = !this.menuRecepcionPrimas;
      this.menuArchivoConf = false;
      this.menuPrimasRecepcionadas = false;
    } else if (submenu == "menuArchivoConf") {
      this.menuArchivoConf = !this.menuArchivoConf;
      this.menuRecepcionPrimas = false;
      this.menuPrimasRecepcionadas = false;
    } else if (submenu == "menuTraspasoPagoPensiones") {
      this.menuTraspasoPagoPensiones = !this.menuTraspasoPagoPensiones;
      this.menuProcCalc = false;
      this.menuMantPrepoliza = false;
      this.menuTraspasoAFP = false;
      this.menuProduccion = false;
      this.menuRecepcionPrimas = false;
      this.menuArchivoConf = false;
      this.menuPrimasRecepcionadas = false;
      this.menuArchivosContables = false;
      this.menuPrimaUnica = false;
      this.menuPrimerosPagos = false;
    } else if (submenu == "menuArchivosContables") {
      this.menuArchivosContables = !this.menuArchivosContables;
      this.menuProcCalc = false;
      this.menuMantPrepoliza = false;
      this.menuTraspasoAFP = false;
      this.menuProduccion = false;
      this.menuRecepcionPrimas = false;
      this.menuArchivoConf = false;
      this.menuPrimasRecepcionadas = false;
      this.menuTraspasoPagoPensiones = false;
      this.menuTraspasoPolizas = false;
      this.menuTraspasos = false;
    } else if (submenu == "menuAntecedentesPensionado") {
      this.menuAntecedentesPensionado = !this.menuAntecedentesPensionado;
      this.menuEndosos = false;
      this.menuGenerarEndosos = false;
      this.menuRetencionJudicial = false;
      this.menuIngresoOrdenJudicial = false;
      this.menuInformeControl = false;
    } else if (submenu == "menuRetencionJudicial") {
      this.menuRetencionJudicial = !this.menuRetencionJudicial;
      this.menuAntecedentesPensionado = false;
      this.menuAntecedentesGenerales = false;
      this.menuAsignacionTutorApoderado = false;
      this.menuCertificadoSupervivenciaEstudios = false;
      this.menuArchivoDatosBeneficiario = false;
      this.menuEndosos = false;
      this.menuGenerarEndosos = false;
    } else if (submenu == "menuEndosos") {
      this.menuEndosos = !this.menuEndosos;
      this.menuAntecedentesPensionado = false;
      this.menuAntecedentesGenerales = false;
      this.menuAsignacionTutorApoderado = false;
      this.menuCertificadoSupervivenciaEstudios = false;
      this.menuArchivoDatosBeneficiario = false;
      this.menuRetencionJudicial = false;
      this.menuIngresoOrdenJudicial = false;
      this.menuInformeControl = false;
    }
    else if(submenu == "menuCalculoPension"){
      this.menuCalculoPension = !this.menuCalculoPension;
      this.menuMantencionInformacion = false;
      this.menuRegistroPagosTerceros = false;
    }
    else if(submenu == "menuPensionesRecurrentes"){
      this.menuPagosRecurrentes = !this.menuPagosRecurrentes;
      this.menuMantencionInformacion = false;
      this.menuRegistroPagosTerceros = false;

    }
    else if(submenu == "menuRegistroPagoTerceros"){
      this.menuRegistroPagosTerceros = !this.menuRegistroPagosTerceros;
      this.menuMantencionInformacion = false;

    }
    else if(submenu == "menuReportesPP"){
      this.menuReportesPP = !this.menuReportesPP;
      this.menuCalculoPension = false;
      this.menuMantencionInformacion = false;
      this.menuRegistroPagosTerceros = false;

    }
  }
  subsubMenu(submenu) {
    if (submenu == "menuMantPrepoliza") {
      this.menuMantPrepoliza = !this.menuMantPrepoliza;
      if (this.menuMantPrepoliza == true) {
        this.menuTraspasoAFP = false;
      }
    } else if (submenu == "menuTraspasoAFP") {
      this.menuTraspasoAFP = !this.menuTraspasoAFP;
      if (this.menuTraspasoAFP == true) {
        this.menuMantPrepoliza = false;
      }
    } else if (submenu == "menuPrimasRecepcionadas") {
      this.menuPrimasRecepcionadas = !this.menuPrimasRecepcionadas;
      this.menuRecepcionPrimas = false;
      this.menuArchivoConf = false;
    } else if (submenu == "menuTraspasoPolizas") {
      this.menuTraspasoPolizas = !this.menuTraspasoPolizas;
      this.menuTraspasos = false;
    } else if (submenu == "menuTraspasos") {
      this.menuTraspasos = !this.menuTraspasos;
      this.menuTraspasoPolizas = false;
    } else if (submenu == "menuPrimaUnica") {
      this.menuPrimaUnica = !this.menuPrimaUnica;
      this.menuPrimerosPagos = false;
    } else if (submenu == "menuPrimerosPagos") {
      this.menuPrimerosPagos = !this.menuPrimerosPagos;
      this.menuPrimaUnica = false;
    } else if (submenu == "menuAntecedentesGenerales") {
      this.menuAntecedentesGenerales = !this.menuAntecedentesGenerales;
      this.menuAsignacionTutorApoderado = false;
      this.menuCertificadoSupervivenciaEstudios = false;
      this.menuArchivoDatosBeneficiario = false;
    } else if (submenu == "menuAsignacionTutorApoderado") {
      this.menuAsignacionTutorApoderado = !this.menuAsignacionTutorApoderado;
      this.menuAntecedentesGenerales = false;
      this.menuCertificadoSupervivenciaEstudios = false;
      this.menuArchivoDatosBeneficiario = false;
    } else if (submenu == "menuCertificadoSupervivenciaEstudios") {
      this.menuCertificadoSupervivenciaEstudios = !this
        .menuCertificadoSupervivenciaEstudios;
      this.menuAsignacionTutorApoderado = false;
      this.menuAntecedentesGenerales = false;
      this.menuArchivoDatosBeneficiario = false;
    } else if (submenu == "menuArchivoDatosBeneficiario") {
      this.menuArchivoDatosBeneficiario = !this.menuArchivoDatosBeneficiario;
      this.menuAsignacionTutorApoderado = false;
      this.menuAntecedentesGenerales = false;
      this.menuCertificadoSupervivenciaEstudios = false;
    } else if (submenu == "menuIngresoOrdenJudicial") {
      this.menuIngresoOrdenJudicial = !this.menuIngresoOrdenJudicial;
      this.menuInformeControl = false;
    } else if (submenu == "menuInformeControl") {
      this.menuInformeControl = !this.menuInformeControl;
      this.menuIngresoOrdenJudicial = false;
    } else if (submenu == "menuGenerarEndosos") {
      this.menuGenerarEndosos = !this.menuGenerarEndosos;
    }
  }
  cerrarMenu() {
    this.menuEmision = false;
    this.menuConsultaGeneral = false;
    this.menuPagoPensiones = false;
    this.menuProcCalc = false;
    this.menuMantPrepoliza = false;
    this.menuTraspasoAFP = false;
    this.menuProduccion = false;
    this.menuRecepcionPrimas = false;
    this.menuArchivoConf = false;
    this.menuPrimasRecepcionadas = false;
    this.menuTraspasoPagoPensiones = false;
    this.menuTraspasoPolizas = false;
    this.menuTraspasos = false;
    this.menuArchivosContables = false;
    this.menuPrimaUnica = false;
    this.menuPrimerosPagos = false;
    this.menuMantencionInformacion = false;
    this.menuAntecedentesPensionado = false;
    this.menuAntecedentesGenerales = false;
    this.menuAsignacionTutorApoderado = false;
    this.menuCertificadoSupervivenciaEstudios = false;
    this.menuArchivoDatosBeneficiario = false;
    this.menuRetencionJudicial = false;
    this.menuIngresoOrdenJudicial = false;
    this.menuInformeControl = false;
    this.menuEndosos = false;
    this.menuGenerarEndosos = false;
  }
  ngOnInit() {
    this.getImagenLogo();
    this.urlCotizador = 'http://rrvv-bk.vivirseguros.pe/Estudio/Oficiales?idUsuario=' + localStorage.getItem('currentUser');
    this.urlCotizadorCerrarSesion = 'http://rrvv-bk.vivirseguros.pe/Estudio/Login';
  }

  getImagenLogo() {
    this.consultaImagen.getImagen().then( (resp: any) => {
      const objectURL = 'data:image/png;base64,' + resp.Data;
      this.imagenLogo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.titleLogo = resp.Nombre;
    });
  }


  setTimeout(){
    if(this.currentUser){
      this.userActivity = setTimeout(() => this.userInactive.next(undefined), 1000*60*30*2);
    }
  }
  @HostListener('window:mousemove') refreshUserState(){
    if(this.currentUser){
      clearTimeout(this.userActivity);
      this.setTimeout();
    }
  }

  logout(){
    this.serviceLog.logout();

    this.router.navigate(['/inicio']);
  }

}
