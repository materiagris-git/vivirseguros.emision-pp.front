import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { API_BASE_URL } from '../providers/traspaso-poliza.service';
import { AppConsts } from '../app/AppConst';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { PrimaUnicaComponent } from './components/prima-unica/prima-unica.component';
import { MantenedorPrepolizasComponent } from './components/mantenedor-prepolizas/mantenedor-prepolizas.component';
import { ConsultaPrimasrecepcionadasComponent } from './components/consulta-primasrecepcionadas/consulta-primasrecepcionadas.component';
import { MantenedorIngresoPrimasComponent } from './components/mantenedor-ingreso-primas/mantenedor-ingreso-primas.component';
import { ConsultapolizasTraspasadasComponent } from './components/consultapolizas-traspasadas/consultapolizas-traspasadas.component';
import { ArchivoConfirmacionPrimasComponent } from './components/archivoconfirmacion-primas/archivoconfirmacion-prima.component';
import { ConsultaPolizaComponent } from './components/consulta-poliza/consulta-poliza.component';
import { TrasppolrecibidasPagopensionesComponent } from './components/trasppolrecibidas-pagopensiones/trasppolrecibidas-pagopensiones.component';
import { AntecentesprimaAfpComponent } from './components/antecentesprima-afp/antecentesprima-afp.component';
import { DatosConsultaGeneralComponent } from './components/datos-consulta-general/datos-consulta-general.component';
import { ArchivoscontablesPrimerospagosComponent } from './components/archivoscontables-primerospagos/archivoscontables-primerospagos.component';
import { ConsultaPagotercerosComponent } from './components/consulta-pagoterceros/consulta-pagoterceros.component';
import { GeneracionArchcontPagosrecurrentesComponent } from './components/generacion-archcont-pagosrecurrentes/generacion-archcont-pagosrecurrentes.component';
import { ParametrosPagosRecurrentesComponent } from './components/parametros-pagos-recurrentes/parametros-pagos-recurrentes.component';
import { NumberPipePipe } from './components/antecentesprima-afp/number-pipe.pipe';
import { MantencionAntecedentesPensionadoComponent } from './components/mantencion-antecedentes-pensionado/mantencion-antecedentes-pensionado.component';
import { ConsultaMantenedorTutoresApoderadosComponent } from './components/consulta-mantenedor-tutores-apoderados/consulta-mantenedor-tutores-apoderados.component';
import { MantenedorTutoresApoderadosComponent } from './components/mantenedor-tutores-apoderados/mantenedor-tutores-apoderados.component';
import { ConsultaPolizaAntecedentesPensionadoComponent } from './components/consulta-poliza-antecedentes-pensionado/consulta-poliza-antecedentes-pensionado.component';
import { ConsultaPolMantenedorCertSupervivenciaEstudiosComponent } from './components/consulta-pol-mantenedor-cert-supervivencia-estudios/consulta-pol-mantenedor-cert-supervivencia-estudios.component';
import { MantenedorCertSupervivenciaEstudiosComponent } from './components/mantenedor-cert-supervivencia-estudios/mantenedor-cert-supervivencia-estudios.component';
import { ConsultaGeneralComponent } from './components/consulta-general/consulta-general.component';
import { ConsultaPrepolizasComponent } from './components/consulta-prepolizas/consulta-prepolizas.component';
import { ConsultaAntprimaAfpComponent } from './components/consulta-antprima-afp/consulta-antprima-afp.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConsultaIngresoPrimasComponent } from './components/consulta-ingreso-primas/consulta-ingreso-primas.component';
import { MantenedorRetencionesJudicialesComponent } from './components/mantenedor-retenciones-judiciales/mantenedor-retenciones-judiciales.component';
import { ConsultaPagostercerosGsComponent } from './components/consulta-pagosterceros-gs/consulta-pagosterceros-gs.component';
import { ArchivoDatosBeneficiarioComponent } from './components/archivo-datos-beneficiario/archivo-datos-beneficiario.component';
import { ConsultaPagostercerosPgComponent } from './components/consulta-pagosterceros-pg/consulta-pagosterceros-pg.component';
import { MantenedorEndososSimplesActuarialesComponent } from './components/mantenedor-endosos-simples-actuariales/mantenedor-endosos-simples-actuariales.component';
import { CalculoPagosRecurrentesComponent } from './components/calculo-pagos-recurrentes/calculo-pagos-recurrentes.component';
import { MatSortModule } from '@angular/material/sort';
import { RetencionJudicialOrdenComponent } from './components/retencion-judicial-orden/retencion-judicial-orden.component';
import { BusquedaPagotercerosComponent } from './components/busqueda-pagoterceros/busqueda-pagoterceros.component';
import { PagoTercerosComponent } from './components/pago-terceros/pago-terceros.component';
import { InformeControlRetencionJudicialComponent } from './components/informe-control-retencion-judicial/informe-control-retencion-judicial.component';
import { MantencionCalendarioPagosComponent } from './components/mantencion-calendario-pagos/mantencion-calendario-pagos.component';
import { MantencionPagosTercerosPeriodoGarantizadoComponent } from './components/mantencion-pagos-terceros-periodo-garantizado/mantencion-pagos-terceros-periodo-garantizado.component';
import { FechaPagosRecurrentesComponent } from './components/FechaPagosRecurrentes/fecha-pagos-recurrentes.component';

