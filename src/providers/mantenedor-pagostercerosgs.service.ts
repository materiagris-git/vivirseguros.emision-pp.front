import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../app/AppConst';
import { BusquedaGeneralPoliza } from 'src/interfaces/busquedaGeneralPoliza.model';

@Injectable({
    providedIn: 'root'
})

export class MantenedorPagosTercerosGSService {
    private url = AppConsts.baseUrl + 'MantenedorPagosTercerosGS';

    constructor( private http: HttpClient ) { }

    getBusquedaPolizas(pData: BusquedaGeneralPoliza) {
        return new Promise((resolve: any) => {
          this.http.post(this.url + '/BusquedaPolizas',  pData).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      }
}
