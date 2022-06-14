import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../app/AppConst';
import { MantenimientoTipoDocumento } from '../interfaces/mantenimiento-tipo-documento.model';

@Injectable({
    providedIn: 'root'
})

export class MantenimientoTipoDocService {
    private url = AppConsts.baseUrl + 'MantenimientoTipoDoc';

    constructor( private http: HttpClient ) { }

    getBuscarTipoDocumento() {
        return new Promise((resolve: any) => {
            this.http.get(`${this.url}/BuscarTipoDocumento`).subscribe(data => {
              resolve(data);
            }, err => {
              console.log(err);
            });
          });
    }

    postBuscarDocumento(codigoTipoDoc: number, nombreTipoDoc: string) {
      var datos = {
        Codigo: codigoTipoDoc,
        TipoDocNombre: nombreTipoDoc,
      };
      return new Promise((resolve: any) => {
        this.http.post(`${ this.url }/BuscarDocumento`, datos).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        })
      });
    }

    postActualizarDocumento(datos: MantenimientoTipoDocumento) {
      return new Promise((resolve: any) => {
        this.http.post(`${ this.url }/ActualizarTipoDocumento`, datos).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        })
      });
    }

    postGenerarCodigoNuevoDoc(datos: MantenimientoTipoDocumento) {
      return new Promise((resolve: any) => {
        this.http.post(`${ this.url }/GenerarCodigoNuevoDoc`, datos).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        })
      });
    }

    postInsertarNuevoDoc(datos: MantenimientoTipoDocumento) {
      return new Promise((resolve: any) => {
        this.http.post(`${ this.url }/InsertarNuevoDocumento`, datos).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        })
      });
    }

}