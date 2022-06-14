import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import * as $AB from 'jquery';
import Swal from 'sweetalert2';
import { MantenimientoUbigeoService } from '../../../providers/mantenimiento-ubigeo.service';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-mantenimiento-ubigeo',
  templateUrl: './mantenimiento-ubigeo.component.html',
  styleUrls: ['./mantenimiento-ubigeo.component.css']
})
export class MantenimientoUbigeoComponent implements OnInit {

  // Variable para peticiones a la API.
  private url = AppConsts.baseUrl + 'MantenimientoUbigeo';
  
  // Variable para Grupo de RadioButtons.
  opcionCombos = 'Departamento';

  // Variables para combos.
  public cmbDepartamentos: any[];
  public cmbProvincias: any[];
  public cmbProvinciasAll: any[];
  // public cmbDistritos: any[];
  public cmbDistritosAll: any[];
  comboDistritoResp = [];
  comboProvinciasResp = [];
  CodDepartamento = '';
  CodProvincia = '';
  CodDistrito = '';  

  // Variables de combos para Registros Nuevos.
  public cmbDeptoNuevoReg: any[];
  public cmbProviNuevoReg: any[];
  CodDeptoNuevoReg = '';
  CodProviNuevoReg = '';

  // Variables de combos para Actualizar Elementos.
  public cmbDeptoActualizar: any[];
  public cmbProviActualizar: any[];
  CodDeptoActualizar = '';
  CodProviActualizar = '';

  // Variables.
  CodigoNuevoRegistro = '';
  NombreNuevoRegistro = '';

  constructor(public titleService: Title, 
              private http: HttpClient,
              private serviceMantenimiento: MantenimientoUbigeoService, 
              private serviceLog: LoginService, 
              private cdRef: ChangeDetectorRef) { }

  // Función que se ejecuta al iniciar la pantlala.
  async ngOnInit() {
    Globales.titlePag = 'Mantenimiento Ubigeo';
    this.titleService.setTitle(Globales.titlePag);
    
    this.consultarDepartamentos();
  }

