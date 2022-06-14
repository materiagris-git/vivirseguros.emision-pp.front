import { Injectable } from '@angular/core';
import { AppConsts } from '../app/AppConst';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConsultaObtencionImagenesService {
  private url = AppConsts.baseUrl + 'ConsultaImagenes';

  constructor(private http: HttpClient) {}

  getImagen() {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/LogoVida', null).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  getLoadingImagen() {
    return new Promise((resolve: any) => {
      this.http.post(this.url + '/Loading', null).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }
}
