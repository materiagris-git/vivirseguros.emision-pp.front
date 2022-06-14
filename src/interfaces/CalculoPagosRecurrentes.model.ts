export class CalculoPagosRecurrenteModel{
    tipoCalculo: string;//Provisionario definitivo
    Periodo: string;//txt_Periodo
    FechaPago: string;//txt_FecPago
    vlFecPago: string;//txt_FecCalculo o vlFecPago
    vgFecIniPag: string;
    vgFecTerPag: string;
    vgPerPago: string;
    vgFecPago: string;
    Usuario: string;
    txtFiltrarDetalle: string;
  }
export class InfoCalculoPagosRecurrenteModel{
    Num_Poliza: string;
    Tipo_Pension: string;
    Year_Diferido: string;
    Year_Escalonado: string;
    Monto_Total: string;
  }

  export class InfoCActualizacionFecPagosRecurrent{
    identificador: number;
    Periodo_Pago: string;
    Num_Poliza: string;
    Num_Orden: number
    Tipo_Pension: string;
    Year_Diferido: string;
    Year_Garantizado : number;
    Year_Escalonado: string;
    Monto_Total: string;
    Num_Iden: string;
    Fecha: string;
    Bandera: number;
    Bandera2: number;
    Monto_Bruto: number;
    Monto_EsSalud: number;
    FechaAct: string;
  }