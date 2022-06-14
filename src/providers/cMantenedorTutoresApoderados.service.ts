import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cMantenedorTutoresApoderados, DatosTutorInfo } from '../interfaces/consultaMantenedorTutoresApoderados.model';
import { map } from 'rxjs/operators';
import { AppConsts } from '../app/AppConst';

@Injectable({
    providedIn: 'root'
})
 //link -> baseUrl+'mantenedorTutoresApoderados'
export class cMantenedorTutoresApoderadosService {
  private url = AppConsts.baseUrl+'mantenedorTutoresApoderados';

  constructor( private http: HttpClient ) { }

  //el modelo está vació -> datos: MantenedorTutoresApoderados
  postConsultaInfo( datos: cMantenedorTutoresApoderados ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/mantenedorTutorApoderado`, datos).subscribe( data => {
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
getComboGeneral(codigoCombo,CodigoFiltro){
    return new Promise( (resolve: any) => {
      this.http.get( this.url  + '/ComboGeneral?codigoCombo='+codigoCombo+'&CodigoFiltro='+CodigoFiltro).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }
ActualizarTutorApoderado( datos: DatosTutorInfo ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/ActualizarTutorApoderado`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}
AgregarTutorApoderado( datos: DatosTutorInfo ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/AgregarTutorApoderado`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}
ValidaFechaEfecto( datos: DatosTutorInfo ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/ValidaFechaEfecto`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}
getValidaVigenciaPoliza(num_poliza,num_endoso,fec_vigencia){
    return new Promise( (resolve: any) => {
      this.http.get( this.url  + '/ValidaVigenciaPoliza?num_poliza='+num_poliza+'&num_endoso='+num_endoso+'&fec_vigencia='+fec_vigencia).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
  }

  postHistorialTutor( datos: cMantenedorTutoresApoderados ) {
    return new Promise( resolve => {
        this.http.post(`${ this.url }/MantenedorHistorial`, datos).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}

postConsultaTutDni( NUM_IDENTUT: string) {
    return new Promise( resolve => {
        //console.log(NUM_IDENTUT)
        this.http.get(this.url + '/ConsultaDniTutorApoderado?NUM_IDENTUT='+NUM_IDENTUT).subscribe( data => {
            resolve(data);
        }, err => {
            console.log(err);
        });
    });
}

}
