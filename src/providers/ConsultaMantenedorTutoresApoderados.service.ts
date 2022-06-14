import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mantenedorTutoresApoderados } from '../interfaces/mantenedorTutoresApoderados.model';
import { map } from 'rxjs/operators';
import { AppConsts } from '../app/AppConst';

@Injectable({
    providedIn: 'root'
})

export class ConsultaMantenedorTutoresApoderadosService {
  private url = AppConsts.baseUrl+'mantenedorTutoresApoderados';

  constructor( private http: HttpClient ) { }


  postConsultaGnral( datos: mantenedorTutoresApoderados ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/ConsultaGeneralTutorApoderado`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}

getComboGeneral(codigoCombo,CodigoFiltro){
    return new Promise( (resolve: any) => {
      this.http.get( this.url  + '/ComboGeneral?codigoCombo='+codigoCombo+'&CodigoFiltro='+CodigoFiltro).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }


}
