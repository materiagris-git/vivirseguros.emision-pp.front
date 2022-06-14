export class MantenimientoIngresoPrimas {
    NumPoliza: string;
    NumIdentificacion: string;
    GlsTipoIden: string;
    Nombre: string;
    CUSPP: string;
    CodTipoPension: string;
    TipoPension: string;
    CodTipoRenta: string;
    TipoRenta: string;
    CodModalidad: string;
    Modalidad: string;
    PrcRentaEsc: number;
    Moneda: string;
    CodMoneda: string;
    AniosDiferidos: number;
    MesesGarantizados: number;
    MesesEscalonados: number;
    MesesDiferidos: number;
    ReajusteTrim: number;
    ReajusteMen: number;
    FechaDevengue: string;
    FechaAceptacion: string;
    PrimaCotizada: number;
    PensionCotizada: number;
    FechaInfoAFP: string;
    PrimaTraspasada: number;
    FactorVariacionRta: number;
    TipoCambio: number;
    PensionDefCompania: number;
    PrimaDefCompania: number;
    PensionDefAFP: number;
    PrimaDefAFP: number;
    FechaTraspasoPrima: string;
    FechaTopePrimerPago: string;
    FechaPrimerPago: string;
    FechaVigenciaPoliza: string;
    FechaFinPerDif: string;
    TipoReajuste: number;
    MontoPension: number;
    FechaTerPago: string;
    NumDiasPrimerPago: number;
    MontoBono: number;
    MontoPriUni: number;
    MontoPensionGar: number;
    GlsNomBen: string;
    GlsNomSegBen: string;
    GlsPatBen: string;
    GlsMatBen: string;
    MontoValMoneda: number;
    MontoPriUniDif: number;
    PrcRentaTMP: number;
    CodAFP: string;
    CodParentesco: string;
    MontoSumPension: number;
    CodTipReajuste: string;
    CodMonTipoReajuste: string;
    GlsMonTipoReajuste: string;
    MontoPensionPrima: number;
    MontoPriCiaPrima: number;
    MontoPensionAfpPrima: number;
    MontoPriAfpPrima: number;
    PrcFacVarPrima: number;
    MontoValMonedaRecPrima: number;
    MontoPriRecPrima: number;
    MontoSumPensionInfPrima: number;
    MontoSumPensionPrima: number;
    MontoSumPensionAfpPrima: number;
    NombreCompleto: string;
    FecEmision: string;
    FecSolicitud: string;
    NumCotizacion: string;

    Mensaje: string;
    Usuario: string;
    EstadoCalculo: string;
    FechaEfectiva: string;
    FechaNacimiento: string;
    NumOrden: number;
    FecEfectivaActive: string;
    lstLiquidacionPrima: LiquidacionPrima[] = [];
    lstStPensionActAFP: StPensionActAFP[] = [];
    lstStDetPension: StDetPension[] = [];
}

export class LiquidacionPrima {
    NumPerPago: string;
    NumPoliza: string;
    NumOrden: string;
    FecPago: string;
    GlsDireccion: string;
    CodDireccion: string;
    CodTipPension: string;
    CodViaPago: string;
    CodBanco: string;
    CodTipCuenta: string;
    NumCuenta: string;
    CodSucursal: string;
    CodInsSalud: string;
    NumIdenReceptor: string;
    CodTipoIdenReceptor: number;
    GlsNomReceptor: string;
    GlsNomSegReceptor: string;
    GlsPatReceptor: string;
    GlsMatReceptor: string;
    CodTipReceptor: string;
    MtoHaber: number;
    MtoDescuento: number;
    MtoLiqPagar: number;
    CodTipoPago: string;
    MtoBaseImp: number;
    MtoBaseTri: number;
    CodModulo: string;
    MtoPension: number;
    CodTipoIdenPensionado: number;
    NumIdenPensionado: string;
    CodParentesco: string;
    FecIniPago: string;
    FecTerPago: string;
    MtoSalud: number;
    FacAjuste: number;
    GlsTipoIdentCor: string;
    CodMoneda: string;
    MtoPensionTotal: number;
    PrcPension: number;
    MtoMaxSalud: number;
    CodDerGra: string;
    GlsMoneda: string;
    PrcPagoPenPol: number;
    SumaPensionPagos: number; // Variable agregada para la suma de pensiones de pagos para mostrar en pantalla.
    SumaMontoSalud: number; // Variable agregada para la suma de montos de salud para mostrar en pantalla.
    SumaMontoLiquidacion: number; // Variable agregada para la suma de montos de liquidación para mostrar en pantalla.
    GlsParentesco: string; // Variable para mostrar el parentesco en texto y no el código.
    FecTerPagoFinal: string; // Variable para indicar la Fecha de Resumen de Termino de Pago en Pantalla.
}

export class StPensionActAFP {
    NumPoliza: string;
    FecIniPago: string;
    MontoPensionTotal: number;
    FacAjuste: number;
}

export class StDetPension {
    Num_PerPago: string;
    Num_Poliza: string;
    Num_Orden: string;
    Cod_ConHabDes: string;
    Fec_IniPago: string;
    Fec_TerPago: string;
    Mto_ConHabDes: number;
    Edad: number;
    EdadAnios: number;
    Num_IdenReceptor: string;
    Cod_TipoIdenReceptor: number;
    Cod_Modulo: string;
    Cod_TipReceptor: string;
}

export class Moneda{
    SimboloMoneda?: string="";
    CodScomp?: string="";
}
