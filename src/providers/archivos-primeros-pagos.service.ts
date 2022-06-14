import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../app/AppConst';
@Injectable({
  providedIn: 'root'
})
export class ArchivosPrimerosPagosService {
  private url =  AppConsts.baseUrl+'GenArPrimerosPagos/';
  private urlDoc =  AppConsts.baseUrl+'ReportesPlanillaValidaciones';

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
consultaDocumento(datos : string , FecHasta : string){
  return new Promise( resolve => {
    this.http.get(this.urlDoc +'/ConsultaReportes?FechaDesde='+datos+'&FechaHasta='+ FecHasta).subscribe( data => {
        resolve(data);
    }, err => {
        console.log(err);
    });
});
}
}




