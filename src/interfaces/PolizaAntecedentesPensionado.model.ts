export class PolizaAntecedenPensionados{
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

export class InfoPensionadoConsultado{
    NumPoliza?: string = "";
    Titular:string = "";
    Fecha?: string = "";
    CUSPP?: string = "";
    TipoDoc?: string = "";
    Documento:string = "";
    NumEndoso?: string = "";
    CodIdenBen?: number = 0;
    Num_Orden?: number = 0;
}

export class InfoPensionado{
    NumPoliza: string = "";
    NumEndoso: number = 0;
    CodAfp: string = "";
    CodTippension: string = "";
    CodEstado: string = "";
    CodTipren: string = "";
    CodModalidad: string = "";
    NumCargas: number = 0;
    FecVigencia: string = "";
    FecTervigencia: string = "";
    MtoPrima: number = 0;
    MtoPension: number = 0;
    MtoPensiongar: number = 0;
    NumMesdif: number = 0;
    NumMesgar: number = 0;
    PrcTasace: number = 0;
    PrcTasavta: number = 0;
    PrcTasactorea: number = 0;
    PrcTasaintpergar: number = 0;
    FecInipagopen: string = "";
    CodUsuarioc;
    FecCrea: string = "";
    HorCrea: string = "";
    CodUsuariomodi: string =  "";
    FecModi: string = "";
    HorModi: string = "";
    CodTiporigen: string = "";
    NumIndquiebra: number = 0;
    CodCuspp: string = "";
    IndCob: string = "";
    CodMoneda: string = "";
    MtoValmoneda: number = 0;
    CodCobercon: string = "";
    MtoFacpenella: number = 0;
    PrcFacpenella: number = 0;
    CodDercre: string = "";
    CodDergra: string = "";
    PrcTasatir: number = 0;
    FecEmision: string = "";
    FecDev: string = "";
    FecInipencia: string = "";
    FecPripago: string = "";
    FecFinperdif: string = "";
    FecFinpergar: string = "";
    FecEfecto: string = "";
    CodTipreajuste: string = "";
    MtoValreajustetri: number = 0;
    MtoValreajustemen: number = 0;
    NumMesesc: number = 0;
    PrcRentaesc: number = 0;
    FecFinperesc: string = "";
    GlsFono: string = "";
    GlsFono2: string = "";
    GlsFono3: string = "";
    GlsCorreo: string = "";
    GlsCorreo2: string = "";
    GlsCorreo3: string = "";
    NumCuentaCci: string = "";
    FecIngresospp: string = "";
    PrcTasares: number = 0;
    Afp: string = "";
    TipoPension: string = "";
    Estado: string = "";
    TipoRenta: string = "";
    TipoModalidad: string = "";
    SimboloMoneda: string = "";
    SimboloSoles: string = "";
}

export class BeneficiariosTbl{
    Num_Orden: number = 0;
    Cod_Par: string = "";
    Cod_IdenBen: number = 0;
    ApePaterno: string = "";
    ApeMaterno: string = "";
    Nombre: string = "";
    SegNombre: string = "";
    CodEstado: string = "";
    CodEstPension: string = "";
    Documento: string = "";
    Titular: string = "";
    TipoIden: string = "";
}

export class BeneficiarioInfo{
    TipoIden?: string = "";
    Documento?: string = "";
    ApePaterno?: string = "";
    ApeMaterno?: string = "";
    Nombre?: string = "";
    SegNombre?: string = "";
    FecNacBen?: string = "";
    FecFallBen?: string = "";
    CodSitInv?: string = "";
    NumOrden: number = 0;
    GlsFono?: string = "";
    GlsFono2?: string = "";
    GlsFono3?: string = "";
    GlsDirben?: string = "";
    GlsDirbenExpediente?: string = "";
    CodRegion?: string = "";
    GlsRegion?: string = "";
    CodProvincia?: string = "";
    GlsProvincia?: string = "";
    CodComuna?: string = "";
    GlsComuna?: string = "";
    MtoPension: number = 0;
    MtoPensiongar: number = 0;
    IndEstudiante?: string = "";
    CodViaPago?: string = "";
    CodSucursal?: string = "";
    CodTipCuenta?: string = "";
    CodBanco?: string = "";
    NumCuenta?: string = "";
    NumCuentaCci?: string = "";
    CodInsSalud?: string = "";
    CodModSalud?: string = "";
    MtoPlanSalud?: Number = 0;
    CodTipoIden?: number = 0;
    NumPoliza: string = "";
    NumEndoso: number = 0;
    FecIniVig: string = '';
    CodDirben: number = 0;
    DireccionAntigua: string ='';
    Correo1?: string = "";
    Correo2?: string = "";
    Correo3?: string = "";
    CodDireccion?: number = 0;
    CodDireccionCorresp?: number = 0;
    LstHistorialDir?: Historial_Ben[] = [];
    Usuario?: string = "";
    MtoPlanSaludString?: string = "";
    COD_PAR?: string = "";
    ProteccionBen?: string = "";
    BoletaBen?: string = "";
}

export class Historial_Ben
    {
        FecIniVig?: string = "";
        GlsDirben?: string = "";
        CodDirben?: number = 0
        CodRegion?: string = "";
        GlsRegion?: string = "";
        CodProvincia?: string = "";
        GlsProvincia?: string = "";
        CodComuna?: string = "";
        GlsComuna?: string = "";
        NumOrden?: number = 0;
    }