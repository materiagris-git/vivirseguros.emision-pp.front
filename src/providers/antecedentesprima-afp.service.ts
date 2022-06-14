import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AntecedentesPrimaAfp, Ubigeo } from 'src/interfaces/antecedentesprima-afp.model';
import { resolve } from 'url';
import { AppConsts } from '../app/AppConst';
@Injectable({
  providedIn: 'root'
})
export class AntecedentesprimaAfpService {

  private url = AppConsts.baseUrl + 'antecedentesprima';

  constructor(private http: HttpClient) {
    // console.log("Servicio Listo");
  }

  getPolizas(numPoliza: string) {
    return new Promise((resolve: any) => {
      this.http.get(`${this.url}/ConsultarPoliza?numPoliza=${numPoliza}`).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getBusquedaAFPPolizas(numPoliza: string) {
    return new Promise( (resolve: any) => {
      this.http.get( `${ this.url }/BusquedaAFPPolizas?pNumPoliza=${numPoliza}` ).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getCalculoPension(dataPol) {
    return new Promise((resolve: any) => {
      this.http.post<any>(`${this.url}/consultarpension`, dataPol).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  grabarPension(datos: AntecedentesPrimaAfp) {
    return new Promise((resolve: any) => {
      this.http.post(`${this.url}/grabarrecepcion`, datos).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // Búsqueda de AFP por Póliza
  postBusquedaAfpPol(dataBusqueda: AntecedentesPrimaAfp) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/BusquedaPrePolizaPol', dataBusqueda).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getCodMoneda(codMoneda: string) {
    return new Promise((resolve: any) => {
      this.http.get(`${this.url}/CodigoMoneda?codMoneda=${codMoneda}`).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getUbigeoCorresp(numPoliza: string) {
    return new Promise((resolve: any) => {
      this.http.get(`${this.url}/UbigeoCorresp?numPoliza=${numPoliza}`).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  postUbigeoUpdate(dataUbigeo: Ubigeo) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/ActualizarUbigeo', dataUbigeo).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}