import { DecimalPipe } from '@angular/common';
import { MantencionPagosTercerosGastosSepelioComponent } from './components/mantencion-pagos-terceros-gastos-sepelio/mantencion-pagos-terceros-gastos-sepelio.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { AuthGuardPPPrePolizas } from './guards/AuthGuardPPPrePolizas';
import { AuthGuardArchivoConfirmacion } from './guards/AuthGuardPPArchivoConfirmacion';
import { AuthGuardPPPrimaAfp } from './guards/AuthGuardPPPrimaAfp';
import { AuthGuardPPAntecedentesPensionado } from './guards/AuthGuardPPAntecedentesPensionado';
import { AuthGuardPPCalculoPagosRecu } from './guards/AuthGuardPPCalculoPagosRecu';
import { AuthGuardPPCalendarioPagos } from './guards/AuthGuardPPCalendarioPagos';
import { AuthGuardPPCertSupervivencia } from './guards/AuthGuardPPCertSupervivencia';
import { AuthGuardPPConsultaGeneral } from './guards/AuthGuardPPConsultaGeneral';
import { AuthGuardPPConsultaTraspasos } from './guards/AuthGuardPPConsultaTraspasos';
import { AuthGuardPPGenArDatosBen } from './guards/AuthGuardPPGenArDatosBen';
import { AuthGuardPPGenArPrimaUnica } from './guards/AuthGuardPPGenArPrimaUnica';
import { AuthGuardPPGenArPrimerosPagos } from './guards/AuthGuardPPGenArPrimerosPagos';
import { AuthGuardPPGenerarEndoso } from './guards/AuthGuardPPGenerarEndoso';
import { AuthGuardPPCalculoPagosTercerosGS } from './guards/AuthGuardPPPagosTercerosGS';
import { AuthGuardPPCalculoPagosTercerosPG } from './guards/AuthGuardPPPagosTercerosPG';
import { AuthGuardPPPrimasRecepcionadas } from './guards/AuthGuardPPPrimasRecepcionadas';
import { AuthGuardRecepcionPrima } from './guards/AuthGuardPPRecepcionPrima';
import { AuthGuardPPRetencionJudicial } from './guards/AuthGuardPPRetencionJudicial';
import { AuthGuardPPTraspasoPolizas } from './guards/AuthGuardPPTraspasoPolizas';
import { AuthGuardPPTutoresApoderados } from './guards/AuthGuardPPTutoresApoderados';
import { AuthGuardPPArchivoPagosRecurrentes } from './guards/AuthGuardArchivoPagosRecurrentes';
import { AuthGuardPPPagosTerceros } from './guards/AuthGuardPPPagosTerceros';
import { AuthGuardPPInformeControlRetJud } from './guards/AuthGuardPPInformeControlRetJud';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ConsultaHijosCumpliranMayoriaEdadComponent } from './components/consulta-hijos-cumpliran-mayoria-edad/consulta-hijos-cumpliran-mayoria-edad.component';
import { GeneracionArchivoCotizacionEsSaludComponent } from './components/generacion-archivo-cotizacion-es-salud/generacion-archivo-cotizacion-es-salud.component';
import { AuthGuardPPConsultaHijosMayoresEdad } from './guards/AuthGuardPPConsultaHijosMayoresEdad';
import { AuthGuardPPGenerarArchivoEsSalud } from './guards/AuthGuardPPGenerarArchivoEsSalud';
import { DecimalPipePipe } from './decimal-pipe.pipe';
import { InformeNormativoComponent } from './components/informe-normativo/informe-normativo.component';
import { AuthGuardPPInformeNormativo } from './guards/AuthGuardPPInformeNormativo';
import { NgxSpinnerModule } from "ngx-spinner";
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import { MantenimientoUbigeoComponent } from './components/mantenimiento-ubigeo/mantenimiento-ubigeo.component';
import { AuthGuardPPMantenimientoUbigeo } from "./guards/AuthGuardPPMantenimientoUbigeo";
import { AuthGuardPPCatalogoGeneral } from './guards/AuthGuardPPCatalogoGeneral';
import { MantenimientoTipoDocumentoComponent } from './components/mantenimiento-tipo-documento/mantenimiento-tipo-documento.component';
import { AuthGuardPPMantenimientoTipoDoc } from './guards/AuthGuardPPMantenimientoTipoDoc';
import { MantenimientoGeneralComponent } from './components/mantenimiento-general/mantenimiento-general.component';
import { AuthGuardPPMantenimientoGeneral } from './guards/AuthGuardPPMantenimientoGeneral';
import { AuthGuardPPFechaPagosRecu } from './guards/AuthGuardPPFechaPagosRecu';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { AuthGuardPPEstadisticas } from './guards/AuthGuardEstadisticas';
import { ReporteHerederosComponent } from './components/reporte-herederos/reporte-herederos.component';
import { AuthGuardPPReporteHerederos } from './guards/AuthGuardPPReporteHerederos';
import { ConsultaIndicadoresComponent } from './components/consulta-indicadores/consulta-indicadores.component';
import { AuthGuardPPConsultaIndicadores } from './guards/AuthGuardPPConsultaIndicadores';
import { HijosMayoresComponent } from './components/hijos-mayores/hijos-mayores.component';
import { AuthGuardPPHijosMayores } from './guards/AuthGuardPPHijosMayores';
import { CorreosInicioPolizaComponent } from './components/correos-inicio-poliza/correos-inicio-poliza.component';
import { AuthGuardPPCorreoInicioPoliza } from './guards/AuthGuardPPCorreoInicioPoliza';
import { PagosSuspendidosComponent } from './components/pagos-suspendidos/pagos-suspendidos.component';
import { AuthGuardPPPagosSuspendidos } from './guards/AuthGuardPPPagosSuspendidos';

