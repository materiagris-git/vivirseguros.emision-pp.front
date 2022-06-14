import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { ConsultaGeneralObj, ConsultaGeneralDatosGrupoFamiliar, ConsultaGeneralLiquidaciones } from 'src/interfaces/consultaGeneral.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ConsultaGeneralService {
  private baseUrl = AppConsts.baseUrl+'ConsultaGeneral';
  constructor(private http:HttpClient) { 
    
    
  }
  getCombo(){
    return this.http.get<any>(this.baseUrl+'/ConsultaComboDocumentos');
  }
  getPolizas(data:ConsultaGeneralObj){
    return this.http.post<any>(this.baseUrl+'/BusquedaPolizas',data);
  }
  getDatosPoliza(data:ConsultaGeneralObj){
    return this.http.post<any>(this.baseUrl+'/ConsultaDatosGenerales',data);
  }
  getDatosFamiliar(data:ConsultaGeneralDatosGrupoFamiliar){
    return this.http.post<any>(this.baseUrl+'/ConsultaDatosGpoFamiliar',data);
  }
  getConsultaLiquidacion(data:ConsultaGeneralLiquidaciones){
    return this.http.post<any>(this.baseUrl+'/ConsultaDatosLiquidaciones', data);
  }

  CrearReportes(poliza, bandera, pension, endoso, desde, hasta, boletasMes) {

    return new Promise((resolve: any) => {
      this.http.post<any>(this.baseUrl+ '/ExportarArchivos?poliza='+ poliza + '&' + 'bandera=' + bandera + '&' + 'pension=' + pension+ '&' + 'endoso=' + endoso+ '&' + 'desde=' + desde
                            + '&' + 'hasta=' + hasta + '&' + 'boletasMes=' + boletasMes, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  CrearZip(archivos) {
    return new Promise((resolve: any) => {
      this.http.get(`${ this.baseUrl }/GenerarZIP?archivos=${archivos}`).subscribe( data => {
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

    return this.http.get<Blob>(this.baseUrl + "/DescargarZIP", requestOptions).pipe(map(
      (res) => {         
            const blob = new Blob([res], { type : 'application/zip' });            
            return blob;      
      }, err => {//
        console.log(err)
      }));
}

GenerarZIPPolizas(pathArchivos) {
  return new Promise((resolve: any) => {
    
    this.http.get( `${ this.baseUrl }/GenerarZIPPolizas?pathArchivos=${ pathArchivos }` ).subscribe( data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
}

DescargarPDFPolizas( archivo ): Observable<Blob> {
  var datos= { fileName: archivo };
  const requestOptions: Object = {
      responseType: 'blob',
      params: datos
  }

  return this.http.get<Blob>(this.baseUrl + "/DescargarPDFPolizas", requestOptions).pipe(map(
      (res) => {         
          const blob = new Blob([res], { type : 'application/zip' });            
          return blob;      
      }, err => {//
      console.log(err)
      }));
  }

}
