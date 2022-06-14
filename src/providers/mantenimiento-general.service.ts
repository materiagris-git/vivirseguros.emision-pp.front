import { Injectable } from '@angular/core';
import { AppConsts } from '../app/AppConst';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { mantenimientoGeneral } from 'src/interfaces/mantenimiento-general.model';

@Injectable({
    providedIn: 'root'
  })
  export class MantenimientoGeneralService {
  
    private url = AppConsts.baseUrl+'mantenimientoGeneral';
  
    constructor(private http: HttpClient) {  }
  
  
    postConsultaMantenimientoGnral() {
      return new Promise( resolve => {
        this.http.post(`${ this.url }/ConsultaMantenimientoGeneral`,'').subscribe( data => {
              resolve(data);
          }, err => {
              console.log(err);
          });
      });
  }

  postActualizarParametros(datos: mantenimientoGeneral) {
    return new Promise( resolve => {
      this.http.post(`${ this.url }/ActualizarParametros`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
}