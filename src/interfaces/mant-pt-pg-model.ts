export class PGInfo {
    NumPoliza?: string = "";
    NumEndoso?: number = 0;
    NumOrden ?: number = 0;
    Nombre?: string = "";
    CodEstpension?: string = "";
    CodTipoidenben?: number = 0;
    NumIdenben?: string = "";
    CUSPP?: string = "";
    TipNumIdent?: string = "";
}

export class DetallePagoDatos{
    FecDev?: string = "";
    FecInipencia?: string = "";
    FecInipagopen?: string = "";
    FecFinpergar?: string = "";
    MtoPension?: number = 0;
    CodMoneda?: string = "";
    CodTipreajuste?: string = "";
    vlTipCambio?: number=0;
}

export class DetallePagoTabla{
    num_orden?: number = 0;
    cod_par?: string = "";
    cod_tipoidenben?: number = 0;
    num_idenben?: string = "";
    gls_nomben?: string = "";
    gls_nomsegben?: string = "";
    gls_patben?: string = "";
    gls_matben?: string = "";
    cod_estpension?: string = "";
    num_poliza?: string = "";
    cod_sexo?: string = "";
    fec_nacben?: string = "";
    prc_pensionleg?: number = 0;
    mto_pension?: number = 0;
    mto_pensiongar?: number = 0;
    cod_grufam?: string = "";
    gls_dirben?: string = "";
    cod_direccion?: number = 0;
    gls_fonoben?: string = "";
    GLS_FONO2?: string = "";
    GLS_FONO3?: string = "";
    gls_correoben?: string = "";
    GLS_CORREO2?: string = "";
    GLS_CORREO3?: string = "";
    prc_pension?: number = 0;
    prc_pensiongar?: number = 0;
    cod_derpen?: string = "";
    cod_viapago?: string = "";
    cod_sucursal?: string = "";
    cod_tipcuenta?: string = "";
    cod_banco?: string = "";
    num_cuenta?: string = "";
    fec_inipagopen?: string = "";
    fec_terpagopengar?: string = "";
    Parentesco?: string = "";
    vlEstPago?: string = "";
    vlTipCambio?: number = 0;
    vlFecRecep?: string = "";
    vlTasaInt?: number = 0;

    num_mesespag?: number = 0;
    num_mesesnodev?: number = 0;
    mto_pago?: number = 0;
    fec_finpergar?: string = "";
    fec_inipergarpag?: string = "";
    Mto_ValMoneda?: number = 0;
    CodTipreajuste?: string = "";
    cod_moneda?: string = "";
    fec_solpago?: string = "";
    datosDire: datosDire = new datosDire();

    fechaPagoM?: string = "";

    fechaRecepcion?: string = "";
    fechaPago ?: string = "";
    tasaInteres?: number = 0;
    GrupoFam?: string = "";
    EstPension?: string = "";
    TipoIden?: string = "";
}

export class datosDire{
    Cod_Region?:string = "";
    Cod_Provincia?: string = "";
    Cod_Comuna?: string = "";
    GLS_DIRECCION?: string = "";
}

export class detallePago{
    CodTipPension?: string = "";
    NumMesGar?: number = 0;
    FecVigencia?: string = "";
    FechaEfecto?: string = "";
    Mensaje?: string = "";
}
