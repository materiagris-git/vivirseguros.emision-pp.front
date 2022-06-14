import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GeneracionArchivoPrimaUnica } from '../interfaces/generacionArchivoPrimaUnica.model';
import { AppConsts } from '../app/AppConst';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class ArchivosPrimaUnicaService {
  private url =  AppConsts.baseUrl+'GenArPrimaUnica/';

    constructor( private http: HttpClient ) { }

    getArchivos() {
      return new Promise( (resolve: any) => {
          this.http.get( `${ this.url }` ).subscribe( data => {
              resolve(data);
          }, err => {
              console.log(err);
          });
      });
  }
  postGenerarArchContDiario(FechaIni: string, FechaFin: string ) {
    const obj = {FechaIni: FechaIni, FechaFin: FechaFin}
    return new Promise( resolve => {
        this.http.post(`${ this.url }ExportarArchivoContable`, obj).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}

DescargarContables( archivo ): Observable<Blob> {
    var datos= { fileName: archivo };
    const requestOptions: Object = {
      responseType: 'blob',
      params: datos
    }

    return this.http.get<Blob>(this.url + "DescargarContables", requestOptions).pipe(map(
      (res) => {         
            const blob = new Blob([res], { type : 'application/vnd.ms-excel' });            
            return blob;      
      }, err => {//
        console.log(err)
      }));
}
}

