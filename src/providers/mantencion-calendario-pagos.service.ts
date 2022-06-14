import { Injectable } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { CalculoPagosRecurrenteModel} from 'src/interfaces/CalculoPagosRecurrentes.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MantencionCalendarioPagosService {
  private url = AppConsts.baseUrl+'CalendarioPagos';

  constructor(private http: HttpClient) { }

   postConsulta(Periodo: string ) {     
    return new Promise( resolve => {
        this.http.post(`${ this.url }/ConsultaGnral`,{"Periodo":Periodo}).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
  postGuardar(Periodo: string, fecha: string ,estado: string ) {     
    return new Promise( resolve => {
        this.http.post(`${ this.url }/Guardar`,{"Periodo":Periodo, "Fecha_Pago_Recurrente":fecha, "Estado":estado}).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });    
  }
  generaArchivoPDF(Periodo: string){
    return new Promise((resolve)=>{
      this.http.post(`${ this.url }/GenerarPDF`,{"Periodo":Periodo}).subscribe( data => {
        resolve(data);
      }, err=>{console.log(err)
      });
    })
  }
  downloadFile(archivo):Observable<Blob>{
    var datos= {fileName:archivo};
    const requestOptions: Object = {
      responseType: 'blob',
      params: datos
    }  
    return this.http.get<Blob>(this.url+"/descarga",requestOptions).pipe(map(
      (res) => {         
            const blob = new Blob([res], { type : 'application/pdf' });            
            return blob;      
      },
      err=>{//
        console.log(err)
      }));
  }

}
