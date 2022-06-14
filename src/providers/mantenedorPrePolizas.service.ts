import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MantenedorPrePolizas, PrePolizasBen, ConsultaPrePolizas } from '../interfaces/mantenedorprepolizas.model';
import { map } from 'rxjs/operators';
import { AppConsts } from '../app/AppConst';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class MantenedorPrepolizasService {
  private url = AppConsts.baseUrl + 'mantenedorprepolizas';

  constructor( private http: HttpClient ) { }
  getPoliza(pNumPoliza: string) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/AfiPol?pNumPoliza=' + pNumPoliza).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getCotizacion(pNumCotizacion: string) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/AfiCot?pCotiz=' + pNumCotizacion).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  getComboEs(combo: string) {
      return new Promise( (resolve: any) => {
          this.http.get( this.url  + '/Comb?combo=' + combo ).subscribe( data => {
              resolve(data);
          }, err => {
              console.log(err);
          });
      });
  }

  getCombo() {
    return new Promise( (resolve: any) => {
      this.http.get( this.url  + '/CmbIde').subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }

  // Agregado para consultas de Beneficiarios.
  getBeneficiariosPol(pNumPoliza: string) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/BenPol?pNumPoliza=' + pNumPoliza).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  postGuardar(datos: MantenedorPrePolizas) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/GuardarPoliza', datos).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  postGuardarBenPol(dataBeneficiarios: PrePolizasBen[]) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/ActualizaBeneficiariosPol', dataBeneficiarios).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  postGrabar( datos: MantenedorPrePolizas ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/ActualizaPoliza`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}
  getBeneficiariosCot(pNumCotizacion: string) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/BenCot?pCotizacion=' + pNumCotizacion).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  // Agregado para consultas de Beneficiarios.

  postCrearPrePoliza(datos: MantenedorPrePolizas) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/CrearPrePoliza', datos).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // Insertar beneficiarios para la Pre-Póliza
  postCotizacionBen(dataBeneficiarios: PrePolizasBen[]) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/InsertarBeneficiariosCot', dataBeneficiarios).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // Búsqueda de Pre-Póliza por Póliza
  postBusquedaPrePol(dataBusqueda: ConsultaPrePolizas) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/BusquedaPrePolizaPol', dataBusqueda).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  // Búsqueda de Pre-Póliza por Cotización
  postBusquedaPreCot(dataBusqueda: ConsultaPrePolizas) {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/BusquedaPrePolizaCot', dataBusqueda).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getDireccion(CodDireccion) {
    const obj = {CodDireccion: CodDireccion}
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/DireccionStr', obj).subscribe(data => {
        // console.log(data);
        resolve(data);

      }, err => {
        console.log(err);
      });
    });
  }

  getFechaEfectoTutor(pFecVigenciaDesde: string) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/ValidaFechaEfecto?pFecVigenciaDesde=' + pFecVigenciaDesde).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  getExportar(pol) {
    return new Promise((resolve: any) => {
      this.http.get<any>(this.url + '/GenerarPre/?poliza='+pol).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  getComboDistritoAll() {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/CmbDistritoAll').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getComboProvinciaAll(codDir: string) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/CmbProvinciaAll?pCodDir=' + codDir).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getProvinciaUnica(codDir: string) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/ProvinciaUnica?pCodDir=' + codDir).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getComboDistrito(codProvi: string) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/CmbDistritoDos?pCodProvincia=' + codProvi).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
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

postConsultaTutDni( NumeroDocumentoTut: string) {
  return new Promise( resolve => {
      //console.log(NumeroDocumentoTut)
      this.http.get(this.url + '/ConsultaDniTutorApoderado?NumeroDocumentoTut='+NumeroDocumentoTut).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
}
getCombos(codigoCombo, CodigoFiltro) {
  return new Promise((resolve: any) => {
    this.http.get(this.url + '/Combos?codigoCombo=' + codigoCombo + '&CodigoFiltro=' + CodigoFiltro).subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
}
getComboProvincia(codigoProvincia) {
  return new Promise((resolve: any) => {
    this.http.get(this.url + '/ComboProvincia?comboProvincia=' + codigoProvincia).subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
}
}
