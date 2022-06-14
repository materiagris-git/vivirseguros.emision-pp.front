import { Injectable } from '@angular/core';
import { AppConsts } from '../app/AppConst';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { catalogosModel } from '../interfaces/catalogos.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private url = AppConsts.baseUrl+'catalogos';

  constructor(private http: HttpClient) {  }


  postConsultaGnral(datos: catalogosModel) {
    return new Promise( resolve => {
      this.http.post(`${ this.url }/ConsultaGeneralCatalogos`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}

postRegistrarTabla(datos: catalogosModel) {
  return new Promise( resolve => {
    this.http.post(`${ this.url }/RegistrarModificarTabla`, datos).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
}

postAgregarElemento(datos: catalogosModel) {
  return new Promise( resolve => {
    this.http.post(`${ this.url }/AgregarElementoNuevo`, datos).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
}

postModificarElemento(datos: catalogosModel) {
  return new Promise( resolve => {
    this.http.post(`${ this.url }/ModificarElemento`, datos).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
}

postCambiarEstado(datos: catalogosModel) {
  return new Promise( resolve => {
    this.http.post(`${ this.url }/CambiarEstado`, datos).subscribe( data => {
          resolve(data);
      }, err => {
          console.log(err);
      });
  });
}

  getComboCategorias(codigoCombo,CodigoFiltro){
    return new Promise( (resolve: any) => {
      this.http.get( this.url  + '/ConsultaComboCategorias?codigoCombo='+codigoCombo+'&CodigoFiltro='+CodigoFiltro).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
  
}
