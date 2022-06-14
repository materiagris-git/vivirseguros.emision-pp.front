export class DatosGastosSepelio{
    cod_banco: string= "00";
    cod_conpago: string= "";
    cod_direccion: number= 0;
    cod_sucursal: string= "000";
    cod_tipcuenta: string= "00";
    cod_tipodctopago:string= "";
    //cod_tipoidenfun:number=0;
    cod_tipoidensolicita:number=null;
    cod_tipopersona: string= "";
    cod_viapago: string= "00";
    fec_pago: string= "";
    fec_solpago:string= "";
    gls_correosolicita:string= "";
    gls_correosolicita2:string= "";
    gls_correosolicita3:string= "";
    gls_dirsolicita:string= "";
    gls_fonosolicita: string= "";
    gls_fonosolicita2: string= "";
    gls_fonosolicita3: string= "";
    gls_matsolicita: string= "";
    gls_nomsegsolicita: string= "";
    gls_nomsolicita: string= "";
    gls_patsolicita: string= "";
    mto_cobra: number=null;
    mto_pago: number= null;
    num_cuenta: string= "";
    num_dctopago: string= "";
    num_endoso: number= 0;
    num_idenfun: string= "";
    num_idensolicita: string= "";
    num_poliza: string= "";
    cod_CCI:string= "";
    cod_Departamento?: string= "";
    cod_Distrito?: string= "";
    cod_Provincia?: string= "";
    cod_Direccion?: number = 0;
    fechaEmision: string= "";
    mto_solicitado: number = null;
    codMoneda: string = "00";
    mensaje:string = "";
    CodPar:string = "";
    indRegistro:string = "";
    Usuario:string = "";
}

export class Direccion{
    cod_Departamento: string= "";
    cod_Distrito: string= "";
    cod_Provincia: string= "";
    cod_Direccion: number = null;
}

export class DatosGuardar{
    cod_banco: string = "00";
    cod_conpago: string= "";
    cod_direccion: number =0;;
    cod_sucursal: string= "000";
    cod_tipcuenta: string= "00";
    cod_tipodctopago:string= "";
    //cod_tipoidenfun:number=0;
    cod_tipoidensolicita:number=null;
    cod_tipopersona: string= "";
    cod_viapago: string= "00";
    fec_pago: string= "";
    fec_solpago:string= "";
    gls_correosolicita:string= "";
    gls_correosolicita2:string= "";
    gls_correosolicita3:string= "";
    gls_dirsolicita:string= "";
    gls_fonosolicita: string= "";
    gls_fonosolicita2: string= "";
    gls_fonosolicita3: string= "";
    gls_matsolicita: string= "";
    gls_nomsegsolicita: string= "";
    gls_nomsolicita: string= "";
    gls_patsolicita: string= "";
    mto_cobra: number=null;
    mto_pago: number=null;
    num_cuenta: string= "";
    num_dctopago: string= "";
    num_endoso: number=0;
    num_idenfun: string= "";
    num_idensolicita: string= "";
    num_poliza: string= "";
    cod_CCI:string= "";
    cod_Departamento?: string= "";
    cod_Distrito?: string= "";
    cod_Provincia?: string= "";
    cod_Direccion?: number = 0;
    mto_solicitado?: number = null;
    fechaEmision:string = "";
    codMoneda: string = "";
    mensaje:string = "";
    CodPar:string = "";
    indRegistro:string = "";
    Usuario:string = "";
}

export class InfoCabezeraSepelio {
    NumeroPoliza: string = "";
    CUSPP: string = "";
    NoEndoso: number= 0;
    Fecha: string = "";
    Titular: string = "";
    Documento: string = "";
}
