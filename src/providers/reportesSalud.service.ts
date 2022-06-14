import { Injectable } from '@angular/core';
import { AppConsts } from '../app/AppConst';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesEssaludService {
  private url = AppConsts.baseUrl + 'ReportesSalud';
  private urlCotejo = AppConsts.baseUrl + 'ReportesContigoCotejo';

  constructor(private http: HttpClient) {}

    reportesSalud(datos){
        return new Promise((resolve: any) => {
            this.http.post(this.url + '/ReportesEssalud', datos).subscribe(
              data => {
                resolve(data);
              },
              err => {
                console.log(err);
              }
            );
          });
    }

    ArchivoCotejo(datos) {
      return new Promise(resolve => {
          let fileToUpload = <File>datos;
          if (fileToUpload != undefined) {
              const formData = new FormData();
              formData.append('file', fileToUpload, fileToUpload.name);

              this.http.post(`${this.urlCotejo}/ArchivoCotejo`, formData).subscribe(data => {
                  resolve(data);
              }, err => {
                  console.log(err);
              });

          }
      });
  }

  ArchivoPension(datos) {
    return new Promise(resolve => {
        let fileToUpload = <File>datos;
        if (fileToUpload != undefined) {
            const formData = new FormData();
            formData.append('file', fileToUpload, fileToUpload.name);

            this.http.post(`${this.urlCotejo}/ArchivoPension65`, formData).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });

        }
    });
}

  ExcelCotejo(fecha: string){
    return new Promise((resolve: any) => {
      this.http.get<any>(this.urlCotejo + '/ExportarCotejo?fecha=' + fecha).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  ExcelPension65(fecha: string){
    return new Promise((resolve: any) => {
      this.http.get<any>(this.urlCotejo + '/ExportarPension?fecha='+fecha).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
