import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';import { catalogosModel } from 'src/interfaces/catalogos.model';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { CatalogosService } from 'src/providers/catalogos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { VirtualTimeScheduler } from 'rxjs';


@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {
  public cmbCategorias: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  columnas = [];
  dataBusqueda: catalogosModel = new catalogosModel();
  dataRegistro: catalogosModel = new catalogosModel();
  slcCategoria = '';
  mydisabled = false;
  constructor(    public titleService: Title,
    private catalogoService: CatalogosService
    ) { 

    this.columnas = ['item', 'descripcion', 'monto', 'descripcionCorta', 'codigoAdicional', 'codigoSistema', 'estado', 'acciones'];

    this.catalogoService.getComboCategorias('SELECT_COMBOCATEGORIA', '').then((resp: any) => {
      this.cmbCategorias = resp;
    });

  }
  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    this.dataRegistro.IdUsuarioEncrypt = localStorage.getItem('currentUser');
    this.dataBusqueda.IdUsuarioEncrypt = localStorage.getItem('currentUser');
    Globales.titlePag = 'Catálogos';
    this.titleService.setTitle(Globales.titlePag);
    this.dataBusqueda.ClaveCategoria = '0';
    this.dataRegistro.Estado = 'S';
  }

  lettersOnly(event) {
    event = (event) ? event : event;
    var charCode = (event.charCode) ? event.charCode : ((event.keyCode) ? event.keyCode :
       ((event.which) ? event.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) &&
       (charCode < 97 || charCode > 122)) {
       return false;
    }
    return true;
  }
  onlyAlphaNumeric(event) {
    if ((event.which < 65 || event.which > 122) && (event.which < 48 || event.which > 57)) {
      event.preventDefault();
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberDecimal(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode === 47 || charCode > 57)) {
      return false;
    }
    return true;
  }

    // Limpiar campos de modal Registrar/Modificar tabla.
    limpiarModalRegistarModificarTabla() {
      this.dataBusqueda.CodigoTabla = '';
      this.dataBusqueda.Descripcion = '';
    }
    limpiarModalAgregarElementoNuevo() {
      this.dataRegistro.Descripcion = '';
      this.dataRegistro.DescripcionCorta = '';
      this.dataRegistro.CodigoAdicional = '';
      this.dataRegistro.Monto = '';
    }
  salirModalAgregarElementoNuevo() {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro que deseas salir?. Se cancelarán los cambios.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0090B2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        ($('#modalAgregarElementoNuevo') as any).modal('hide');
      }
    });
  }

  salirModalModificarElemento() {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro que deseas salir?. Se cancelarán los cambios.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0090B2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        ($('#modalModificarElemento') as any).modal('hide');
        this.LimpiarDataRegistro();
      }
    });
    
  }

  avisoModalAgregarNuevoElemento(){
    Swal.fire('Error', 'Debe seleccionar una categoría.', 'error');
    return;
  }

  salirModalRegistrarModificarTabla() {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro que deseas salir?. Se cancelarán los cambios.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0090B2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        ($('#modalRegistrarModificarTabla') as any).modal('hide');
      }
    });
  }

  salirModificarElemento() {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro que deseas salir?. Se cancelarán los cambios.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0090B2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        ($('#modalModificarElemento') as any).modal('hide');
        this.LimpiarDataRegistro();
      }
    });
  }

Limpiar(){
 this.dataBusqueda.ClaveCategoria = '0';
 this.consultar();
}

LimpiarDataRegistro(){
  this.dataRegistro.Descripcion = '';
  this.dataRegistro.DescripcionCorta = '';
  this.dataRegistro.CodigoAdicional = '';
  this.dataRegistro.Monto = '';
 }

