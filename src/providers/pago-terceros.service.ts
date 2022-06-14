import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { PagoTercerosBusqueda } from 'src/interfaces/pago-terceros-model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoTercerosService {

  private url = AppConsts.baseUrl + 'pagoTerceros';

  constructor(private http: HttpClient) { }

  getCombos(codigoCombo, CodigoFiltro) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/Combos?codigoCombo=' + codigoCombo + '&CodigoFiltro=' + CodigoFiltro).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  postBuscarPagoTercero(dataPagoTerceros: PagoTercerosBusqueda) {
    return new Promise(resolve => {
      this.http.post(`${this.url}/ConsultarPagoTerceros`, dataPagoTerceros).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  postCargaInfoPoliza(datosPoliza: PagoTercerosBusqueda) {
    return new Promise(resolve => {
      this.http.post(`${this.url}/PolizaPensionadoConsulta`, datosPoliza).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  verificaSobrevivencia(numPoliza) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/VerificaSobrevivencia?numPoliza=' + numPoliza).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getInfoCuotaMortuaria(numPoliza) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/CuotaMortuariaInfo?numPoliza=' + numPoliza).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getInfoPagoGarantizado(numPoliza) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/PagoGarantizadoInfo?numPoliza=' + numPoliza).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getExportar(poliza) {
    return new Promise((resolve: any) => {
    this.http.post<any>(this.url+ '/GeneracionReporte?poliza='+poliza, null).subscribe( data => {
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
    return this.http.get<Blob>(this.url + '/descarga/?fileName='+archivo,requestOptions).pipe(map(
        (res) => {
       
            const blob = new Blob([res], { type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
            return blob;      
      },
      err=>{console.log(err)
      }));
  }

}
