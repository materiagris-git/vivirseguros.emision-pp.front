import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppConsts } from '../app/AppConst';
import { Observable } from 'rxjs';
import { BusquedaEstadisticas } from '../interfaces/estadisticas.model';

@Injectable({
    providedIn: 'root'
})

export class EstadisticasService {
    private url = AppConsts.baseUrl + 'Estadisticas';

    constructor( private http: HttpClient ) { }

    postBusquedaEstadisticas(pParametros: BusquedaEstadisticas) {
        return new Promise((resolve: any) => {
          this.http.post(this.url + '/BusquedaEstadisticas', pParametros).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      }
}