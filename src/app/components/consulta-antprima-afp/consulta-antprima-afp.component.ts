import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import Swal from 'sweetalert2';
import { ConsultaPrePolizas } from 'src/interfaces/mantenedorprepolizas.model';
import { AntecedentesPrimaAfp, Ubigeo } from 'src/interfaces/antecedentesprima-afp.model';
import { AntecedentesprimaAfpService } from 'src/providers/antecedentesprima-afp.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import { PolizaAntecedentesPensionadosService } from 'src/providers/poliza-antecedentes-pensionados.service';
import { MantenedorPrepolizasService } from 'src/providers/mantenedorPrePolizas.service';

@Component({
  selector: 'app-consulta-antprima-afp',
  templateUrl: './consulta-antprima-afp.component.html',
  styleUrls: ['./consulta-antprima-afp.component.css']
})
export class ConsultaAntprimaAfpComponent implements OnInit, AfterViewInit, AfterViewChecked {

  Departamento2 = '';
  Provincia2 = "";
  Distrito2 = 0;
  dep2 = '';
  prov2 = '';
  dis2 = '';
  direccionStr2 = '';
  public cmbDepartamento2: any[];
  public cmbProvincia2: any[];
  public cmbDistrito2: any[];
  public cmbDistritoAll2: any[];
  comboDistrito2Resp = [];

  dataBusqueda: ConsultaPrePolizas = {
    TipoBusqueda: '',
    NumPoliza: '',
    TipoDocumento: 0,
    NumDocumento: '',
    CUSPP: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    PrimerNombre: '',
    SegundoNombre: ''
  };
  columnas = [];

  checkAFP = true;

