import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { CalculoPagosRecurrenteModel} from 'src/interfaces/CalculoPagosRecurrentes.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HijosMayoresService {
  private url = AppConsts.baseUrl+'HijosMayores';
  private url2 = AppConsts.baseUrl + 'Reportes';

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
  
  consultaHijos(){
    return new Promise( resolve => {
      this.http.post(`${ this.url }/ConsultaHijos`,null).subscribe( data => {
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


  guardaCorreo(datos){
    return new Promise ( (resolve)=>{
      this.http.post(this.url+'/GuardarCorreo', datos).subscribe(data=>{
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
