import { Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { TraspasoPolizaService } from '../../../providers/traspaso-poliza.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import Swal from 'sweetalert2';
import { LoginService } from 'src/providers/login.service';
import { DecimalPipe } from '@angular/common';
declare function llenaTabla(results: any): any;
declare function Mandardatos(): any;
declare function deleteTable(): any;
declare function pasarDerecha(): any;
declare function pasarIzquierda(): any;
declare function validate(): any;
declare function validateAllIzq(): any;
declare function validateAllDer(): any;
declare function pasarTodosDerecha(): any;
declare function pasarTodosIzquierda(): any;

@Component({
  selector: 'app-trasppolrecibidas-pagopensiones',
  templateUrl: './trasppolrecibidas-pagopensiones.component.html',
  styleUrls: ['./trasppolrecibidas-pagopensiones.component.css'],
})
export class TrasppolrecibidasPagopensionesComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  public fechatraspaso: string;
  validate: boolean;
  validateAll: boolean;
  results: any;
  consultas: any;
  datos: any = [];
  formFechaActual: FormGroup;
  constructor(
              private fb: FormBuilder,
              public titleService: Title,
              private apiService: TraspasoPolizaService,
              private serviceLog: LoginService,
              private cdRef: ChangeDetectorRef,
              private _decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
    this.formValidaFecha();
    this.formFechaActual.controls.inpNCotizacion.disable();
    Globales.titlePag = 'Traspaso de Pólizas Recibidas a Pago de Pensiones';
    this.titleService.setTitle(Globales.titlePag);
  }

  ngAfterViewInit() {
    this.obtenerFechas();
    this.obtenerConsultaFechas();
  }

  ngAfterViewChecked() {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  formValidaFecha() {
    this.formFechaActual = this.fb.group({
      inpNCotizacion: [''],
    });
  }

  obtenerFechas() {
    // tslint:disable-next-line:variable-name
    this.apiService.getFechaactual().then((any) => {
        this.results = any;
        this.fechatraspaso = this.results.Fecha;
      })
      .catch(() => {
        console.log('Ocurrio un error');
      });
  }

  obtenerConsultaFechas() {
    // tslint:disable-next-line:variable-name
    this.apiService.getConsultaPolizas().then((any:any) => {
        for (let i = 0; i < any.length; i++) {
          any[i].fecTraspaso = any[i].fecTraspaso.substring(6,8)+"/"+any[i].fecTraspaso.substring(4,6)+"/"+any[i].fecTraspaso.substring(0,4)
          any[i].mtoPriRec = this._decimalPipe.transform(any[i].mtoPriRec, '1.2-2')
        }
        this.consultas = any;
        llenaTabla(this.consultas);
      })
      .catch(() => {
        console.log('Ocurrio un error');
      });
  }

  limpiarPolizas() {
    deleteTable();
    // tslint:disable-next-line:align
    llenaTabla(this.consultas);
  }

  guardarDatos() {
    Swal.fire({
      title: '¿Desea guardar cambios?',
      text: 'Los cambios se guardarán',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.datos = Mandardatos();
        for (let i = 0; i < this.datos.length; i++) {
          this.datos[i].fecTraspaso = this.datos[i].fecTraspaso.split("/").reverse().join('')
          this.datos[i].mtoPriRec = this.datos[i].mtoPriRec.replace(",","");
          this.datos[i].Usuario = localStorage.getItem('currentUser');

        }
        this.apiService
          .mandarDatosTraspaso(this.datos)
          .then((data) => {
            deleteTable();
            this.obtenerConsultaFechas();
            Swal.fire(
              'Guardado',
              'Se realizó el traspaso de pólizas al módulo de pago de pensiones.',
              'success'
            );
          })
          .catch(() => {
            Swal.fire('Error', 'Ocurrio un error en el sistema ', 'error');
          });
      }
    });
  }

  pasaderecha() {
    this.validate = validate();
    if (this.validate === false) {
      Swal.fire('Error', 'Debe seleccionar una póliza.', 'error');
    } else {
      pasarDerecha();
    }
  }

  pasaizquierda() {
    this.validate = validate();
    if (this.validate === false) {
      Swal.fire('Error', 'Debe seleccionar una póliza.', 'error');
    } else {
      pasarIzquierda();
    }
  }

  pasartododerecha() {
    this.validateAll = validateAllIzq();
    if (this.validateAll === false) {
      Swal.fire('Error', 'No hay más pólizas para traspasar.', 'error');
    } else {
      pasarTodosDerecha();
    }
  }

  pasartodoizquierda() {
    this.validateAll = validateAllDer();
    if (this.validateAll === false) {
      Swal.fire('Error', 'No hay más pólizas para traspasar.', 'error');
    } else {
      pasarTodosIzquierda();
    }
  }
}
