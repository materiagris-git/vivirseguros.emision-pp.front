export class PagosRecurrentesConsulta {
 
     NUM_ARCHIVO?: number; 
     FEC_DESDE?: string; 
     FEC_HASTA?: string; 
     NUM_CASOS?: number; 
     COD_TIPMOV?: string;
     FEC_CREA?: string; 
     HOR_CREA?: string; 
     COD_TIPREG?: string;
     COD_MONEDA?: string;
     COD_USUARIOCREA?: string;

  }

  export class InsertarPagosRecurrentes {
 
   NUM_ARCHIVO?: number;
   COD_TIPREG?: string; 
   COD_TIPMOV?: string;
	COD_MONEDA?: string;
   FEC_DESDE?: string; 
   FEC_HASTA?: string; 
   COD_USUARIOCREA?: string;
   FEC_CREA?: string; 
   HOR_CREA?: string; 
}