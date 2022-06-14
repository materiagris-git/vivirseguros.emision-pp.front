import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { HttpClient } from '@angular/common/http';
import { Calcular } from 'src/interfaces/informecontrol-retencionjudicial.model';

@Injectable({
  providedIn: 'root'
})
export class InformecontrolRetjudicialService {

  private url = AppConsts.baseUrl + 'InfControlRetJudicial';

  constructor( private http: HttpClient ) { }

  postCalcular( datos: Calcular ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/InfRetJud`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }

  getConsultaInfoTabla(fecha){
    return new Promise( (resolve: any) => {
      this.http.get( this.url  + '/ConsultaCalculo?fecha='+fecha).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
  
}
