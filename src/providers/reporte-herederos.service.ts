import { Injectable } from '@angular/core';
import { AppConsts } from '../app/AppConst';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteHerederosService {
  private url = AppConsts.baseUrl + 'ReporteHerederos';

  constructor(private http: HttpClient) {}


    ArchivoCotejo(datos) {
      return new Promise(resolve => {
          let fileToUpload = <File>datos;
          if (fileToUpload != undefined) {
              const formData = new FormData();
              formData.append('file', fileToUpload, fileToUpload.name);

              this.http.post(`${this.url}/ArchivoHerederos`, formData).subscribe(data => {
                  resolve(data);
              }, err => {
                  console.log(err);
              });

          }
      });
  }

  ExcelCotejo(){
    return new Promise((resolve: any) => {
      this.http.get<any>(this.url + '/ExportarHerederos').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  BorrarArchivos() {
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url+ '/BorrarArchivos',null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  CrearZip(archivos) {
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url +'/GenerarZIP', archivos).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
}
DescargarZIP( archivo ): Observable<Blob> {
    let datos= { fileName: archivo };
    const requestOptions: Object = {
      responseType: 'blob',
      params: datos
    }

    return this.http.get<Blob>(this.url + "/DescargarZIP", requestOptions).pipe(map(
      (res) => {
            const blob = new Blob([res], { type : 'application/zip' });
            return blob;
      }, err => {//
        console.log(err)
      }));
}

}
