import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { promise } from 'protractor';
import { resolve } from 'url';
import { PolizaAntecedenPensionados, BeneficiarioInfo } from 'src/interfaces/PolizaAntecedentesPensionado.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PolizaAntecedentesPensionadosService {
  private url = AppConsts.baseUrl + 'mantAntecendentesPensionado';
  private url2 = AppConsts.baseUrl + 'Login';
  constructor(private http: HttpClient) { }

  getComboIdentificacion() {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/CmbIde').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getComboGeneral(codigoCombo) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/ComboGeneral?combo=' + codigoCombo).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getComboDepartamento() {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/CmbRegion').subscribe(data => {
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

  getComboDistrito(codigoDistrito) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/ComboDistrito?comboDistrito=' + codigoDistrito).subscribe(data => {
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

  postBuscarInfoPensionados(dataPensionados: PolizaAntecedenPensionados) {
    return new Promise(resolve => {
      this.http.post(`${this.url}/ConsultarPensionados`, dataPensionados).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  //Consulta los datos de la pantalla de Mantención de Antecedentes Pensionado
  postCargaInfoPensionado(datosPensionado: PolizaAntecedenPensionados) {
    return new Promise(resolve => {
      this.http.post(`${this.url}/PolizaPensionadoConsulta`, datosPensionado).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  
  postValidaLogin(Usuario) {
    return new Promise(resolve => {
      this.http.post(`${this.url2}/ValidarLoginCampos`, Usuario).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  getBeneficiarioInfo(numPoliza) {
    return new Promise((resolve: any) => {
      this.http.get(this.url + '/BeneficiarioInfo?numPoliza=' + numPoliza).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  ActualizarBeneficiario(datos: BeneficiarioInfo[]) {
    return new Promise(resolve => {
      this.http.post(`${this.url}/ActualizarBeneficiario`, datos).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getHistorialDirecciones(datos: BeneficiarioInfo) {
    return new Promise(resolve => {
      this.http.post(`${this.url}/HistorialDirecciones`, datos).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getInfoExcel(numPoliza: string) {
    return new Promise(resolve => {
      this.http.get(this.url + '/InfoExcel?numPoliza=' + numPoliza).subscribe(data => {
        resolve(data);
      }, err => { console.log(err) });
    })
  }

  generaArchivoPDF(numPoliza: string){
    return new Promise((resolve)=>{
      this.http.get(this.url + '/GenerarPDF?numPoliza=' + numPoliza).subscribe( data => {
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
