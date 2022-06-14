import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { CalculoPagosRecurrenteModel} from 'src/interfaces/CalculoPagosRecurrentes.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PagosSuspendidos } from 'src/interfaces/PagosSuspendidos';

@Injectable({
  providedIn: 'root'
})
export class PagosSuspendidosService {
  private url = AppConsts.baseUrl+'PagosSuspendidos';
  private url2 = AppConsts.baseUrl + 'ReportesPagos';
  private url3 = AppConsts.baseUrl+'CalculoPagosRecurrentes';
  constructor(private http: HttpClient) { }

   postConsultaInfo() {
    return new Promise( resolve => {
        this.http.post(`${ this.url3 }/DatosRegimen`,null).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
  
  consultaPoliza(periodo){
    return new Promise( resolve => {
      this.http.post(this.url+'/ConsultarPolizas?periodo='+periodo,null).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
  }


  ConsultaPlanillaMensualRRVV(periodo){
    return new Promise( resolve => {
      this.http.post(this.url +'/ConsultaPlanillaMensualRRVV?periodo='+periodo, null).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
  }


  guardaFechas(datos){
    return new Promise ( (resolve)=>{
      this.http.post(this.url+'/GuardarFechas', datos).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)})
    })

  }


ExcelHijos(){
  return new Promise((resolve: any) => {
    this.http.get<any>(this.url + '/ExportarReporte').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
}

ArchivoCotejo(datos) {
  return new Promise(resolve => {
      let fileToUpload = <File>datos;
      if (fileToUpload != undefined) {
          const formData = new FormData();
          formData.append('file', fileToUpload, fileToUpload.name);

          this.http.post(`${this.url}/ArchivoCotejo`, formData).subscribe(data => {
              resolve(data);
          }, err => {
              console.log(err);
          });

      }
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

consultaDocumento(tipoCalculo, periodo){
  return new Promise( resolve => {
    this.http.post(this.url +'/consultaDocumento?tipoCalculo=' + tipoCalculo + '&' + 'periodo=' + periodo, null).subscribe( data => {
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
  let datos= { fileName: archivo };
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
