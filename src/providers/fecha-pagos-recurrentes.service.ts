import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { CalculoPagosRecurrenteModel} from 'src/interfaces/CalculoPagosRecurrentes.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FechaPagosRecurrentesService {
  private url = AppConsts.baseUrl+'FechaPagosRecurrentes';
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
  
  consultaCalculo(datos: CalculoPagosRecurrenteModel){
    return new Promise( resolve => {
      this.http.post(`${ this.url }/ConsultaCalculo`,datos).subscribe( data => {
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


  guardaFecha(datos){
    return new Promise ( (resolve)=>{
      this.http.post(this.url+'/GuaradaFecha', datos).subscribe(data=>{
        resolve(data);
      }, err=>{console.log(err)})
    })

  }


ExcelCotejo(fecha: string){
  return new Promise((resolve: any) => {
    this.http.get<any>(this.url + '/ExportarCotejo?fecha=' + fecha).subscribe(data => {
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
