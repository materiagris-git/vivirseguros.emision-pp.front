import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenArDatosBeneficiarios } from '../interfaces/archivo-datos-beneficiario.model';
import { AppConsts } from '../app/AppConst';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class archivo_datos_beneficiario {
    private url = AppConsts.baseUrl+'GenArDatosBeneficiarios';
    constructor( private http: HttpClient ) { }

    postConsultaGnral( datos: GenArDatosBeneficiarios ) {
        return new Promise( resolve => {
            this.http.post(`${ this.url }/Consulta`, datos).subscribe( data => {
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