consultar() {
  
  this.catalogoService.postConsultaGnral(this.dataBusqueda)
                           .then( (resp: any) => {
                            //console.log(resp)
                            this.dataRegistro.CodigoTabla = this.dataBusqueda.ClaveCategoria;

                            if (resp.length>0){
                              this.dataSource = new MatTableDataSource(resp);
                              this.dataSource.paginator = this.paginator;
                            }else{
                              this.dataSource = new MatTableDataSource([]);
                              this.dataSource.paginator = this.paginator;
                            }
                           });
}
RegistrarTabla() {
  if (this.dataBusqueda.ClaveCategoria == '' || this.dataBusqueda.Descripcion == '') {
    Swal.fire('Error', 'Debe ingresar toda la información necesaria.', 'error');
    return;
  }
  
  this.catalogoService.postRegistrarTabla(this.dataBusqueda)
                           .then( (resp: catalogosModel) => {
                            console.log(resp)
                            if (resp.Success == true){
                              ($('#modalRegistrarModificarTabla') as any).modal('hide');
                              this.limpiarModalRegistarModificarTabla();
                              this.catalogoService.getComboCategorias('SELECT_COMBOCATEGORIA', '').then((resp: any) => {
                                this.cmbCategorias = resp;
                              });
                              Swal.fire('', resp.Mensaje, 'success');
                              return;
                            }else{
                              Swal.fire('Error', resp.Mensaje, 'error');
                              return;
                            }

                           });
}

AgregarElementoNuevo() {
  if (this.dataRegistro.CodigoTabla == '' || this.dataRegistro.Descripcion == '' || this.dataRegistro.DescripcionCorta == '' || this.dataRegistro.CodigoAdicional == ''
      || this.dataRegistro.Monto == '' || this.dataRegistro.Estado == '') {
    Swal.fire('Error', 'Debe ingresar toda la información necesaria.', 'error');
    return;
  }

  this.catalogoService.postAgregarElemento(this.dataRegistro)
                           .then( (resp: catalogosModel) => {
                            this.consultar();
                            if (resp.Success == true){
                              this.limpiarModalAgregarElementoNuevo();
                              Swal.fire('', resp.Mensaje, 'success');
                              return;
                            }else{
                              Swal.fire('Error', resp.Mensaje, 'error');
                              return;
                            }
                           });
}
ObtenerDatosElementoSeleccionado(elemento){
  this.dataRegistro.Descripcion = elemento.Descripcion;
  this.dataRegistro.DescripcionCorta = elemento.DescripcionCorta;
  this.dataRegistro.CodigoAdicional = elemento.CodigoAdicional;
  this.dataRegistro.Monto = elemento.Monto;
}

ModficarElemento(){
  if (this.dataRegistro.CodigoTabla == '' || this.dataRegistro.Descripcion == '' || this.dataRegistro.DescripcionCorta == '' || this.dataRegistro.CodigoAdicional == ''
  || this.dataRegistro.Monto == '' || this.dataRegistro.Estado == '') {
Swal.fire('Error', 'Debe ingresar toda la información necesaria.', 'error');
return;
}

this.catalogoService.postModificarElemento(this.dataRegistro)
                       .then( (resp: catalogosModel) => {
                        this.consultar();
                        if (resp.Success == true){
                          Swal.fire('', resp.Mensaje, 'success');
                          return;
                        }else{
                          Swal.fire('Error', resp.Mensaje, 'error');
                          return;
                        }
                       });
}

CambiarEstado(elemento){
if(elemento.Estado == 'S'){
  this.dataRegistro.Estado = 'N'
}
if(elemento.Estado == 'N'){
  this.dataRegistro.Estado = 'S'
}
this.dataRegistro.DescripcionCorta = elemento.DescripcionCorta;

this.catalogoService.postCambiarEstado(this.dataRegistro)
                       .then( (resp: catalogosModel) => {
                        this.consultar();
                        if (resp.Success == true){
                          Swal.fire('', resp.Mensaje, 'success');
                          return;
                        }else{
                          Swal.fire('Error', resp.Mensaje, 'error');
                          return;
                        }
                       });
}

}