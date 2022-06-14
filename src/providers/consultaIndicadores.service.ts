import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ConsultaIndicadoresService {
  private baseUrl = AppConsts.baseUrl+'ConsultaIndicadores';
  constructor(private http:HttpClient) { 
    
    
  }
  getDatosTablas(FechaIni: string, FechaFin: string ){
    return new Promise((resolve: any) => {
      this.http.get(this.baseUrl + '/ConsultaInformacion?FechaIni='+FechaIni+'&FechaFin='+FechaFin).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  CrearReportes(FechaIni: string, FechaFin: string ) {

    return new Promise((resolve: any) => {
      this.http.post<any>(this.baseUrl+ '/ExportarReportes?FechaIni='+FechaIni+'&FechaFin='+FechaFin, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  CrearZip(archivos) {
    return new Promise((resolve: any) => {
      this.http.post(`${ this.baseUrl }/GenerarZIP`, archivos).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  DescargarZIP( archivo ): Observable<Blob> {
    var datos= { fileName: archivo };
    const requestOptions: Object = {
      responseType: 'blob',
      params: datos
    }

    return this.http.get<Blob>(this.baseUrl + "/DescargarZIP", requestOptions).pipe(map(
      (res) => {         
            const blob = new Blob([res], { type : 'application/zip' });            
            return blob;      
      }, err => {//
        console.log(err)
      }));
}


}
