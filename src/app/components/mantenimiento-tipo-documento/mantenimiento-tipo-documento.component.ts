import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from 'src/providers/login.service';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MantenimientoTipoDocumento } from '../../../interfaces/mantenimiento-tipo-documento.model';
import { MantenimientoTipoDocService } from 'src/providers/mantenimiento-tipo-doc.service';
import * as $AB from 'jquery';
import Swal from 'sweetalert2';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-mantenimiento-tipo-documento',
  templateUrl: './mantenimiento-tipo-documento.component.html',
  styleUrls: ['./mantenimiento-tipo-documento.component.css']
})
export class MantenimientoTipoDocumentoComponent implements OnInit {

  private url = AppConsts.baseUrl + 'MantenimientoTipoDoc';
  
  //Variables de Tipo de Documento Principal.
  public cmbTipoDoc: any[];
  codTipoDocumento = 999;
  txtCodTipoDoc = '';
  columnas = [];

  datosDocumentos: MantenimientoTipoDocumento[] = [];
  rowDocumento: MantenimientoTipoDocumento;
  rowDocRespaldo: MantenimientoTipoDocumento;
  datosNuevoDocumento: MantenimientoTipoDocumento = new MantenimientoTipoDocumento();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private serviceLog: LoginService, 
              private cdRef: ChangeDetectorRef,
              public titleService: Title,
              private serviceMantenimiento: MantenimientoTipoDocService) { 
    this.columnas = ['codigo', 'tipoDocumento', 'tipoDocAbreviado', 'cantidadCaracteres','estado', 'acciones'];
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Mantenimiento Tipo de Documento';
    this.titleService.setTitle(Globales.titlePag);

    //Línea para llenar combo al iniciar la pantalla.
    this.buscarTipoDocumento();
  }
  
  ngAfterViewChecked() {
    if (!localStorage.getItem('currentUser')) {
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
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

  // Función para obtener los tipos de documento del combo de búsqueda.
  buscarTipoDocumento() {
    this.serviceMantenimiento.getBuscarTipoDocumento().then((result: any) => {
      this.cmbTipoDoc = result;
    });
  }

  // Función para realizar la búsqueda de un Tipo de Documento.
  buscarDocumento() {
    if (Number(this.codTipoDocumento) === 0 || Number(this.codTipoDocumento) === 999) {
      Swal.fire('Advertencia', `Favor de elegir un Tipo de Documento o Ingresar un Código para la búsqueda.`, 'warning');
      return;
    }

    this.serviceMantenimiento.postBuscarDocumento(this.codTipoDocumento, this.txtCodTipoDoc).then((result: any) => {
      if (result.length === 0) {
        Swal.fire('Error', `No se encontró ningún documento.`, 'error');
        this.dataSource = new MatTableDataSource([]);
        return;
      } else {
        this.datosDocumentos = result;
        this.dataSource = new MatTableDataSource(result);
      }
    });
  }

  // Función para habilitar los campos en la tabla para editar la información.
  editarInfo(datosTipoDoc: MantenimientoTipoDocumento) {
    datosTipoDoc.Editar = !datosTipoDoc.Editar;
    this.rowDocRespaldo = Object.assign({}, datosTipoDoc);
    this.rowDocumento = datosTipoDoc;
  }

  // Función para Guardar los cambios de los Tipos de Documento(Actualizar).
  GuardarInfo(datosTipoDoc: MantenimientoTipoDocumento) {
    if (datosTipoDoc.TipoDocNombre.trim() === '') {
      Swal.fire('Advertencia', `Ingrese un Nombre del Tipo de Documento.`, 'warning');
      return;
    }

    if (datosTipoDoc.TipoDocAbreviatura.trim() === '') {
      Swal.fire('Advertencia', `Ingrese una Abreviatura para el Tipo de Documento.`, 'warning');
      return;
    }

    if (Number(datosTipoDoc.NumeroCaracteres) === 0) {
      Swal.fire('Advertencia', `Ingrese un Número de caracteres mayor a cero.`, 'warning');
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro que desea guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0090B2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        datosTipoDoc.Editar = !datosTipoDoc.Editar;
        this.serviceMantenimiento.postActualizarDocumento(datosTipoDoc).then((result: any) => {
          if (result.mensaje === "EXITOSO.") {
            Swal.fire('Aviso', `Se han actualizado los datos correctamente.`, 'success');
          } else {
            Swal.fire('Error', `Los datos no se actualizaron correctamente.`, 'error');
            return;
          }
        });
      }
    });
    
  }

  // Función para Abrir el modal de Nuevo Tipo de Documento y generar el Nuevo Código.
  abrirModalNuevoDocumento() {
    this.datosNuevoDocumento = new MantenimientoTipoDocumento();
    this.serviceMantenimiento.postGenerarCodigoNuevoDoc(this.datosNuevoDocumento).then((result: any) => {
      this.datosNuevoDocumento.Codigo = result.codigo;
    });

    (<any>$('#modalNuevoTipoDoc')).modal('show');
  }

  // Función para Insertar el Nuevo Tipo de Documento.
  guardarNuevoDoc() {
    if (this.datosNuevoDocumento.TipoDocNombre.trim() === '') {
      Swal.fire('Advertencia', `Ingrese un Nombre del Tipo de Documento.`, 'warning');
      return;
    }

    if (this.datosNuevoDocumento.TipoDocAbreviatura.trim() === '') {
      Swal.fire('Advertencia', `Ingrese una Abreviatura para el Tipo de Documento.`, 'warning');
      return;
    }

    if (Number(this.datosNuevoDocumento.NumeroCaracteres) === 0) {
      Swal.fire('Advertencia', `Ingrese un Número de caracteres mayor a cero.`, 'warning');
      return;
    }

    if (this.datosNuevoDocumento.Estado === '') {
      Swal.fire('Advertencia', `Seleccione un Estado para el Tipo de Documento.`, 'warning');
      return;
    }

    Swal.fire({
      title: 'Confirmación',
      text: '¿Seguro que desea insertar el nuevo documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0090B2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.serviceMantenimiento.postInsertarNuevoDoc(this.datosNuevoDocumento).then((result: any) => {
          if (result.mensaje === "EXITOSO.") {
            Swal.fire('Aviso', `Se han insertado los datos correctamente.`, 'success');
            this.buscarTipoDocumento();
            this.datosNuevoDocumento = new MantenimientoTipoDocumento();
            (<any>$('#modalNuevoTipoDoc')).modal('hide');
          } else {
            Swal.fire('Error', `Los datos no se insertaron correctamente.`, 'error');
            return;
          }
        });
      }
    });
  }

  // Función para cancelar los cambios y regresar los datos a como estaban.
  cancelarEdicion(datosTipoDoc: MantenimientoTipoDocumento) {
    const index = this.datosDocumentos.indexOf(this.datosDocumentos.find(x => x.Codigo === this.rowDocRespaldo.Codigo));
    this.rowDocRespaldo.Editar = false;
    this.datosDocumentos[index] = this.rowDocRespaldo;
    this.dataSource = new MatTableDataSource(this.datosDocumentos);
  }

  // Función para Cancelar la Creación de un Nuevo Tipo de Documento.
  cancelarNuevoDoc() {
    this.datosNuevoDocumento = new MantenimientoTipoDocumento();
    (<any>$('#modalNuevoTipoDoc')).modal('hide');
  }

  // Función para limpiar los datos de la pantalla.
  limpiar() {
    this.codTipoDocumento = 999
    this.txtCodTipoDoc = '';
    this.dataSource = new MatTableDataSource([]);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