  dataPolizaSeleccionada: AntecedentesPrimaAfp;
  dataPolizas: AntecedentesPrimaAfp[] = [];
  dataUbigeo: Ubigeo = new Ubigeo();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private antPrimaAFPServvice: AntecedentesprimaAfpService,
              private _polizaAntPenService: PolizaAntecedentesPensionadosService,
              private mantenedorPrepolizasService: MantenedorPrepolizasService,
              public titleService: Title,
              private router: Router, 
              private serviceLog:LoginService,
              private cdRef:ChangeDetectorRef) {
    this.columnas = ['item', 'numPol', 'nomAfiliado', 'fecha', 'acciones'];

    this._polizaAntPenService.getComboDepartamento().then((resp: any) => {
      this.cmbDepartamento2 = resp;
    });

    this.mantenedorPrepolizasService.getComboDistritoAll().then((resp: any) => {
      this.cmbDistritoAll2 = resp;
      this.comboDistrito2Resp = this.cmbDistritoAll2.slice();
    });

    if (this.checkAFP) {
      this.antPrimaAFPServvice.getBusquedaAFPPolizas(this.dataBusqueda.NumPoliza)
        .then( (resp: any) => {
          if (resp[0].Mensaje !== 'EXITOSO') {
            this.mostrarAlertaError('ERROR', resp[0].Mensaje);
            return;
          } else {
            if (resp[0].NumPoliza !== null) {
              this.dataPolizas = resp;
              this.dataSource = new MatTableDataSource(resp);
              this.dataSource.paginator = this.paginator;
            } else {
              Swal.fire('Aviso', 'No existen pólizas para mostrar.', 'info');
              return;
            }
          }
        });
    }
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Generar Solicitud de Traspaso a AFP';
    this.titleService.setTitle(Globales.titlePag);
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = Globales.paginador.itemsPP;
    this.paginator._intl.firstPageLabel = Globales.paginador.primero;
    this.paginator._intl.lastPageLabel = Globales.paginador.ultima;
    this.paginator._intl.nextPageLabel = Globales.paginador.siguiente;
    this.paginator._intl.previousPageLabel = Globales.paginador.anterior;
    this.paginator._intl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return '0 de ' + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
      return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };

  }

  ngAfterViewChecked() {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  buscarData() {
    const element = document.getElementById('checkPolizas') as HTMLInputElement;
    if (!element.checked && this.dataBusqueda.NumPoliza === '') {
      this.mostrarAlertaError('ERROR', 'Debe ingresar el número de póliza o habilirar la opción de todas las pólizas.');
      return;
    } else {
      this.antPrimaAFPServvice.getBusquedaAFPPolizas(this.dataBusqueda.NumPoliza)
            .then( (resp: any) => {
              if (resp[0].Mensaje !== 'EXITOSO') {
                this.mostrarAlertaError('ERROR', resp[0].Mensaje);
                return;
              } else {
                if (resp[0].NumPoliza !== null) {
                  this.dataPolizas = resp;
                  this.dataSource = new MatTableDataSource(resp);
                  this.dataSource.paginator = this.paginator;
                } else {
                  Swal.fire('Aviso', 'No existen pólizas para mostrar.', 'info');
                  return;
                }
              }
            });
    }
  }

  polizaSeleccionada(poliza: AntecedentesPrimaAfp) {
    this.dataPolizaSeleccionada = poliza;
    this.router.navigate(['/antecedentesPrimaAfp/', this.dataPolizaSeleccionada.NumPoliza]);
  }

  // Validaciones de campos(números, letras, etc.).
  // Validación input solo numeros.
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Alertas de confirmación o error.
  mostrarAlertaExitosa(pTitle: string, pText: string) {
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'success',
      allowOutsideClick: false
    });
  }

  mostrarAlertaError(pTitle: string, pText: string) {
    Swal.fire({
      title: pTitle,
      text: pText,
      icon: 'error',
      allowOutsideClick: false
    });
  }

  //INICIO DE METODOS PARA UBIGEO

  onChangeLlenaProvinciaCorresp() {
    this._polizaAntPenService.getComboProvincia(this.Departamento2).then((resp: any) => {
      this.cmbProvincia2 = resp;
    });
    this.dataUbigeo.COD_UBIGEOCORRESP = 0;
  }

  onChangeLlenaDistritoCorresp() {
    this.mantenedorPrepolizasService.getComboDistrito(this.Provincia2).then((resp: any) => {
      this.cmbDistrito2 = resp;
      this.dataUbigeo.COD_UBIGEOCORRESP = this.cmbDistrito2[0].CodDireccion;
      this.ubigeoCorres();
    });
  }

  ubigeoCorres() {
    if (this.dataUbigeo.COD_UBIGEOCORRESP !== 0) {
      for (const i in this.cmbDepartamento2) {
        if (this.Departamento2 === this.cmbDepartamento2[i].codigo) {
          this.dep2 = this.cmbDepartamento2[i].descripcion;
        }
      }
      for (const i in this.cmbProvincia2) {
        if (this.Provincia2 === this.cmbProvincia2[i].codigo) {
          this.prov2 = this.cmbProvincia2[i].descripcion;
        }
      }
      // tslint:disable-next-line:forin
      for (const i in this.cmbDistritoAll2) {
        const var1 = Number(this.dataUbigeo.COD_UBIGEOCORRESP);
        const var2 = Number(this.cmbDistritoAll2[i].CodDireccion);
        if (var1 === var2) {
          const slip = this.cmbDistritoAll2[i].GlsDistrito;
          this.dis2 = slip.split(' - ', 1);
        }
      }
      this.direccionStr2 = this.dep2 + '-' + this.prov2 + '-' + this.dis2;
    } else {
      this.direccionStr2 = '';
    }
  }

  getInfo2(codDir) {
    
    this.dataUbigeo.COD_UBIGEOCORRESP = codDir;

    this.mantenedorPrepolizasService.getComboProvinciaAll(codDir).then((resp: any) => {
      const listaLlenado = [];
      for (const i in resp) {
        if (resp.length > 0) {
          const object = {
            codigo: resp[i].CodProvincia,
            descripcion: resp[i].GlsProvincia
          };
          listaLlenado.push(object);
        }
      }
      this.cmbProvincia2 = listaLlenado;
    });

    if (codDir !== 0) {
      this.mantenedorPrepolizasService.getProvinciaUnica(codDir).then((resp: any) => {
        if (resp.length > 0) {
          const var1 = resp[0].CodProvincia;
          this.Provincia2 = var1;
          this.Departamento2 = resp[0].CodRegion.toString();
          this.ubigeoCorres();
        }
      });
    } else {
      this.direccionStr2 = '';
      this.Departamento2 = "";
      this.Provincia2 = "";
      this.dataUbigeo.COD_UBIGEOCORRESP = 0;
    }
  }

  ubigeoCorrespondenciaModal(numPoliza){
    this.antPrimaAFPServvice.getUbigeoCorresp(numPoliza).then((resp:any) => {
      this.dataUbigeo = resp;
      if(this.dataUbigeo.TipPension == '08')
      {
        Swal.fire({
          title: 'La póliza a modificar corresponde a una sobrevivencia',
          text: '¿Desea modificar la informacion de los beneficiarios?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.value) {
            Swal.close();
            this.cerrarModalUbigeo();
            this.router.navigate(['/mantenedorPrepolizas/P/', numPoliza,'1']);
            
          }
          else{this.cerrarModalUbigeo();}
        });
      }
      else{
      this.getInfo2(this.dataUbigeo.COD_UBIGEOCORRESP);
      }
    });
  }

  actualizarUbigeo(){
    var valido = true;
    if (this.Departamento2 == null && this.Departamento2 == "" && 
    this.Provincia2 == null && this.Provincia2 == "" && 
    this.dataUbigeo.COD_UBIGEOCORRESP == null && this.dataUbigeo.COD_UBIGEOCORRESP == 0 &&
    this.dataUbigeo.GLS_DIRECCIONCORRESP == null && this.dataUbigeo.GLS_DIRECCIONCORRESP == "" &&
    this.dataUbigeo.GlsCorreo == null && this.dataUbigeo.GlsCorreo == "" &&
    this.dataUbigeo.GlsCorreo2 == null &&this.dataUbigeo.GlsCorreo2 == "" &&
    this.dataUbigeo.GlsCorreo3 == null && this.dataUbigeo.GlsCorreo3 == "" && 
    this.dataUbigeo.GlsFono == null && this.dataUbigeo.GlsFono == "" &&
    this.dataUbigeo.GlsFono2 == null && this.dataUbigeo.GlsFono2 == "" &&
    this.dataUbigeo.GlsFono3 == null && this.dataUbigeo.GlsFono3 == "" ){
    Swal.fire({title: 'Advertencia',text: 'Tiene que ser actualizado al menos un campo.' , icon: 'warning', allowOutsideClick: false});
    valido = false;
    }else{
      //valido = true;
      var valido = true;
      if (this.dataUbigeo.GlsCorreo !== '') {
        const valEmail = this.validar_email(this.dataUbigeo.GlsCorreo);
        if (!valEmail) {
          Swal.fire('Error', 'El correo electrónico 1 no tiene formato válido.', 'error');
          valido = false;
        }
      }
  
      if (this.dataUbigeo.GlsCorreo2 !== '') {
        const valEmail = this.validar_email(this.dataUbigeo.GlsCorreo2);
        if (!valEmail) {
          Swal.fire('Error', 'El correo electrónico 2 no tiene formato válido.', 'error');
          valido = false;
        }
      }
  
      if (this.dataUbigeo.GlsCorreo3 !== '') {
        const valEmail = this.validar_email(this.dataUbigeo.GlsCorreo3);
        if (!valEmail) {
          Swal.fire('Error', 'El correo electrónico 3 no tiene formato válido.', 'error');
          valido = false;
        }
      }
  
     // var valido = true;
      if (this.dataUbigeo.GlsFono3 !== '') {
        if (this.dataUbigeo.GlsFono3.length < 7) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.dataUbigeo.GlsFono3.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 3 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }
  
      if (this.dataUbigeo.GlsFono2 !== '') {
        if (this.dataUbigeo.GlsFono2.length < 7) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.dataUbigeo.GlsFono2.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono 2 debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }
  
      if (this.dataUbigeo.GlsFono !== '') {
        if (this.dataUbigeo.GlsFono.length < 7) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener mínimo 7 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
        if (this.dataUbigeo.GlsFono.length > 9) {
          Swal.fire({ title: 'Advertencia', text: 'El teléfono debe tener máximo 9 caracteres.', icon: 'warning', allowOutsideClick: false });
          valido = false;
        }
      }
      if(valido == true){
        (<any>$('#modalDirCorr')).modal('hide');
        this.dataUbigeo.Usuario =  localStorage.getItem('currentUser');
        this.antPrimaAFPServvice.postUbigeoUpdate(this.dataUbigeo).then((resp:any) => {
          if(resp.result="EXITOSO."){
            Swal.fire({title: 'Éxito',text: 'La dirección de correspondencia ' + this.dataUbigeo.NUM_POLIZA + ' se ha actualizado correctamente.' , icon: 'success', allowOutsideClick: false});
          }else{
            Swal.fire({title: 'Error',text: 'La dirección de correspondencia fallo al actualizarce.' , icon: 'error', allowOutsideClick: false});
          }
        });
      }
    }
   
  }

  cerrarModalUbigeo() {
    (<any>$('#modalDirCorr')).modal('hide');
  }
  validar_email(email) {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }
  // FIN DE METODOS PARA UBIGEO

}
