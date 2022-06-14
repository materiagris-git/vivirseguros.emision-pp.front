import { Injectable, Inject, Optional, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ServerErrorCodes } from "../res/values/error";
import { ConsultaTraspaso } from 'src/app/models/ConsultaTraspaso';
import { AppConsts } from '../app/AppConst';
export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");

@Injectable({
  providedIn: 'root'
})

export class ConsultaPolizastraspasadasService {

  server: any;
  options: any;
  private http: HttpClient;
  private baseUrl: string;

  appErrorCodes: any;
  incomingdata = '';
  constructor(
    @Inject(HttpClient) http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    this.http = http;
    this.baseUrl = baseUrl ? baseUrl : '';
    this.appErrorCodes = ServerErrorCodes;
  }
  getFechas(fechaBusqueda: ConsultaTraspaso) {
    return new Promise((resolve, reject) => {
      this.http.post(AppConsts.baseUrl+ 'ConsultasPolizasTraspasadas', fechaBusqueda).subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
          console.log(err);
        }
      );
    });
  }
}
