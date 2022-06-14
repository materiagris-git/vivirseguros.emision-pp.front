import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoginService } from 'src/providers/login.service';
import { Login } from 'src/interfaces/login.model';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Globales } from '../../../interfaces/globales';
import { HttpClient } from '@angular/common/http';
import { NullAstVisitor } from '@angular/compiler';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  //idUser = 3;
  datosLog:Login = new Login();
  params;
  dis:boolean=false;
  varin:boolean=false;
  constructor(private servicioLogin:LoginService, 
              private activatedRoute:ActivatedRoute,
              public titleService: Title, 
              private http: HttpClient, 
              private cdRef:ChangeDetectorRef) { 
      // if(this.activatedRoute.snapshot.paramMap.get('idUs')!=null){
        
      //   this.params = this.activatedRoute.snapshot.paramMap.get('idUs');

      // }
      if(this.activatedRoute.snapshot.queryParams.idUs !=null){
        this.params =  this.activatedRoute.snapshot.queryParams.idUs;
      }
  }

  ngOnInit() {
    this.dis=false;
    this.varin = true;
    this.titleService.setTitle("Bienvenido");
    //cambiar cuando recibamos idUsuario encriptado
    this.datosLog.IdUserEncrypt = this.params;

    this.servicioLogin.init(this.datosLog/*, localStorage.getItem('url')*/).then((resp:any)=>{
      if (resp.Permisos.length > 0) {
        localStorage.setItem('currentUser',this.params);
        localStorage.setItem('permisos', JSON.stringify(resp.Permisos));
      }
      
    })
  }

  ngAfterViewChecked(): void {
    this.datosLog.IdUserEncrypt = this.params;

    /*if (localStorage.getItem('url') === null) {
      this.readFile().then( () => {
        this.servicioLogin.init(this.datosLog, localStorage.getItem('url')).then((resp:any)=>{
          if (resp.Permisos.length > 0) {
            localStorage.setItem('currentUser',this.params);
            localStorage.setItem('permisos', JSON.stringify(resp.Permisos));
          }
          
        })
      });
    }

    if (localStorage.getItem('currentUser') === null) {
      this.servicioLogin.init(this.datosLog, localStorage.getItem('url')).then((resp:any)=>{
        if (resp.Permisos.length > 0) {
          localStorage.setItem('currentUser',this.params);
          localStorage.setItem('permisos', JSON.stringify(resp.Permisos));
        }
        
      })
    }*/

    this.cdRef.detectChanges();
  }

  readFile() {
    return new Promise((resolve: any) => { this.http.get('assets/files/fileIni.json')
      .subscribe (data => {
        var jsonData = JSON.stringify(data as string[]);
        var jsonData2 = JSON.parse(jsonData);
        localStorage.setItem('url', jsonData2.URL);
        resolve (jsonData2)
      }, err => {
        console.log(err);
      })
    });
  }
}