  ngAfterViewChecked() {
    if (!localStorage.getItem('currentUser')) {
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  // Función para consultar departamentos de la pantalla principal.
  async consultarDepartamentos() {
    this.http.get<any>(this.url + '/ConsultarDepartementos').subscribe(result => {
      this.cmbDepartamentos = result;
      this.cmbDeptoNuevoReg = result;
      this.CodProvincia = '';
    }, error => console.error(error));
    this.cmbDistritosAll = await this.http.get<any[]>(this.url + '/CmbDistritoAll').toPromise();
    this.comboDistritoResp = this.cmbDistritosAll.slice();

    this.cmbProvinciasAll = await this.http.get<any[]>(this.url + '/CmbProvinciaAll').toPromise();
    this.comboProvinciasResp = this.cmbProvinciasAll.slice();
  }

  // Modal para mostrar modal de Nuevos Registros.
  mostrarModalRegistroNuevo() {
    if (this.opcionCombos === 'Departamento') {
      this.serviceMantenimiento.postGeneraCodigoNuevo(this.opcionCombos, '', '').then((result: any) => {
        this.CodigoNuevoRegistro = result.codigo;
      });;
    }

    (<any>$('#modalNuevosRegistros')).modal('show');
  }

  // Función para buscar las Provincias tanto de la pantalla principal como del modal de Nuevos Registros.
  async buscarProvincia(bandera: string, banderaAux: string) {
    let codDepto = bandera !== 'Nuevo' ? this.CodDepartamento : this.CodDeptoNuevoReg;

    if (bandera !== 'Nuevo') {
      //this.cmbProvincias = await this.http.get<any[]>(this.url + '/ConsultarProvincias?pCodDepartamento=' + codDepto).toPromise();
      this.comboProvinciasResp = await this.http.get<any[]>(this.url + '/ConsultarProvincias?pCodDepartamento=' + codDepto).toPromise();
      this.CodProvincia = (banderaAux === 'DistritosAll' ? this.CodProvincia : '');
    } else {

      if (banderaAux === 'Provincia' && this.opcionCombos === 'Provincia') {
        this.serviceMantenimiento.postGeneraCodigoNuevo(this.opcionCombos, codDepto, '').then((result: any) => {
          this.CodigoNuevoRegistro = result.codigo;
        });
      } else {
        if (banderaAux === 'Provincia' && this.opcionCombos === 'Distrito') {
          this.http.get<any[]>(this.url + '/ConsultarProvincias?pCodDepartamento=' + codDepto).subscribe(result => {
            this.cmbProviNuevoReg = result;
            this.CodProviNuevoReg = '';
          }, error => console.error(error));
        }
      }
      
    } 
  }

  // Función para buscar los Distritos tanto de la pantalla principal como del modal de Nuevos Registros.
  async buscarDistrito(bandera: string) {
    let codProv = bandera !== 'Nuevo' ? this.CodProvincia : this.CodProviNuevoReg;

    if (bandera !== 'Nuevo') {
      //this.cmbDistritos = await this.http.get<any[]>(this.url + '/ConsultarDistritos?pCodProvincia=' + this.CodProvincia).toPromise();
      this.comboDistritoResp = await this.http.get<any[]>(this.url + '/ConsultarDistritos?pCodProvincia=' + this.CodProvincia).toPromise();
      this.CodDistrito = '';
    } else {
      this.serviceMantenimiento.postGeneraCodigoNuevo(this.opcionCombos, this.CodDeptoNuevoReg, codProv).then((result: any) => {
        this.CodigoNuevoRegistro = result.codigo;
      });
    }
    
  }

  // Función para cerral modal de Nuevos Registros.
  cerrarModalRegistroNuevo() {
    (<any>$('#modalNuevosRegistros')).modal('hide');
    this.cmbProviNuevoReg = [];
    this.CodProviNuevoReg = '';
    this.CodDeptoNuevoReg = '';
    this.CodigoNuevoRegistro = '';
    this.NombreNuevoRegistro = '';
  }

  // Función para Crear e Insertar un nuevo elemento.
  GuardarNuevoRegistro() {
    let strNombreUsuario = localStorage.getItem('currentUser');

    if (this.NombreNuevoRegistro.trim() === '') {
      Swal.fire('Advertencia', `Favor de ingresar un nombre para el/la ${this.opcionCombos}`, 'warning');
      return;
    }

    if ((this.opcionCombos === 'Provincia' || this.opcionCombos === 'Distrito') && this.CodDeptoNuevoReg.trim() === '') {
      Swal.fire('Advertencia', `Favor de seleccionar un Departamento para el/la ${this.opcionCombos}`, 'warning');
      return;
    }

    if (this.opcionCombos === 'Distrito' && this.CodProviNuevoReg.trim() === '') {
      Swal.fire('Advertencia', `Favor de seleccionar una Provincia para el/la ${this.opcionCombos}`, 'warning');
      return;
    }

    if (this.CodigoNuevoRegistro.trim() === '') {
      Swal.fire('Advertencia', `Aún no se genera el código para el/la ${this.opcionCombos}`, 'warning');
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro que desea crear este nuevo elemento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0090B2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.serviceMantenimiento.postInsertarNuevoElemento(this.opcionCombos, 
                                                            this.CodDeptoNuevoReg, 
                                                            this.CodProviNuevoReg, 
                                                            strNombreUsuario, 
                                                            this.NombreNuevoRegistro, 
                                                            this.CodigoNuevoRegistro).then((result: any) => {

          if (result.mensaje === 'Se ha registrado correctamente el nuevo elemento.') {
            Swal.fire('Aviso', result.mensaje, 'success');
            this.cmbProviNuevoReg = [];
            this.CodProviNuevoReg = '';
            this.CodDeptoNuevoReg = '';
            this.CodigoNuevoRegistro = '';
            this.NombreNuevoRegistro = '';
            (<any>$('#modalNuevosRegistros')).modal('hide');

            if (this.opcionCombos === 'Departamento') {
              this.consultarDepartamentos();
              this.CodDepartamento = '';
            }

            if (this.opcionCombos === 'Provincia') {
              this.buscarProvincia('', '');
              this.CodProvincia = '';
            }

            if (this.opcionCombos === 'Distrito') {
              this.buscarDistrito('');
              this.CodDistrito = '';
            }
            
          } else {
            Swal.fire('Error', result.mensaje, 'error');
            return;
          }
        });
      }
    });

  }

  // Función para mostrar el modal de Actualización de Elementos.
  async mostrarModalActualizar() {
    if (this.opcionCombos === 'Departamento' && this.CodDepartamento === '') {
      Swal.fire('Advertencia', `Seleccione un Departamento.`, 'warning');
      return;
    } else {
      if (this.opcionCombos === 'Departamento') {
        this.CodigoNuevoRegistro = this.CodDepartamento;
        this.NombreNuevoRegistro = this.cmbDepartamentos.find( depto => depto.COD_REGION === this.CodDepartamento ).GLS_REGION;
      }
    }

    if (this.opcionCombos === 'Provincia' && this.CodProvincia === '') {
      Swal.fire('Advertencia', `Seleccione una Provincia.`, 'warning');
      return;
    } else {
      if (this.opcionCombos === 'Provincia') {
        this.CodigoNuevoRegistro = this.CodProvincia;
        this.CodDeptoActualizar = this.CodDepartamento;
        this.cmbDeptoActualizar = this.cmbDepartamentos;
        this.NombreNuevoRegistro = this.cmbProvinciasAll.find( prov => prov.COD_PROVINCIA === this.CodProvincia ).GLS_PROVINCIA;
      }
    }

    if (this.opcionCombos === 'Distrito' && this.CodDistrito === '') {
      Swal.fire('Advertencia', `Seleccione un Distrito.`, 'warning');
      return;
    } else {
      if (this.opcionCombos === 'Distrito') {
        this.CodigoNuevoRegistro = this.cmbDistritosAll.find( dist => dist.COD_DIRECCION === Number(this.CodDistrito) ).COD_COMUNA;
        this.CodDeptoActualizar = this.CodDepartamento;
        this.CodProviActualizar = this.CodProvincia;
        this.cmbDeptoActualizar = this.cmbDepartamentos;
        this.cmbProviActualizar = await this.http.get<any[]>(this.url + '/ConsultarProvincias?pCodDepartamento=' + this.CodDepartamento).toPromise();// this.cmbProvinciasAll;
        this.NombreNuevoRegistro = this.cmbDistritosAll.find( dist => dist.COD_DIRECCION === Number(this.CodDistrito) ).GLS_COMUNA;
      }
    }

    (<any>$('#modalActualizar')).modal('show');
  }

