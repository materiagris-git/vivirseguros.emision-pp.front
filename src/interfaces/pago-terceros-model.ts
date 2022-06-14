export class PagoTercerosBusqueda{
    NumPoliza?: string;
    Cuspp?: string;
    TipoDoc?: string;
    NumDoc?: string;
    NumEndoso?: string;
    ApePaterno?: string;
    ApeMaterno?: string;
    Nombre?: string;
    SegNombre?: string;
}

export class InfoConsultado{
    NumPoliza?: string = "";
    NumEndoso?: string = "";
    Documento?: string = "";
    CUSPP?: string = "";
    Titular:string = "";
    Num_Orden?: number = 0;
}

export class CuotaMortuaria{
    NumPoliza?: string = "";
    NumEndoso?: number = 0;
    CodIdenSolicita?: number = 0;
    NumIdenSolicita?: string = "";
    GlsNomSolicita?: string = "";
    GlsDirSolicita?: string = "";
    CodDireccion?: number = 0;
    CodViaPag?: string = "";
    FecSolPago?: string = "";
    FecPago?: string = "";
    MtoCobra?: number = 0;
    MtoPago?: number = 0;
    CodTipodctopago?: string = "";
    Numdctopago?: string = "";
    CodTipoidenfun?: number = 0;
    NumIdenfun?: string = "";
}

export class PagoGarantizado{
    NumPoliza?: string = "";
    NumEndoso?: number = 0;
    CodIdenBen?: number = 0;
    NumIdenBen?: string = "";
    GlsNombre?: string = "";
    GlsDirben?: string = "";
    CodDireccion?: number = 0;
    CodViaPago?: string = "";
    CodPar?: string = "";
    FecSolPago?: string = "";
    FecPago?: string = "";
    PrcTasaint?: number = 0;
    FecDev?: string = "";
    FecInipergarpag?: string = "";
    FecFinpergar?: string = "";
    NumMesespag?: number = 0;
    NumMesesnodev?: number = 0;
    MtoPago?: number = 0;
}