export function getBaseUrl(): string {
  return AppConsts.baseUrl;
}

@NgModule({
  declarations: [
    AppComponent,
    PrimaUnicaComponent,
    MantenedorPrepolizasComponent,
    ConsultaPrimasrecepcionadasComponent,
    MantenedorIngresoPrimasComponent,
    ConsultapolizasTraspasadasComponent,
    ArchivoConfirmacionPrimasComponent,
    ConsultaPolizaComponent,
    TrasppolrecibidasPagopensionesComponent,
    AntecentesprimaAfpComponent,
    DatosConsultaGeneralComponent,
    ArchivoscontablesPrimerospagosComponent,
    ConsultaPagotercerosComponent,
    GeneracionArchcontPagosrecurrentesComponent,
    ParametrosPagosRecurrentesComponent,
    NumberPipePipe,
    MantencionAntecedentesPensionadoComponent,
    ConsultaMantenedorTutoresApoderadosComponent,
    MantenedorTutoresApoderadosComponent,
    ConsultaPolizaAntecedentesPensionadoComponent,
    ConsultaPolMantenedorCertSupervivenciaEstudiosComponent,
    MantenedorCertSupervivenciaEstudiosComponent,
    ConsultaGeneralComponent,
    ConsultaPrepolizasComponent,
    ConsultaAntprimaAfpComponent,
    ConsultaIngresoPrimasComponent,
    MantenedorRetencionesJudicialesComponent,
    ConsultaPagostercerosGsComponent,
    ArchivoDatosBeneficiarioComponent,
    ConsultaPagostercerosPgComponent,
    MantenedorEndososSimplesActuarialesComponent,
    CalculoPagosRecurrentesComponent,
    RetencionJudicialOrdenComponent,
    BusquedaPagotercerosComponent,
    PagoTercerosComponent,
    InformeControlRetencionJudicialComponent,
    MantencionCalendarioPagosComponent,
    MantencionPagosTercerosPeriodoGarantizadoComponent,
    MantencionPagosTercerosGastosSepelioComponent,
    PrincipalComponent,
    ConsultaHijosCumpliranMayoriaEdadComponent,
    GeneracionArchivoCotizacionEsSaludComponent,
    DecimalPipePipe,
    InformeNormativoComponent,
    CatalogosComponent,
    MantenimientoUbigeoComponent,
    MantenimientoTipoDocumentoComponent,
    MantenimientoGeneralComponent,
    FechaPagosRecurrentesComponent,
    EstadisticasComponent,
    ReporteHerederosComponent,
    ConsultaIndicadoresComponent,
    HijosMayoresComponent,
    CorreosInicioPolizaComponent,
    PagosSuspendidosComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatSortModule, MatSelectFilterModule,
    NgxSpinnerModule
  ],
  providers: [{ provide: API_BASE_URL, useFactory: getBaseUrl }, DecimalPipe,AuthGuardPPPrePolizas, AuthGuardArchivoConfirmacion,AuthGuardPPPrimaAfp, AuthGuardPPAntecedentesPensionado
  ,AuthGuardArchivoConfirmacion, AuthGuardPPCalculoPagosRecu, AuthGuardPPCalendarioPagos, AuthGuardPPCertSupervivencia, AuthGuardPPConsultaGeneral, AuthGuardPPConsultaTraspasos,
  AuthGuardPPGenArDatosBen, AuthGuardPPGenArPrimaUnica, AuthGuardPPGenArPrimerosPagos, AuthGuardPPGenerarEndoso, AuthGuardPPCalculoPagosTercerosGS, AuthGuardPPCalculoPagosTercerosPG,
  AuthGuardPPPrimasRecepcionadas, AuthGuardRecepcionPrima, AuthGuardPPRetencionJudicial, AuthGuardPPTraspasoPolizas, AuthGuardPPTutoresApoderados, AuthGuardPPArchivoPagosRecurrentes,
  AuthGuardPPPagosTerceros, AuthGuardPPInformeControlRetJud,AuthGuardPPConsultaHijosMayoresEdad,AuthGuardPPGenerarArchivoEsSalud, AuthGuardPPInformeNormativo, AuthGuardPPMantenimientoUbigeo, 
  AuthGuardPPCatalogoGeneral, AuthGuardPPMantenimientoTipoDoc, AuthGuardPPMantenimientoGeneral, AuthGuardPPFechaPagosRecu, AuthGuardPPEstadisticas, AuthGuardPPReporteHerederos, AuthGuardPPConsultaIndicadores,
  AuthGuardPPHijosMayores,AuthGuardPPCorreoInicioPoliza, AuthGuardPPPagosSuspendidos],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
]
})
export class AppModule { }
