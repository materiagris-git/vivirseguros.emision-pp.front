import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConsultaMantenedorCertificadosSupervivencia } from '../interfaces/ConsultaMantenedorCertificadosSupervivencia.model';
import { map } from 'rxjs/operators';
import { AppConsts } from '../app/AppConst';
import { mantenedorCertificadosSupervivencia, ActualizarCertificado } from 'src/interfaces/mantenedorCertificadosSupervivencia.model';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class ConsultaMantenedorCertificadosSupervivenciaService {
    private url = AppConsts.baseUrl + 'mantendedorCertificadosSupervivencia';

    contact: Array<Object>;
    constructor(private http: HttpClient) { }

    getCombos(codigoCombo, CodigoFiltro) {
        return new Promise((resolve: any) => {
            this.http.get(this.url + '/Combos?codigoCombo=' + codigoCombo + '&CodigoFiltro=' + CodigoFiltro).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    postConsultaGnral(datos: mantenedorCertificadosSupervivencia) {
        return new Promise(resolve => {
            this.http.post(`${this.url}/ConsultaGeneralSupervivencia`, datos).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    postCargaInfoPolSuperviviente(datos: mantenedorCertificadosSupervivencia) {
        return new Promise(resolve => {
            this.http.post(`${this.url}/PolizaSupervivienteConsulta`, datos).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    getBeneficiarioInfo(numPoliza, NumEndoso, numIdenBen) {
        return new Promise((resolve: any) => {
            this.http.get(this.url + '/BeneficiarioInfo?numPoliza=' + numPoliza + '&NumEndoso=' + NumEndoso + '&numIdenBen=' + numIdenBen).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    getBenefInfoCSE(bandera, numPoliza, numOrden) {
        return new Promise((resolve: any) => {
            this.http.get(this.url + '/BeneficiarioInfoCSE?bandera=' + bandera + '&numPoliza=' + numPoliza + '&numOrden=' + numOrden).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    getFechaEfecto(fechaInicio, numPoliza, numOrden, fechaTermino) {
        return new Promise((resolve: any) => {
            this.http.post<any>(this.url + '/fechaEfecto?fechaInicio=' + fechaInicio + '&numPoliza=' + numPoliza + '&numOrden=' + numOrden + '&fechaTermino=' + fechaTermino, null).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            })
        })
    }

    ActualizarCertificado(datos: ActualizarCertificado) {
        return new Promise(resolve => {
            this.http.post(`${this.url}/ActualizarCertificado`, datos).subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    ArchivoBeneficiario(datos: ActualizarCertificado) {
        return new Promise(resolve => {
            let fileToUpload = <File>datos.file;
            if (fileToUpload != undefined) {
                const formData = new FormData();
                formData.append('NumPoliza', datos.NumPoliza);
                formData.append('NumDocumento', datos.NumIdenben);
                formData.append('Certificado', datos.CodTabla.toString());
                formData.append('NumEndoso', datos.NumEndoso.toString());
                formData.append('FechaIdent', datos.FecInicer.toString());
                formData.append('file', fileToUpload, fileToUpload.name);

                this.http.post(`${this.url}/ArchivoBeneficiario`, formData).subscribe(data => {
                    resolve(data);
                }, err => {
                    console.log(err);
                });

            }
        });
    }

    downloadFile(info: string, Tipo: string): Observable<Blob> {
        var datos = { direccion: info };
        const requestOptions: Object = {
            responseType: 'blob',
            params: datos
        }
        return this.http.get<Blob>(this.url + "/descarga", requestOptions).pipe(map(
            (res) => {
                const blob = new Blob([res], { type: Tipo });
                return blob;
            },
            err => {//
                console.log(err)
            }));
    }

}
