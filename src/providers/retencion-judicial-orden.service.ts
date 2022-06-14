import { Injectable } from '@angular/core';
import { AppConsts } from '../app/AppConst';
import { HttpClient } from '@angular/common/http';
import { RetencionJudicial, DatosTutorInfo } from 'src/interfaces/consultaRetencionJudicial.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetencionJudicialOrdenService {
  private url = AppConsts.baseUrl + 'MantenedorRetJudicialesRepository';

  constructor(private http: HttpClient) {}

  getConsultaPoliza(datos: RetencionJudicial) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/MantenedorRetJudiciales', datos).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  getConsultaAntecedentesRetenciones(datos: RetencionJudicial) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/AntecedentesRet', datos).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  getConsultaAntecedentesPersonales(datos: RetencionJudicial) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/AntecedentesPer', datos).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  getComboTipRet() {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/TipoRetJudicial', null).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  getComboModRet() {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/ModRetJudicial', null).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  getComboDctoMto() {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/DctoMtoRetJudicial', null).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  getValidacionFecha(fecha: DatosTutorInfo) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/ValFechaEfecto', fecha).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }
  public getCatalogsData(fecha: DatosTutorInfo): Observable<any>{
    return this.http.post(this.url + '/ValFechaEfecto', fecha);
}

  guardarOrdenJudicial(orden: DatosTutorInfo) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/ActualizarRetencionJudicial', orden).subscribe(
        data => {
          resolve(data);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

}
