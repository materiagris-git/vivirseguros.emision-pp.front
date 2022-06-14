import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppConsts } from '../app/AppConst';
import { resolve } from 'url';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformeNormativoService {
  private url = AppConsts.baseUrl + 'ReportesSalud';
  private url2 = AppConsts.baseUrl + 'Reportes';
  private url3 = AppConsts.baseUrl + 'ReportesPensionSBS';

  constructor( private http: HttpClient ) { }

  PolizasSeguroVigente(fecha) {
    let obj = { fecha : fecha}
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url2+ '/ReportePolizasSeguroVigente?fecha='+fecha, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  EstadisticaBeneficiarios(fecha) {
    let obj = { fecha : fecha}
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url2+ '/ReporteEstadisticaBeneficiarios?fecha='+fecha, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  ReporteRemision(fecha) {
    let obj = { fecha : fecha}
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url2+ '/ReporteRemision?fecha='+fecha, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  ReportesEssalud(fecha) {
    let obj = { fecha : fecha}
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url+ '/ReportesEssalud', obj).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  ReportesCotizacion(fecha) {
    let obj = { fecha : fecha}
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url2+ '/ReportePlanillasPagoSalud?fecha='+fecha, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  ReportesJubilacion(fecha) {
    let obj = { fecha : fecha}
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url2+ '/ReporteJubilaciones?fecha='+fecha, null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  ReportesPensionSBS(fecha) {
    let obj = { fecha : fecha}
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url3+ '/ReportesPensionSBS', obj).subscribe( data => {
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
  CrearZip65(archivos) {
    return new Promise((resolve: any) => {
      this.http.post(`${ this.url2 }/GenerarZIP65`, archivos).subscribe( data => {
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

    return this.http.get<Blob>(this.url2 + "/DescargarZIP", requestOptions).pipe(map(
      (res) => {
            const blob = new Blob([res], { type : 'application/zip' });
            return blob;
      }, err => {//
        console.log(err)
      }));
}

DescargarZIP65( archivo ): Observable<Blob> {
  let datos= { fileName: archivo };
  const requestOptions: Object = {
    responseType: 'blob',
    params: datos
  }

  return this.http.get<Blob>(this.url2 + "/DescargarZIP65", requestOptions).pipe(map(
    (res) => {
          const blob = new Blob([res], { type : 'application/zip' });
          return blob;
    }, err => {//
      console.log(err)
    }));
}

BorrarArchivos() {
    return new Promise((resolve: any) => {
      this.http.post<any>(this.url2+ '/BorrarArchivos',null).subscribe( data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
