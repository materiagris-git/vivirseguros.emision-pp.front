import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MantenimientoIngresoPrimas } from '../interfaces/mantenimientoIngresoPrimas.model';
import { map } from 'rxjs/operators';
import { AppConsts } from '../app/AppConst';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class MantenedorIngresoPrimasService {
    private url = AppConsts.baseUrl + 'mantenedoringresoprimas';
    private url2 = AppConsts.baseUrl + 'ReportesPagos';
    constructor( private http: HttpClient) { }

    getPolizas(pNumeroPoliza: string) {
        return new Promise( (resolve: any) => {
            this.http.get( `${ this.url }/BusquedaPrimas?pNumPoliza=${ pNumeroPoliza }` ).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    getPoliza( pNumeroPoliza: string ) {
        return new Promise( (resolve: any) => {
            this.http.get( `${ this.url }/ConsultarPoliza?pNumPoliza=${ pNumeroPoliza }` ).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    postCalculo( datos: MantenimientoIngresoPrimas ) {
        return new Promise( resolve => {
            this.http.post(`${ this.url }/Calcular`, datos).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    postGrabar( datos: MantenimientoIngresoPrimas ) {
        return new Promise( resolve => {
            this.http.post(`${ this.url }/grabar`, datos).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    flValidaPeriodoPagoRegimen( fechaPeriodo: string ) {
        return new Promise((resolve: any) => {
            this.http.get(`${this.url}/Validaperiodopagoregimen?fechaPeriodo=${fechaPeriodo}`).subscribe(data => {
              resolve(data);
            }, err => {
              console.log(err);
            });
          });
    }

    fgCalcularFechaPrimerPagoEst( datos: MantenimientoIngresoPrimas ) {
        return new Promise( resolve => {
            this.http.post(`${ this.url }/Fechaprimerpago`, datos).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }
    getExportar(pol) {
        return new Promise((resolve: any) => {
          this.http.get<any>(this.url + '/GenerarAFP/?poliza='+pol).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      }

      getEnviarPoliza(pol) {
        return new Promise((resolve: any) => {
          this.http.get<any>(this.url + '/EnviarPoliza/?poliza='+pol).subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      }
    
    DescargarPDFPrimas( archivo ): Observable<Blob> {
    var datos= { fileName: archivo };
    const requestOptions: Object = {
        responseType: 'blob',
        params: datos
    }

    return this.http.get<Blob>(this.url + "/DescargarPDFPrimas", requestOptions).pipe(map(
        (res) => {         
            const blob = new Blob([res], { type : 'application/zip' });            
            return blob;      
        }, err => {//
        console.log(err)
        }));
    }

    DescargarPDF( archivo ): Observable<Blob> {
        var datos= { fileName: archivo };
        const requestOptions: Object = {
          responseType: 'blob',
          params: datos
        }

        return this.http.get<Blob>(this.url + "/DescargarPDF", requestOptions).pipe(map(
          (res) => {         
                const blob = new Blob([res], { type : 'application/pdf' });            
                return blob;      
          }, err => {//
            console.log(err)
          }));
    }

    getFechasEfectivas( pNumeroPoliza: string ) {
        return new Promise( (resolve: any) => {
            this.http.get( `${ this.url }/ConsultaFechasEfectivas?pNumPoliza=${ pNumeroPoliza }` ).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    postGrabarFecEfectivas( datos: MantenimientoIngresoPrimas[] ) {
        return new Promise( resolve => {
            this.http.post(`${ this.url }/GuardarFechasEfectivas`, datos).subscribe( data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    CrearReportes(poliza, tipoMoneda, tipoPension) {

        return new Promise((resolve: any) => {
          this.http.post<any>(this.url2+ '/ExportarArchivoPrima?poliza='+ poliza + '&' + 'moneda=' + tipoMoneda+ '&' + 'pension=' + tipoPension, null).subscribe( data => {
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

    GenerarZIPPrimas(pathArchivos) {
      return new Promise((resolve: any) => {
        
        this.http.get( `${ this.url }/GenerarZIPRecepcionPrimas?pathArchivos=${ pathArchivos }` ).subscribe( data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
      });
    }

    DescargarExcel( archivo ): Observable<Blob> {
        var datos= { fileName: archivo };
        const requestOptions: Object = {
          responseType: 'blob',
          params: datos
        }

        return this.http.get<Blob>(this.url + "/DescargarExcel", requestOptions).pipe(map(
          (res) => {         
                const blob = new Blob([res], { type : 'application/vnd.ms-excel' });            
                return blob;      
          }, err => {//
            console.log(err)
          }));
    }
}
