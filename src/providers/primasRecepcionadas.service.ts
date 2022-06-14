import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrimasRecepcionadas } from '../interfaces/primasRecepcionadas.model';
import { map } from 'rxjs/operators';
import { AppConsts } from '../app/AppConst';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class PrimasRecepcionadasService {
    // private url = 'https://localhost:44362/api/consultaprimasrecepcionadas';
    private url = AppConsts.baseUrl + 'consultaprimasrecepcionadas';

    constructor( private http: HttpClient) { }

    postConsulta( datos: PrimasRecepcionadas ) {
        return new Promise( resolve => {
            this.http.post(`${ this.url }/consultar`, datos).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    getExportar() {
        return new Promise((resolve: any) => {
          this.http.get<any>(this.url + '/Exportar').subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      }
    
      downloadFile(archivo):Observable<Blob>{
        var datos= {fileName:archivo};
        const requestOptions: Object = {
          responseType: 'blob',
          params: datos
        }
        //console.log(this.baseUrl)
        return this.http.get<Blob>(this.url + '/descarga/?fileName='+archivo,requestOptions).pipe(map(
            (res) => {
           
                const blob = new Blob([res], { type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          
                return blob;      
          },
          err=>{console.log(err)
          }));
      }
}
