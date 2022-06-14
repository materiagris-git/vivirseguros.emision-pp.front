import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { BusquedaGeneralPoliza } from 'src/interfaces/busquedaGeneralPoliza.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MantencionPagosTercerosGastosSepelioService {
  private url = AppConsts.baseUrl + 'MantencionPTGastosSepelio';
  constructor(private http:HttpClient) { }

  getCombos(){
    return new Promise (( resolve)=>{
      this.http.post(this.url+'/ConsultaDatosGenerales',null).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)});
    })
  }

  getComboProvincia(codigo){

    return new Promise((resolve)=>{
      this.http.get(this.url+'/ConsultaComboProvincia?codigo='+ codigo).subscribe(data=>{
        resolve(data);
      }, err =>{console.log(err)})
    })
  }

  getComboDistrito(codigo){
    return new Promise((resolve)=>{
      this.http.get(this.url+'/ConsultaComboDistrito?codigo='+ codigo).subscribe(data=>{
        resolve(data);
      }, err =>{console.log(err)})
    })
  }

  datosGastosSepelio(numPoliza, numRegistro){
    return new Promise((resolve)=>{
      this.http.get(this.url+'/GastosSepelio?numPoliza='+numPoliza + '&' + 'numRegistro=' + numRegistro).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)})
    })
  }

  guardarEditar(datos){
    return new Promise((resolve)=>{
      this.http.post(this.url+'/GuardarEditar', datos).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)})
    })
  }

  moneda(fecha, numPoliza, numEndoso){
    return new Promise((resolve)=>{
      this.http.get(this.url+'/Moneda?fecha='+fecha + '&' + 'numPoliza=' + numPoliza + '&' + 'numEndoso=' + numEndoso).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)})
    })
  }

  cargaCabezeraGS(datos: BusquedaGeneralPoliza) {
    return new Promise((resolve)=>{
      this.http.post(this.url + '/InfoCabezera', datos).subscribe(data=>{
        resolve(data);
      }, err => {console.log(err);
      });
    });
  }

  getComboMoneda(){
    return new Promise((resolve)=>{
      this.http.get(this.url+'/CombMon').subscribe(data=>{
        resolve(data);
      }, err =>{console.log(err)})
    })
  }

  CrearReportes(poliza, tipoPago, endoso, ind_registro, moneda) {

    return new Promise((resolve: any) => {
      this.http.post<any>(this.url+ '/ExportarArchivoPrima?poliza='+ poliza + '&' + 'tipoPago=' + tipoPago + '&' + 'endoso=' + endoso + '&' + 'ind_registro=' + ind_registro + '&' + 'moneda=' + moneda, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  CrearZip(archivos) {
    return new Promise((resolve: any) => {
      this.http.post(`${ this.url }/GenerarZIP`, archivos).subscribe( data => {
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

    return this.http.get<Blob>(this.url + "/DescargarZIP", requestOptions).pipe(map(
      (res) => {         
            const blob = new Blob([res], { type : 'application/zip' });            
            return blob;      
      }, err => {//
        console.log(err)
      }));
}
}
