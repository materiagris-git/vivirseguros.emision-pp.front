import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneracionArchivoCotizacionEsSaludService {
  private url = AppConsts.baseUrl+'GenArCotizacionEsSalud';
  constructor(private http: HttpClient) { }

  postConsulta(tipoProceso: string,tipoPago: string,periodoDesde: string,periodoHasta: string ) {     
    return new Promise( resolve => {
        this.http.post(`${ this.url }/ConsultaGnral`,{"tipoProceso":tipoProceso,"tipoPago":tipoPago,"periodoDesde":periodoDesde,"periodoHasta":periodoHasta  }).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
}
