import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MantPTPGService {
  private url = AppConsts.baseUrl + 'MantencionPagosTercerosPG';

  constructor(private http: HttpClient) { }

  getCombos(codigoCombo, CodigoFiltro) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/Combos?codigoCombo=' + codigoCombo + '&CodigoFiltro=' + CodigoFiltro).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getPGInfo(numPoliza, CodTipoidenben, numIdenBen, NumEndoso) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/PGInfo?numPoliza=' + numPoliza + '&CodTipoidenben=' + CodTipoidenben + '&numIdenBen=' + numIdenBen + '&NumEndoso=' + NumEndoso).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  nuevaDireccion(dep, prov, dir){

    return new Promise((resolve:any)=>{
      this.http.post(this.url+'/NuevaDireccion?cod_Departamento='+dep+'&cod_Provincia='+prov+'&cod_Distrito='+dir,null).subscribe(data=>{
        resolve(data);
      }, err=>{
        console.log(err);
        
      })
    })
  }

  tipoCambio(fecPago, codMoneda){
    return new Promise((resolve:any)=>{
      this.http.post(this.url+'/TipoCambio?fecPago='+fecPago+"&cod_moneda="+codMoneda,null).subscribe(data=>{
        resolve(data);
      },err=>{
        console.log(err);
        
      })
    })
  }

  GrabarInfo(info: any){

    return new Promise((resolve:any)=>{
      this.http.post(this.url+'/GrabarInfo',info).subscribe(data=>{
        resolve(data);
      }, err=>{
        console.log(err);
        
      })
    })
  }


}
