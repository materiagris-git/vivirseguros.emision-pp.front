import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '../app/AppConst';

@Injectable({
    providedIn: 'root'
})

export class MantenimientoUbigeoService {

    private url = AppConsts.baseUrl + 'MantenimientoUbigeo';

    constructor( private http: HttpClient ) { }

    postGeneraCodigoNuevo(bandera: string, codDepto: string, codProv: string) {
        var datos = {
            BanderaCategoria: bandera,
            CodDepartamento: codDepto,
            CodProvincia: codProv
        };

        return new Promise((resolve: any) => {
            this.http.post(`${this.url}/GenerarCodigoNuevo`, datos).subscribe(data => {
            resolve(data);
            }, err => {
            console.log(err);
            });
        });
    }

    postInsertarNuevoElemento(bandera: string, codDepto: string, codProv: string, nomUsuario: string, nombreNuevoElemento: string, codigoNuevoElemento: string) {
        var datos = {
            BanderaCategoria: bandera,
            CodDepartamento: codDepto,
            CodProvincia: codProv,
            NombreUsuario: nomUsuario,
            NombreNuevoRegistro: nombreNuevoElemento,
            CodigoNuevoRegistro: codigoNuevoElemento
        };

        return new Promise((resolve: any) => {
            this.http.post(`${this.url}/InsertarNuevoElemento`, datos).subscribe(data => {
            resolve(data);
            }, err => {
            console.log(err);
            });
        });
    }

    postActualizarElemento(bandera: string, 
                           codDepto: string, 
                           codProv: string, 
                           nomUsuario: string, 
                           nombreNuevoElemento: string, 
                           codigoNuevoElemento: string,
                           codDeptoAnterior: string,
                           codProvAnterior: string,
                           codDireccion: number) {
        var datos = {
            BanderaCategoria: bandera,
            CodDepartamento: codDepto,
            CodProvincia: codProv,
            NombreUsuario: nomUsuario,
            NombreNuevoRegistro: nombreNuevoElemento,
            CodigoNuevoRegistro: codigoNuevoElemento,
            CodDeptoAnterior: codDeptoAnterior,
            CodProvAnterior: codProvAnterior,
            CodDireccion: codDireccion
        };

        return new Promise((resolve: any) => {
            this.http.post(`${this.url}/ActualizarElemento`, datos).subscribe(data => {
            resolve(data);
            }, err => {
            console.log(err);
            });
        });
    }

}