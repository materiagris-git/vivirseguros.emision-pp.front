import { Injectable, Inject, Optional, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RootServer } from "../res/values/server";
import { HttpHeaders } from '@angular/common/http';
import { ServerErrorCodes } from "../res/values/error";
import { TraspasoPolizasRecibidas } from '../app/models/TraspasoPolizasRecibidas';
import { AppConsts } from '../app/AppConst';
export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");
const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root'
})
export class TraspasoPolizaService {

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
  private url = this.baseUrl+'mantenedoringresoprimas';
  getFechaactual() {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'TraspasoPolizasRecibidas/Consultar', null ).subscribe(
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
  getConsultaPolizas() {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'TraspasoPolizasRecibidas', null ).subscribe(
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
  mandarDatosTraspaso(datos: string[]) {
    return new Promise((resolve, reject) => {
      this.http.post(this.baseUrl + 'TraspasoPolizasRecibidas/update', datos ).subscribe(
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
