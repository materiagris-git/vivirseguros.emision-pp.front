import { Injectable } from '@angular/core';
import { ArchivoConfirmacionPrima } from 'src/interfaces/archivoconfirmacion-prima.model';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../app/AppConst';
@Injectable({
  providedIn: 'root'
})
export class ArchivoconfirmacionPrimaService {

  private url = AppConsts.baseUrl+'archivoconfirmacionprimas';
  
  constructor(private http: HttpClient) {
    console.log("Servicio Listo");
   }

  getResumenArchivoConf(dataPrimas: ArchivoConfirmacionPrima) {
    return new Promise((resolve: any) => {
      this.http.post<any>(`${this.url}/consultararchprimas`, dataPrimas).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getConsultaArchivoConf(dataPrimas: ArchivoConfirmacionPrima) {
    return new Promise((resolve: any) => {
      this.http.post<any>(`${this.url}/ConsultarArchPrimasXML`, dataPrimas).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getInsertaDatosArchivoConf(dataPrimas: ArchivoConfirmacionPrima) {
    return new Promise((resolve: any) => {
      this.http.post<any>(`${this.url}/InsertarDatosArchPrimasXML`, dataPrimas).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
