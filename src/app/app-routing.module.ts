import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrimaUnicaComponent } from './components/prima-unica/prima-unica.component';
import { MantenedorPrepolizasComponent } from './components/mantenedor-prepolizas/mantenedor-prepolizas.component';
import { ConsultaPrimasrecepcionadasComponent } from './components/consulta-primasrecepcionadas/consulta-primasrecepcionadas.component';
import { ConsultapolizasTraspasadasComponent } from './components/consultapolizas-traspasadas/consultapolizas-traspasadas.component';
import { MantenedorIngresoPrimasComponent } from './components/mantenedor-ingreso-primas/mantenedor-ingreso-primas.component';
import { ArchivoConfirmacionPrimasComponent } from './components/archivoconfirmacion-primas/archivoconfirmacion-prima.component';
import { ConsultaPolizaComponent } from './components/consulta-poliza/consulta-poliza.component';
import { TrasppolrecibidasPagopensionesComponent } from './components/trasppolrecibidas-pagopensiones/trasppolrecibidas-pagopensiones.component';
import { AntecentesprimaAfpComponent } from './components/antecentesprima-afp/antecentesprima-afp.component';
import { DatosConsultaGeneralComponent } from './components/datos-consulta-general/datos-consulta-general.component';
import { ArchivoscontablesPrimerospagosComponent } from './components/archivoscontables-primerospagos/archivoscontables-primerospagos.component';
import { ConsultaPagotercerosComponent } from './components/consulta-pagoterceros/consulta-pagoterceros.component';
import { GeneracionArchcontPagosrecurrentesComponent } from './components/generacion-archcont-pagosrecurrentes/generacion-archcont-pagosrecurrentes.component';
import { ParametrosPagosRecurrentesComponent } from './components/parametros-pagos-recurrentes/parametros-pagos-recurrentes.component';
import { MantencionAntecedentesPensionadoComponent } from './components/mantencion-antecedentes-pensionado/mantencion-antecedentes-pensionado.component';
import { ConsultaMantenedorTutoresApoderadosComponent } from './components/consulta-mantenedor-tutores-apoderados/consulta-mantenedor-tutores-apoderados.component';
import { MantenedorTutoresApoderadosComponent } from './components/mantenedor-tutores-apoderados/mantenedor-tutores-apoderados.component';
import { ConsultaPolizaAntecedentesPensionadoComponent } from './components/consulta-poliza-antecedentes-pensionado/consulta-poliza-antecedentes-pensionado.component';
import { ConsultaPolMantenedorCertSupervivenciaEstudiosComponent } from './components/consulta-pol-mantenedor-cert-supervivencia-estudios/consulta-pol-mantenedor-cert-supervivencia-estudios.component';
import { MantenedorCertSupervivenciaEstudiosComponent } from './components/mantenedor-cert-supervivencia-estudios/mantenedor-cert-supervivencia-estudios.component';
import { ConsultaGeneralComponent } from './components/consulta-general/consulta-general.component';
import { ConsultaPrepolizasComponent } from './components/consulta-prepolizas/consulta-prepolizas.component';
import { ConsultaAntprimaAfpComponent } from './components/consulta-antprima-afp/consulta-antprima-afp.component';
import { ConsultaIngresoPrimasComponent } from './components/consulta-ingreso-primas/consulta-ingreso-primas.component';
import { MantenedorRetencionesJudicialesComponent } from './components/mantenedor-retenciones-judiciales/mantenedor-retenciones-judiciales.component';
import { ConsultaPagostercerosGsComponent } from './components/consulta-pagosterceros-gs/consulta-pagosterceros-gs.component';
import { ArchivoDatosBeneficiarioComponent } from './components/archivo-datos-beneficiario/archivo-datos-beneficiario.component';
import { ConsultaPagostercerosPgComponent } from './components/consulta-pagosterceros-pg/consulta-pagosterceros-pg.component';
import { MantenedorEndososSimplesActuarialesComponent } from './components/mantenedor-endosos-simples-actuariales/mantenedor-endosos-simples-actuariales.component';
import { CalculoPagosRecurrentesComponent } from './components/calculo-pagos-recurrentes/calculo-pagos-recurrentes.component';
import { FechaPagosRecurrentesComponent } from './components/FechaPagosRecurrentes/fecha-pagos-recurrentes.component';
import { RetencionJudicialOrdenComponent } from './components/retencion-judicial-orden/retencion-judicial-orden.component';
import { BusquedaPagotercerosComponent } from './components/busqueda-pagoterceros/busqueda-pagoterceros.component';
import { PagoTercerosComponent } from './components/pago-terceros/pago-terceros.component';
import { InformeControlRetencionJudicialComponent } from './components/informe-control-retencion-judicial/informe-control-retencion-judicial.component';
import { MantencionCalendarioPagosComponent } from './components/mantencion-calendario-pagos/mantencion-calendario-pagos.component';
import { MantencionPagosTercerosPeriodoGarantizadoComponent } from './components/mantencion-pagos-terceros-periodo-garantizado/mantencion-pagos-terceros-periodo-garantizado.component';
import { MantencionPagosTercerosGastosSepelioComponent } from './components/mantencion-pagos-terceros-gastos-sepelio/mantencion-pagos-terceros-gastos-sepelio.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import {AuthGuardPPPrePolizas} from './guards/AuthGuardPPPrePolizas';
import { AuthGuardPPPrimaAfp } from './guards/AuthGuardPPPrimaAfp';
import { AuthGuardRecepcionPrima } from './guards/AuthGuardPPRecepcionPrima';
import { AuthGuardArchivoConfirmacion } from './guards/AuthGuardPPArchivoConfirmacion';
import { AuthGuardPPTraspasoPolizas } from './guards/AuthGuardPPTraspasoPolizas';
import { AuthGuardPPConsultaTraspasos } from './guards/AuthGuardPPConsultaTraspasos';
import { AuthGuardPPTutoresApoderados } from './guards/AuthGuardPPTutoresApoderados';
import { AuthGuardPPGenArPrimaUnica } from './guards/AuthGuardPPGenArPrimaUnica';
import { AuthGuardPPGenArPrimerosPagos } from './guards/AuthGuardPPGenArPrimerosPagos';
import { AuthGuardPPConsultaGeneral } from './guards/AuthGuardPPConsultaGeneral';
import { AuthGuardPPAntecedentesPensionado } from './guards/AuthGuardPPAntecedentesPensionado';
import { AuthGuardPPCertSupervivencia } from './guards/AuthGuardPPCertSupervivencia';
import { AuthGuardPPGenArDatosBen } from './guards/AuthGuardPPGenArDatosBen';
import { AuthGuardPPRetencionJudicial } from './guards/AuthGuardPPRetencionJudicial';
import { AuthGuardPPInformeControlRetJud } from './guards/AuthGuardPPInformeControlRetJud';
import { AuthGuardPPGenerarEndoso } from './guards/AuthGuardPPGenerarEndoso';
import { AuthGuardPPCalendarioPagos } from './guards/AuthGuardPPCalendarioPagos';
import { AuthGuardPPCalculoPagosRecu } from './guards/AuthGuardPPCalculoPagosRecu';
import { AuthGuardPPFechaPagosRecu } from './guards/AuthGuardPPFechaPagosRecu';
import { AuthGuardPPPrimasRecepcionadas } from './guards/AuthGuardPPPrimasRecepcionadas';
import { AuthGuardPPCalculoPagosTercerosGS } from './guards/AuthGuardPPPagosTercerosGS';
import { AuthGuardPPCalculoPagosTercerosPG } from './guards/AuthGuardPPPagosTercerosPG';
import { AuthGuardPPArchivoPagosRecurrentes } from './guards/AuthGuardArchivoPagosRecurrentes';
import { AuthGuardPPPagosTerceros } from './guards/AuthGuardPPPagosTerceros';
import { AuthGuardPPConsultaHijosMayoresEdad } from './guards/AuthGuardPPConsultaHijosMayoresEdad';
import { AuthGuardPPGenerarArchivoEsSalud} from './guards/AuthGuardPPGenerarArchivoEsSalud';
import { ConsultaHijosCumpliranMayoriaEdadComponent } from './components/consulta-hijos-cumpliran-mayoria-edad/consulta-hijos-cumpliran-mayoria-edad.component';
import { GeneracionArchivoCotizacionEsSaludComponent } from './components/generacion-archivo-cotizacion-es-salud/generacion-archivo-cotizacion-es-salud.component';
import {InformeNormativoComponent} from './components/informe-normativo/informe-normativo.component';
import { AuthGuardPPInformeNormativo } from './guards/AuthGuardPPInformeNormativo';
import { MantenimientoUbigeoComponent } from './components/mantenimiento-ubigeo/mantenimiento-ubigeo.component';
import { AuthGuardPPMantenimientoUbigeo } from './guards/AuthGuardPPMantenimientoUbigeo';
import { AuthGuardPPCatalogoGeneral } from './guards/AuthGuardPPCatalogoGeneral';
import { MantenimientoTipoDocumentoComponent } from './components/mantenimiento-tipo-documento/mantenimiento-tipo-documento.component';
import { AuthGuardPPMantenimientoTipoDoc } from './guards/AuthGuardPPMantenimientoTipoDoc';
import { MantenimientoGeneralComponent } from './components/mantenimiento-general/mantenimiento-general.component';
import { AuthGuardPPMantenimientoGeneral } from './guards/AuthGuardPPMantenimientoGeneral';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { AuthGuardPPEstadisticas } from './guards/AuthGuardEstadisticas';
import { ReporteHerederosComponent } from './components/reporte-herederos/reporte-herederos.component';
import { AuthGuardPPReporteHerederos } from './guards/AuthGuardPPReporteHerederos';
import { ConsultaIndicadoresComponent } from './components/consulta-indicadores/consulta-indicadores.component';
import { AuthGuardPPConsultaIndicadores } from './guards/AuthGuardPPConsultaIndicadores';
import { AuthGuardPPHijosMayores } from './guards/AuthGuardPPHijosMayores';
import { HijosMayoresComponent } from './components/hijos-mayores/hijos-mayores.component';
import { CorreosInicioPolizaComponent } from './components/correos-inicio-poliza/correos-inicio-poliza.component';
import { AuthGuardPPCorreoInicioPoliza } from './guards/AuthGuardPPCorreoInicioPoliza';
import { PagosSuspendidosComponent } from './components/pagos-suspendidos/pagos-suspendidos.component';
import { AuthGuardPPPagosSuspendidos } from './guards/AuthGuardPPPagosSuspendidos';

