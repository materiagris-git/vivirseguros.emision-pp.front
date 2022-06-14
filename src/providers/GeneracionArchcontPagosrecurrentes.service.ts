import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagosRecurrentesConsulta, InsertarPagosRecurrentes} from 'src/interfaces/GenArContablePagosRecurrentes.model';
import { map } from 'rxjs/operators';
import { AppConsts } from '../app/AppConst';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class GeneracionArchcontPagosrecurrentesservice {
    
    private url = AppConsts.baseUrl+'GenArContablePagosRecurrentes';

    constructor( private http: HttpClient ) { }

    postConsultaGnral() {
        return new Promise( resolve => {
            this.http.get(`${ this.url }/busquedaArchivoContable`).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    postAgregarArchivo(datos: InsertarPagosRecurrentes) {
        return new Promise( resolve => {
            this.http.get(`${ this.url }/insertarArchivoContable`).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    postGenerarArchContDiario(FechaIni: string, FechaFin: string ) {
        return new Promise( resolve => {
            this.http.get(this.url +'/ExportarArchivoContable?FechaIni='+FechaIni+'&FechaFin='+FechaFin).subscribe( data => {
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

        return this.http.get<Blob>(this.url + "/DescargarContables", requestOptions).pipe(map(
          (res) => {         
                const blob = new Blob([res], { type : 'application/vnd.ms-excel' });            
                return blob;      
          }, err => {//
            console.log(err)
          }));
    }

}


