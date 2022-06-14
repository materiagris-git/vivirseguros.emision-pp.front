export class PrimasRecepcionadas {
    FechaDesde: string;
    FechaHasta: string;
    Traspasada: string;

    lstConsultaPrimas: ConsultaPrimasRecepcionadas[] = [];
}

export class ConsultaPrimasRecepcionadas {
    NumPoliza: string;
    CUSPP: string;
    Afiliado: string;
    DNI: string;
    Direccion: string;
    Distrito: string;
    TipoDoc: string;
    FEC_TRASPASO : string;
    MTO_PRIREC: number;
    FEC_RECPRIMA: string;
}