const routes: Routes = [
  { path: "", redirectTo: "/inicio", pathMatch: "full" },
  { path: "inicio", component:PrincipalComponent },
  { path: 'inicio/:idUs', component:PrincipalComponent},
  { path: 'primaUnica', component: PrimaUnicaComponent, canActivate:[AuthGuardPPGenArPrimaUnica] },
  { path: 'consultaPrePolizas', component: ConsultaPrepolizasComponent, canActivate:[AuthGuardPPPrePolizas] },
  { path: 'mantenedorPrepolizas/:tipo/:poliza/:pantalla', component: MantenedorPrepolizasComponent,canActivate:[AuthGuardPPPrePolizas] },
  { path: 'consultaPrimasRecepcionadas', component: ConsultaPrimasrecepcionadasComponent, canActivate:[AuthGuardPPPrimasRecepcionadas] },
  { path: 'consultaIngresoPrimas', component: ConsultaIngresoPrimasComponent, canActivate:[AuthGuardRecepcionPrima] },
  { path: 'mantenedorIngresoPrimas/:poliza', component: MantenedorIngresoPrimasComponent, canActivate:[AuthGuardRecepcionPrima] },
  { path: 'consultaPolizasTraspasadas', component: ConsultapolizasTraspasadasComponent, canActivate:[AuthGuardPPConsultaTraspasos] },
  { path: 'archivoConfirmacionPrimas', component: ArchivoConfirmacionPrimasComponent, canActivate:[AuthGuardArchivoConfirmacion] },
  { path: 'consultaPoliza', component: ConsultaPolizaComponent, canActivate:[AuthGuardPPGenerarEndoso] },
  { path: 'trasPolPagoPensiones', component: TrasppolrecibidasPagopensionesComponent, canActivate:[AuthGuardPPTraspasoPolizas] },
  { path: 'consultaAntPrimaAfp', component: ConsultaAntprimaAfpComponent, canActivate:[AuthGuardPPPrimaAfp] },
  { path: 'antecedentesPrimaAfp/:poliza', component: AntecentesprimaAfpComponent, canActivate:[AuthGuardPPPrimaAfp]  },
  { path: 'datosConsultaGeneral', component: DatosConsultaGeneralComponent, canActivate:[AuthGuardPPConsultaGeneral] },
  { path: 'archConPrimPagos', component: ArchivoscontablesPrimerospagosComponent, canActivate:[AuthGuardPPGenArPrimerosPagos] },
  { path: 'busquedaPagoTerceros', component: BusquedaPagotercerosComponent, canActivate:[AuthGuardPPPagosTerceros] },
  { path: 'consultaPrimPagos', component: ConsultaPagotercerosComponent }, //ignorar este, no tiene back
  { path: 'genACPagosRecurrentes', component: GeneracionArchcontPagosrecurrentesComponent, canActivate:[AuthGuardPPArchivoPagosRecurrentes] },
  { path: 'parametrosPagos', component: ParametrosPagosRecurrentesComponent }, //ignorar este, no tiene back
  { path: 'consultaGeneral', component: ConsultaGeneralComponent, canActivate:[AuthGuardPPConsultaGeneral] },
  { path: 'mantencionAntecedentesPensionado', component:MantencionAntecedentesPensionadoComponent, canActivate:[AuthGuardPPAntecedentesPensionado] },
  { path: 'consultaMantenedorTutoresApoderados' , component:ConsultaMantenedorTutoresApoderadosComponent, canActivate:[AuthGuardPPTutoresApoderados] },
  { path: 'mantenedorTutoresApoderados', component:MantenedorTutoresApoderadosComponent, canActivate:[AuthGuardPPTutoresApoderados] },
  { path: 'consultaPolizaAntecedentesPensionado' , component: ConsultaPolizaAntecedentesPensionadoComponent, canActivate:[AuthGuardPPAntecedentesPensionado]},
  { path: 'mantenedorCertificadosSupervivenciaEstudios', component: MantenedorCertSupervivenciaEstudiosComponent, canActivate:[AuthGuardPPCertSupervivencia]},
  { path: 'consultaPolizaMantCertSE', component: ConsultaPolMantenedorCertSupervivenciaEstudiosComponent, canActivate:[AuthGuardPPCertSupervivencia]},
  { path: 'hijosMayores', component: HijosMayoresComponent, canActivate:[AuthGuardPPHijosMayores]},
  { path: 'retencionesJudiciales', component: MantenedorRetencionesJudicialesComponent, canActivate:[AuthGuardPPRetencionJudicial]},
  { path: 'consultaPagoTercerosGS', component: ConsultaPagostercerosGsComponent, canActivate:[AuthGuardPPCalculoPagosTercerosGS]},
  { path: 'ArchivoDatosBeneficiarios', component: ArchivoDatosBeneficiarioComponent, canActivate:[AuthGuardPPGenArDatosBen]},
  { path: 'consultaPagoTercerosPG', component: ConsultaPagostercerosPgComponent, canActivate:[AuthGuardPPCalculoPagosTercerosPG]},
  { path: 'mantenedorEndososSimplesActuariales', component: MantenedorEndososSimplesActuarialesComponent, canActivate:[AuthGuardPPGenerarEndoso]},
  { path: 'calculoPagosRecurrentes', component: CalculoPagosRecurrentesComponent, canActivate:[AuthGuardPPCalculoPagosRecu] },
  { path: 'fechaPagosRecurrentes', component: FechaPagosRecurrentesComponent, canActivate:[AuthGuardPPFechaPagosRecu] },
  { path: 'retencionJudicialOrden', component: RetencionJudicialOrdenComponent, canActivate:[AuthGuardPPRetencionJudicial]},
  { path: 'PagoTerceros', component: PagoTercerosComponent, canActivate:[AuthGuardPPPagosTerceros]},
  { path: 'InformeControlRetencionJudicial', component: InformeControlRetencionJudicialComponent, canActivate:[AuthGuardPPInformeControlRetJud]},
  { path: 'MantencionCalendario', component: MantencionCalendarioPagosComponent, canActivate:[AuthGuardPPCalendarioPagos]},
  { path: 'mantencionPagosTercerosPerGar', component: MantencionPagosTercerosPeriodoGarantizadoComponent, canActivate:[AuthGuardPPCalculoPagosTercerosPG]},
  { path: 'gastosSepelio', component: MantencionPagosTercerosGastosSepelioComponent, canActivate:[AuthGuardPPCalculoPagosTercerosGS]},
  { path: 'ConsultaHijosMayoresEdad', component: ConsultaHijosCumpliranMayoriaEdadComponent, canActivate:[AuthGuardPPConsultaHijosMayoresEdad]},
  { path: 'GeneracionArchivoEsSalud', component: GeneracionArchivoCotizacionEsSaludComponent, canActivate:[AuthGuardPPGenerarArchivoEsSalud]},
  { path: 'informeNormativo', component: InformeNormativoComponent, canActivate:[AuthGuardPPInformeNormativo]},
  { path: 'catalogos', component: CatalogosComponent, canActivate:[AuthGuardPPCatalogoGeneral]},
  { path: 'mantenimientoUbigeo', component: MantenimientoUbigeoComponent, canActivate:[AuthGuardPPMantenimientoUbigeo]},
  { path: 'mantenimientoTipoDoc', component: MantenimientoTipoDocumentoComponent, canActivate:[AuthGuardPPMantenimientoTipoDoc]},
  { path: 'mantenimientoGeneral', component: MantenimientoGeneralComponent, canActivate:[AuthGuardPPMantenimientoGeneral]},
  { path: 'estadisticas', component: EstadisticasComponent, canActivate:[AuthGuardPPEstadisticas]},
  { path: 'reporteHerederos', component: ReporteHerederosComponent, canActivate:[AuthGuardPPReporteHerederos]},
  { path: 'consultaIndicadores', component: ConsultaIndicadoresComponent, canActivate:[AuthGuardPPConsultaIndicadores]},
  { path: 'correoInicioPoliza', component: CorreosInicioPolizaComponent, canActivate:[AuthGuardPPCorreoInicioPoliza]},
  { path: 'pagosSuspendidos', component: PagosSuspendidosComponent, canActivate:[AuthGuardPPPagosSuspendidos]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
