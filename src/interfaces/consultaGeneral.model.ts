export class ConsultaGeneralObj{
    NumeroPoliza?: string = null;
    CUSPP?: string= null;
    IdTipoDoc?: number= -1;
    TipoDocumento?:string = null;
    NoDocumetnto?: string= null;
    NoEndoso?: number= 0;
    Paterno?: string= null;
    Materno?: string= null;
    Nombre?: string= null;
    SegundoNombre?: string= null;
    CodPension?:number = -1;
    Fecha?:string = null;
    Error?:string = null;
}

export class ConsultaGeneralDatosPoliza{
    TipoPension?: string ='';
    TipoMoneda?: string ='';
    TipoRenta?: string ='';
    Modalidad?: string ='';
    NoBeneficiarios: 0;
    FechaDevengue?: string ='';
    FechaSPP?: string ='';
    Escalonada?: string ='';
    PorcRentaEsc?: number = 0;
    Estado?: string ='';
    FechaIniVigencia?: string ='';
    FechaFinVigencia?: string ='';
    AFP?: string ='';
    MontoPrima?: number = 0;
    MontoPension?: number = 0;
    TasaReaseguro?: number = 0;
    Diferidos?: string ='';
    Garantizados?: string ='';
    TasaEquivalente?: number = 0;
    TasaVenta?: number = 0;
    TasaGarantizado?: number = 0;
    Telefono1?: string ='';
    Telefono2?: string ='';
    Telefono3?: string ='';
    Correo1?: string ='';
    Correo2?: string ='';
    Correo3?: string ='';
    CodMoneda?: string = '';
    FechaIniVigenciaGar?: string = '';
    FechaFinVigenciaGar?: string = '';
    CodPension?: string = '';
}

export class ConsultaGeneralDatosCalculo{
    Cotizaciones?: string ='';
    Operaciones?: number = 0;
    FechaEmision?: string ='';
    FechaSPP?: string ='';
    TipoDoc?: string ='';
    NoDoc?: string ='';
    CUSPP?: string ='';
    TipoRenta?: string ='';
    Modalidad?: string ='';
    TipoMoneda?: string ='';
    CoberturaConyuge?: string ='';
    ReajusteTrim?: number = 0;
    RentaAFP?: number = 0;
    Garantizados?: string ='';
    Escalonados?: string ='';
    Diferidos?: string ='';
    FechaIncorPoliza?: string ='';
    FechaInicioPago?: string ='';
    Cobertura?: string ='';
    Gratificacion?: string ='';
    Comision?: number = 0;
    RentaEscalonada?: number = 0;
    MontoPension?: number = 0;
    MontoPensionGar?: number = 0;
    RentaTemporal?: number = 0;
    FechaTraspaso?: string ='';
    FechaDevengue?: string ='';
    TasaEquiv?: number = 0;
    TasaVenta?: number = 0;
    TasaTIR?: number = 0;
    CI?: number = 0;
    BR?: number = 0;
    AA?: number = 0;
    PU?: number = 0;
}

export class ConsultaGeneralDatosGrupoFamiliar {
    TipoDocumento?: string ='';
    NoDocumento?: string ='';
    Paterno?: string ='';
    Materno?: string ='';
    Nombre?: string ='';
    SegundoNombre?: string ='';
    FechaNacimiento?: string ='';
    FechaFall?: string ='';
    SitInv?: string ='';
    Pension?: number = 0;
    EstVigente?: string ='';
    Parentesco?: string ='';
    Estudiante?: string ='';
    FechaIngreso?: string ='';
    Telefono1?: string ='';
    Telefono2?: string ='';
    Telefono3?: string ='';
    Direccion?: string ='';
    Departamento?: string ='';
    Provincia?: string ='';
    Distrito?: string ='';
    Email1?: string ='';
    Email2?: string ='';
    Email3?: string ='';
    NoPoliza?: string ='';
    Endoso?: number = 0;
    Orden?: number = 0;
    MontoPension?: number = 0;
    Error?: string ='';
    Direccion_Corr?: string ='';
    Departamento_Corr?: string ='';
    Provincia_Corr?: string ='';
    Distrito_Corr?: string ='';
    ProteccionBen?: string = "";
    BoletaBen?: string = "";
}

export class ConsultaGeneralPagoPensiones{
    TipoDoc?: string ='';
    NoDocumento?: string ='';
    Nombre?: string ='';
    InicioVigencia?: string ='';
    FinVigencia?: string ='';
    ViaPago?: string ='';
    Sucursal?: string ='';
    Banco?: string ='';
    TipoCta?: string ='';
    NoCuenta?: string ='';
    NoCuentaCCI?: string ='';
    Institucion?: string ='';
    ModalidadPago?: string ='';
    MontoPago?: number = 0;
    PeriodoEfecto?: string ='';
    RetencionJudicial?:any = [];
}

