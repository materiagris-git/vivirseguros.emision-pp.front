import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { HttpClient } from '@angular/common/http';
import { ConsultaTraspaso } from 'src/app/models/ConsultaTraspaso';

@Injectable({
  providedIn: 'root'
})
export class ReportePolizasTraspService {
  private url = AppConsts.baseUrl + 'ReporteTraspasoPolizas';

  constructor(private http:HttpClient) { }

  getCombos(){
    return new Promise (( resolve)=>{
      this.http.post(this.url+'/InfoListas',null).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)});
    })
  }

  getRepInfo(fechaBusqueda: ConsultaTraspaso) {
    return new Promise((resolve, reject) => {
      this.http.post(`${ this.url }/InfoReporte`, fechaBusqueda).subscribe( res => {
          resolve(res);
        }, err => {
          reject(err);
          console.log(err);
        }
      );
    });
  }

}
