import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { RootServer } from '../res/values/server';
import { ServerErrorCodes } from '../res/values/error';
import 'rxjs/add/operator/map';
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');


/*
  Generated class for the LoginDaoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({
  providedIn: 'root'
})
export class EjemploProvider {
  server: any;
  options: any ;
  private http: HttpClient;
  private baseUrl: string;

  appErrorCodes: any;
  incomingdata = '';
  constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    this.http = http;
    this.baseUrl = baseUrl ? baseUrl : '';
    this.appErrorCodes = ServerErrorCodes;
  }
  getUsers() {
        return new Promise(resolve => {
          this.http.get(this.baseUrl + '/users').subscribe(data => {
            resolve(data);

          }, err => {
            console.log(err);
          });
        });
      }

  saveUser(data) {
        return new Promise((resolve, reject) => {
          this.http.post(this.baseUrl + '/users', JSON.stringify(data))
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(err);
            });
        });
      }

}