  // Función para cerral modal de Actualización de Registros.
  cerrarModalActualizar() {
    (<any>$('#modalActualizar')).modal('hide');
    this.cmbDeptoActualizar = [];
    this.cmbProviActualizar = [];
    this.CodProviActualizar = '';
    this.CodDeptoActualizar = '';
    this.CodigoNuevoRegistro = '';
    this.NombreNuevoRegistro = '';
  }

  // Función para Actualizar Elementos.
  ActualizarRegistro() {
    let strNombreUsuario = localStorage.getItem('currentUser');

    if (this.NombreNuevoRegistro.trim() === '') {
      Swal.fire('Advertencia', `Favor de ingresar un nombre para el/la ${this.opcionCombos}`, 'warning');
      return;
    }

    if ((this.opcionCombos === 'Provincia' || this.opcionCombos === 'Distrito') && this.CodDeptoActualizar.trim() === '') {
      Swal.fire('Advertencia', `Favor de seleccionar un Departamento para el/la ${this.opcionCombos}`, 'warning');
      return;
    }

    if (this.opcionCombos === 'Distrito' && this.CodProviActualizar.trim() === '') {
      Swal.fire('Advertencia', `Favor de seleccionar una Provincia para el/la ${this.opcionCombos}`, 'warning');
      return;
    }

    if (this.CodigoNuevoRegistro.trim() === '') {
      Swal.fire('Advertencia', `Aún no se genera el código para el/la ${this.opcionCombos}`, 'warning');
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro que desea actualizar este elemento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0090B2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.serviceMantenimiento.postActualizarElemento(this.opcionCombos, 
                                                         this.CodDeptoActualizar, 
                                                         this.CodProviActualizar, 
                                                         strNombreUsuario, 
                                                         this.NombreNuevoRegistro, 
                                                         this.CodigoNuevoRegistro,
                                                         this.CodDepartamento,
                                                         this.CodProvincia,
                                                         Number(this.CodDistrito)).then((result: any) => {

          if (result.mensaje === 'Se ha actualizado correctamente el elemento.') {
            Swal.fire('Aviso', result.mensaje, 'success');
            this.cmbProviActualizar = [];
            this.CodProviActualizar = '';
            this.CodDeptoActualizar = '';
            this.CodigoNuevoRegistro = '';
            this.NombreNuevoRegistro = '';
            (<any>$('#modalActualizar')).modal('hide');

            if (this.opcionCombos === 'Departamento') {
              this.consultarDepartamentos();
              this.CodDepartamento = '';
            }

            if (this.opcionCombos === 'Provincia') {
              this.buscarProvincia('', '');
              this.CodProvincia = '';
            }

            if (this.opcionCombos === 'Distrito') {
              this.buscarDistrito('');
              this.CodDistrito = '';
            }
            
          } else {
            Swal.fire('Error', result.mensaje, 'error');
            return;
          }
        });
      }
    });
  }

  // Función para buscar Provincias de Modal para Actualizar.
  async buscarProviActualizar() {
    this.cmbProviActualizar = await this.http.get<any[]>(this.url + '/ConsultarProvincias?pCodDepartamento=' + this.CodDeptoActualizar).toPromise();
    this.CodProviActualizar = '';
  }

  // Función para llenar todos los combos seleccionando un Distrito.
  llenarCombosDist(valorDireccion) {
    this.CodDistrito = valorDireccion;
    this.CodDepartamento = this.cmbDistritosAll.find( dist => dist.COD_DIRECCION === valorDireccion ).COD_REGION;
    this.CodProvincia = this.cmbDistritosAll.find( dist => dist.COD_DIRECCION === valorDireccion ).COD_PROVINCIA;
    this.buscarProvincia('', 'DistritosAll');
  }

  // Función para llenar el combo de Departamento seleccionando una Provincia.
  llenarCombosProv(valorProvincia) {
    this.CodProvincia = valorProvincia;
    this.CodDepartamento = this.cmbProvinciasAll.find( prov => prov.COD_PROVINCIA === valorProvincia ).COD_REGION;
    this.buscarDistrito('');
  }

  soloLetras(e): boolean {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    const letras = 'áéíóúabcdefghijklmnñopqrstuvwxyz';
    const especiales = [8, 37, 39, 32];

    let tecla_especial = false;
    for (let i in especiales) {
        if (key === especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if ( (letras.indexOf(tecla) === -1) && (!tecla_especial) ) {
      return false;
    }
  }

}
