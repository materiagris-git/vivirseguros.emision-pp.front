import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { Observable, BehaviorSubject } from 'rxjs';
import { Login } from 'src/interfaces/login.model';
import { Globales } from 'src/interfaces/globales';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //private url = '';

  private url = AppConsts.baseUrl + 'Login';
  private currentUserSubject:BehaviorSubject<Login>;
  public currentUser:Observable<Login>;
  constructor(private http:HttpClient, private router:Router) { 
    //this.url = localStorage.getItem('url') + 'Login';
    var log:Login = new Login;
    log.IdUserEncrypt = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<Login>(log);
        this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue():Login{
    return this.currentUserSubject.value;
}
    init(login){
      return new Promise((resolve)=>{
          this.http.post(this.url+'/ValidarLogin',login).subscribe(data=>{
            resolve(data);
            this.currentUserSubject.next(login.IdUserEncrypt);
          }, err=> { console.log(err); })
      });
    }
    logout(){
      localStorage.clear();
      Globales.permisos = [];
      this.currentUserSubject.next(null);
    }

    verificarSesion()
    {
        if(!localStorage.getItem('currentUser')){
        this.logout();
        this.router.navigate(['/inicio']);
        }
    }
}
