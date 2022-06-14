import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';

@Injectable({
  providedIn: 'root'
})
export class ConsultaHijosCumpliranMayoriaEdadService {

  private url = AppConsts.baseUrl+'ConsultaHijosCumpliranMayoriaEdad';

  constructor(private http: HttpClient) { }

   postConsulta(Periodo: string ) {     
    return new Promise( resolve => {
        this.http.post(`${ this.url }/ConsultaGnral`,{"Periodo":Periodo}).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
}
