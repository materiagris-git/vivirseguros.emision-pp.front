export class mantenedorCertificadosSupervivencia {
  NumPoliza?: string;
  CUSPP?: string;
  TipoDoc?: String;
  NumDoc?: string;
  NumEndoso?: string;
  ApellidoPat?: string;
  ApellidoMat?: string;
  Nombre1?: string;
  Nombre2?: string;
}
export class InfoPolCertSupervivencia {
  NumPoliza?: string = "";
  Titular: string = "";
  Fecha?: string = "";
  CUSPP?: string = "";
  TipoDoc?: string = "";
  Documento: string = "";
  NumEndoso?: string = "";
  CodIdenBen?: number = 0;
  Num_Orden?: number = 0;
  NumIdent?: string = "";
}

export class InfoBeneficiario {
  TipoIdentificacion?: string = "";
  Num_IdenBen?: string = ""; 
  NombreCompleto?: string = ""; 
  Parentesco?: string = "";
  NumOrden?: Number = 0;
}

export class InfoBenfCSE {
  NumPoliza?: string = "";
  NumEndoso?: number = 0;
  NumOrden?: number = 0;
  FecInicer?: string = "";
  FecTercer?: string = "";
  CodFrecuencia?: string = "";
  GlsNomInstitucion?: string = "";
  FecReccia?: string = "";
  FecIngcia?: string = "";
  FecEfecto?: string = "";
  Certificado?: string = "";
  Identificador?: string = "";
  directorio?: string = "";
  archivo?: string = "";
  type?: string = "";
  Estado?: string = "";
}

export class ActualizarCertificado{
  NumPoliza: string = "";
  NumEndoso: number = 0;
  FecInicer: string = "";
  FecTercer: string = "";
  CodIdenBen: number = 0;
  vgUsuario: string = "JCAMARA";
  NumIdenben: string = "";
  CodTabla: string = "";
  NumOrden: number = 0;
  CodFrecuencia: string = "";
  FecEfecto: string = "";
  GlsNomInstitucion: string = "";
  FecReccia: string = "";
  FecIngcia: string = "";
  Mensaje: number = 0;
  file: File;
  directorio: string = "";
  archivo: string = "";
  type: string = "";
  Estado: string = "";
}
