export class RetencionJudicial {
  NumeroPoliza?: string;
  CUSPP?: string;
  IdTipoDoc?: number;
  TipoDocumento?: string;
  NoDocumetnto?: string;
  NoEndoso?: number;
  Paterno?: string;
  Materno?: string;
  Nombre?: string;
  SegundoNombre?: string;
  Titular?: string;
  Documento?: string;
  Fecha?: string;
  Vigencia?: string;
  Estatus?: string;
  TipoNumIdent?: string = "";
  NumRetencion?: number;

  lstConsulta: DatosPolizaTutorInfo[] = [];
  lstInfoTutor: DatosTutorInfo;
  lstHistTutor: HistorialTutores[] = [];
  NumOrden?: number;
  AFP?: number;
  Periodo?: string;
  lstReceptor: DatosAntecedentesRetencion;
  listaRetencion: DatosRetencion;
}
export class DatosRetencion{
  NUM_RETENCION?: number;
  NUM_POLIZA?: string;
  COD_TIPRET?: string;
  FEC_INIRET?: string;
  FEC_TERRET?: string;
  FEC_RESDOC?: string;
  COD_MODRET?: string;
  MTO_RET?: number;
  GLS_NOMJUZGADO?: string;
  NUM_IDENRECEPTOR?: string;
  COD_TIPOIDENRECEPTOR?: number;
  GLS_NOMRECEPTOR?: string;
  GLS_NOMSEGRECEPTOR?: string;
  GLS_PATRECEPTOR?: string;
  GLS_MATRECEPTOR?: string;
  GLS_DIRRECEPTOR?: string;
  COD_DIRECCION?: number;
  GLS_FONORECEPTOR?: string;
  GLS_EMAILRECEPTOR?: string;
  COD_VIAPAGO?: string;
  COD_TIPCUENTA?: string;
  COD_BANCO?: string;
  NUM_CUENTA?: string;
  COD_SUCURSAL?: string;
  MTO_RETMAX?: number;
  FEC_EFECTO?: string;
  NUM_CUENTACCI?: string;
  Cod_Region?: string;
  Cod_Provincia?: string;
  Cod_Comuna?: string;
  GLS_FONORECEPTOR2?: string;
  COD_DCTOMTO?: string;
  tipDctoMto?: string;
  Calculo?: string;
  Porcentaje?: number;
}
export class DatosAntecedentesRetencion {
  NumPoliza?: string;
  numRetencion?: number;
  fecIniret?: string;
  fecTerret?: string;
  codTipret?: string;
  nomTipret?: string;
  codModret?: string;
  nomModret?: string;
  mtoRet?: number;
  porcentaje?: number;
  fecEfecto?: string;
  fecResdoc?: string;
  mtoRetmax?: number;
  codMonedaretmax?: string;
  codTipoidenreceptor?: number;
  nomReceptor?: string;
  numIdenreceptor?: string;
  glsNomreceptor?: string;
  glsPatreceptor?: string;
  glsMatreceptor?: string;
  glsNomjuzgado?: string;
  lstReceptor: DatosAntecedentesRetencion[] = [];
}

export class DatosPolizaTutorInfo {
  NumPoliza?: string;
  NombreCompleto?: string;
  Fecha?: string;
  CUSPP?: string;
  NumEndoso?: string;
  Titular?: string;
  Documento?: string;
  Vigencia?: string;
  Estatus?: number;
  lstConsulta: DatosPolizaTutorInfo[] = [];
}

export class DatosTutorInfo {
  Bandera?: string;
  NumPoliza?: string;
  DuracionMeses?: number;
  fechaPeriodoInicio?: string;
  fechaPeriodoFin?: string;
  tipRetencion?: string;
  tipModalidad?: string;
  MontoRet?: number;
  FechaEfecto?: string;
  FechaRecepcion?: string;
  MontoRetmax?: number;
  Nomjuzgado?: string;
  codTipoidenben?: number;
  codTipoidenreceptor?: number;
  numIdenreceptor?: string;
  Ubigeo?: string;
  codMonedaretmax?: string;
  NUM_IDENBEN?: string;
  Nombre1?: string;
  Nombre2?: string;
  ApellidoPat?: string;
  ApellidoMat?: string;
  Direccion?: string;
  Telefono1?: string;
  Correo1?: string;
  codDireccion?: number;
  CodViaPago?: string;
  CodTipCuenta?: string;
  CodBanco?: string;
  CodSucursal?: string;
  NumCuenta?: string;
  FecTerminoRetencion?: string;
  GLS_FONO2?: string;
  GLS_FONO3?: string;
  GLSCorreo2?: string;
  GLSCorreo3?: string;
  NumCuentaCCI?: string;
  CodRegion?: string;
  CodProvincia?: string;
  CodComuna?: string;
  NumOrden?: string;
  NumEndoso?: number;
  numRetencion?: number;
  tipDctoMto?: string;
  Calculo?: string;
  Porcentaje?: number;
  Usuario?: string;
}

export class HistorialTutores {
  Periodo?: string;
  FechaPago?: string;
  TipoIdentBen?: string;
  numIdenreceptor?: string;
  NombreBen?: string;
  numPerpago?: string;
}
