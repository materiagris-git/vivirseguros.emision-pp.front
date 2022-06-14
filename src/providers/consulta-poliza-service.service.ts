import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { mantenedorCertificadosSupervivencia } from "src/interfaces/mantenedorCertificadosSupervivencia.model";
import { AppConsts } from '../app/AppConst';
import { consultaPolizaModel } from 'src/interfaces/consultaPoliza.model';
import { ConsultaGeneralObj } from 'src/interfaces/consultaGeneral.model';
import { resolve } from 'url';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaPolizaServiceService {
  private url = AppConsts.baseUrl + 'MantenedorEndosoSimplesAct';
  private url2 = AppConsts.baseUrl + 'Reportes';

  constructor( private http: HttpClient ) { }

  getCombo() {
    return new Promise( (resolve: any) => {
      this.http.get(this.url+'/ConsultaComboDocumentos' ).subscribe( data => {resolve(data);}
      ,err => {console.log(err);});
  });}
  getConsultasPolizas(datos: consultaPolizaModel){
    return new Promise( (resolve:any)=>{
      this.http.post(this.url+'/BusquedaPolizas', datos).subscribe(data=>{ resolve(data)}
      ,err=>{console.log(err)});
  });}
  getMovimientosEndoso(poliza) {
    let obj = { fecha : poliza}
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url+ '/ConsultaMovEndoso?poliza='+poliza, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }



  getPoliza(datos:ConsultaGeneralObj){
    return new Promise( (resolve)=>{
      this.http.post(this.url+'/ConsultaDatosGenerales', datos).subscribe(data=>{
        resolve(data)},
        err=>{console.log(err)})
    })
  }
  guardarDatos(datos){
    return new Promise ( (resolve)=>{
      this.http.post(this.url+'/GuardaEndosoTemporal', datos).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)})
    })

  }
  descartarCambios(datos){
    return new Promise ((resolve)=>{
      this.http.post(this.url+'/EliminaEndosoTemporal',datos).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err);
      })
    })
  }
  generarEndoso(data){
    return new Promise((resolve)=>{
      this.http.post(this.url+'/GuardaEndoso',data).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err);
      })
    })
  }
  generaPreEndoso(datos){
    return new Promise((resolve)=>{
      this.http.post(this.url+'/GeneraPreEndoso',datos).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)
      });
    })
  }
  generaPreEndosoAcc(poliza, endoso){
    return new Promise((resolve)=>{
      this.http.post<any>(this.url+ '/GeneraPreEndosoAcc?poliza='+poliza+'&endoso='+endoso, null).subscribe( data => {
        resolve(data);
      }, err=>{console.log(err)
      });
    })
  }

  Descargar( archivo ): Observable<Blob> {
    var datos= { fileName: archivo };
    const requestOptions: Object = {
      responseType: 'blob',
      params: datos
    }

    return this.http.get<Blob>(this.url + "/Descargar", requestOptions).pipe(map(
      (res) => {         
            const blob = new Blob([res], { type : 'application/zip' });            
            return blob;      
      }, err => {//
        console.log(err)
      }));
}

  BorraArchivos() {
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url2+ '/BorrarArchivos', null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  calculaReserva(data){
    return new Promise((resolve)=>{
      this.http.post(this.url+'/CalcularReserva',data).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err);
      })
    })
  }
}