export class ConsultaGeneralLiquidaciones{
    Periodo?: string ='';
    Codigo?: string ='';
    Concepto?: string ='';
    Monto?: number = 0;
    NoPoliza?: string ='';
    Orden?: number = 1;
    FechaIni?: Date = null;
    FechaFin?: Date =null;
    LstCodigos?:any = [];
    Error?: string ='';
}
export class ConsultaPolizaDatosPoliza{
    IdPension?:string= "";
    Pension?:string= "";
    IdTipoEndoso?:string= "";
    TipoEndoso?:string= "";
    IdCausaEndoso?:string= "";
    CausaEndoso?:string= "";
    IdTipoRenta?:string= "";
    TipoRenta?:string= "";
    IdModalid?:string= "";
    Modalidad?:string= "";
    IdEstadoVigencia?:string= "";
    EstadoVigencia?:string= "";
    IniVigencia?:string= "";
    FinVigencia?:string= "";
    FechaDevengue?:string= "";
    Escal1Tramo?:string= "";
    RentaEsc2Tramo?: number = 0;
    NumBeneficiarios?: number = 0;
    MontoPrima?: number = 0;
    MontoPension?: number = 0;
    MontoPensionRea?: number = 0;
    CoberConyuge?:string= "";
    TasaVenta?: number = 0;
    TasaEquivalente?: number = 0;
    Diferidos?:string= "";
    Garantizados?:string= "";
    DerCrecer?:string= "";
    Gratificacion?:string= "";
    IndCovertura?:string= "";
    MontoPensionOri?:number = 0;
    MontoPensionCal?:number = 0;
    FechaEfecto?:string = null;
    Observaciones?:string = null;
    FechaSolicitud?:string= "";
    FechaRentaVit?:string= "";
}

export class EnsososSimplesDatosBeneficiario{

    Orden?:number = 0;
    IdTipoIden?:number = -1;
        TipoIden?:string = "";
    NoIden?:string = "";
    Nombre?:string = "";
    SegundoNom?:string = "";
    Paterno?:string = "";
    Materno?:string = "";
    IdGenero?:string = "";
        Genero?:string = "";
    FechaNac?:string = null;
    IdParentesco?:string = "";
    Parentesco?:string = "";
    IdGpoFam?:string = "";
        GpoFamiliar?:string = "";
    IdCausaInv?:string = "";
        CausaInv?:string = "";
    IdSitInv?:string = "";
    SitInv?:string = "";
    FechaInv?:string = null;
    FechaNHM?:string = null;
    FechaMatrimonio?: string = null;
    IdDerPension?:string = "";
    DerPension?:string = "";
    DCrecer?:string = "";
    PorcPensionLegal?:number = 0;
    MontoPension?:number = 0;
    MontoPensionRea?:number = 0;
    FechaFallecimiento?:string = null;
    PorcPension?:number = 0;
    PensionGar?:number = 0;
    PorcPensionGar?:number = 0;
    FechaIniPension?:string = null;
    CodMotReqPen?:string = "1";
    CodCausSus?:string = null;
    FechaSus?:string = null;
    FechaTerPagoPenGar?:string = null;
    MtoPensionGar?:number = 0;
    Telefono1?:string = null;
    Telefono2?:string = null;
    Telefono3?:string = null;    
    Departamento?:string = null;    
    Distrito?:string = null;
    Email1?:string = null;
    Email2?:string = null;
    Email3?:string = null;
    CodDireccion?:number = 0; 
    Direccion?:string = null; 
    CodUbigeoCorresp?:number = 0;  
    GlsDireccionCorrespBen?:string = null;
    DireccionStr?:string = '';
    DirCorrStr?:string = '';
    Estatus?:string = '';

}

export class EndososSimplesyActuarialesGuardar{
    NumeroPoliza?:string = "";
    NoEndoso?:number = 0;
    FechaSolicitudEndoso ?:string = "";
    FechaRentaVitalicia ?:string = "";
    IdCausaEndoso  ?:string = "";
    IdTipoEndoso  ?:string = "";
    MtoPencionOrig  ?:number = 0;
    MtoPensionCalc  ?: number = 0;
    Observaciones  ?:string = "";
    FechaEfecto  ?:string = "";
    Usuario  ?:string = "";
    IdPension  ?:string = "";
    IdEstadoVigencia  ?:string = "";
    IdTipoRenta  ?:string = "";
    IdModalid  ?:string = "";
    NumBeneficiarios  ?:number = 0;
    IniVigencia  ?:string = "";
    FinVigencia  ?:string = "";
    MontoPrima  ?: number = 0;
    MontoPension  ?:number = 0;
    MontoPensionRea  ?:number = 0;
    IndCovertura  ?:string = "";
    CoberConyuge  ?:string = "";
    DerCrecer  ?:string = "";
    Gratificacion  ?:string = "";
    LstBeneficiarios  ?:any = []
}

export class BeneficiarioEditado{
    IdTipoIden:boolean = false;
    NoIden:boolean = false;
    Nombre:boolean = false;
    SegundoNom:boolean = false;
    Paterno:boolean = false;
    Materno:boolean = false;
    IdGenero:boolean = false;
    FechaNac:boolean = false;
    IdParentesco:boolean = false;
    IdGpoFam:boolean = false;
    IdCausaInv:boolean = false;
    IdSitInv:boolean = false;
    FechaInv:boolean = false;
    FechaNHM:boolean = false;
    FechaMatrimonio :boolean = false;
    IdDerPension :boolean = false;
    DCrecer :boolean = false;
    PorcPensionLegal:boolean = false;
    MontoPension :boolean = false;
    FechaFallecimiento :boolean = false;
    PorcPension :boolean = false;
    PensionGar :boolean = false;
    PorcPensionGar :boolean = false;
    FechaIniPension :boolean = false;

}
