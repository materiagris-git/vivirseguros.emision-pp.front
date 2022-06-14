//Provisionario definitivo""
import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { CalculoPagosRecurrenteModel} from 'src/interfaces/CalculoPagosRecurrentes.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculoPagosRecurrentesService {
  private url = AppConsts.baseUrl+'CalculoPagosRecurrentes';
  private url2 = AppConsts.baseUrl+'ReportesPagos';

  constructor(private http: HttpClient) { }

   postConsultaInfo() {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/DatosRegimen`,null).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
  postCalcular( datos: CalculoPagosRecurrenteModel ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/Calcular`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }

  consultaCalculo(datos: CalculoPagosRecurrenteModel){
    return new Promise( resolve => {
      this.http.post(`${ this.url }/ConsultaCalculo`,datos).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
  }


  consultaDocumento(datos: CalculoPagosRecurrenteModel ){
    return new Promise( resolve => {
      this.http.post(`${ this.url }/consultaDocumento`,datos).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
  }

  ConsultaNoAceptados(datos: CalculoPagosRecurrenteModel ){
    return new Promise( resolve => {
      this.http.post(`${ this.url }/ConsultaNoAceptados`,datos).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
  }

  ConsultaPlanillaMensualRRVV(datos: CalculoPagosRecurrenteModel ){
    return new Promise( resolve => {
      this.http.post(`${ this.url }/ConsultaPlanillaMensualRRVV`,datos).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
  }

  CrearReportes(fecha, tipoCalculo) {

    return new Promise((resolve: any) => {
      this.http.post<any>(this.url2+ '/ExportarArchivos?fecha='+ fecha + '&' + 'tipo=' + tipoCalculo, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  CrearZip(archivos) {
    return new Promise((resolve: any) => {
      this.http.post(`${ this.url2 }/GenerarZIP`, archivos).subscribe( data => {
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

    return this.http.get<Blob>(this.url2 + "/DescargarZIP", requestOptions).pipe(map(
      (res) => {         
            const blob = new Blob([res], { type : 'application/zip' });            
            return blob;      
      }, err => {//
        console.log(err)
      }));
}


}
