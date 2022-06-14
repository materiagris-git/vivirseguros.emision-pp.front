import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConsultaPrePolizas, MantenedorPrePolizas } from 'src/interfaces/mantenedorprepolizas.model';
import { MantenedorPrepolizasService } from 'src/providers/mantenedorPrePolizas.service';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-consulta-prepolizas',
  templateUrl: './consulta-prepolizas.component.html',
  styleUrls: ['./consulta-prepolizas.component.css']
})
export class ConsultaPrepolizasComponent implements OnInit, AfterViewInit {

  private url = AppConsts.baseUrl + 'mantenedorprepolizas';
  //private url = localStorage.getItem('url') + 'mantenedorprepolizas';
  TipoBusqueda = 'D';
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

  dataPolizaSeleccionada: MantenedorPrePolizas;

  dataPolizas: MantenedorPrePolizas[] = [];

  public cmbTipoDoc: any[];

  maxLengthNumDoc = '15';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private prePolizasService: MantenedorPrepolizasService,
              public titleService: Title,
              private http: HttpClient, private _router: Router, 
              private serviceLog: LoginService, private cdRef: ChangeDetectorRef) {
    this.columnas = ['item', 'tipoBusqueda', 'numPol', 'CUSPP', 'nomAfiliado','fecha', 'acciones'];
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Mantenedor de Pre-Póliza';
    this.titleService.setTitle(Globales.titlePag);
    // Combo Tipo de Documento.
    this.http.get<any>(this.url + '/CmbIde').subscribe(result => {
      this.cmbTipoDoc = result;
    }, error => console.error(error));
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
    if (!localStorage.getItem('currentUser')) {
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  // Botón Buscar
  buscarData() {
    const tipoDoc = Number(this.dataBusqueda.TipoDocumento);

    if (this.TipoBusqueda === 'D') {
      this.mostrarAlertaError('ERROR', 'Debe seleccionar un tipo de búsqueda.');
      return;
    }

    if (tipoDoc !== 0 && this.dataBusqueda.NumDocumento === '') {
      Swal.fire('Error', 'Debe ingresar el No. de documento.', 'error');
      return;
    }

    if ((tipoDoc === 1 || tipoDoc === 9) && (this.dataBusqueda.NumDocumento.length !== Number(this.maxLengthNumDoc))) {
      Swal.fire('Error', 'Debe ingresar la longitud exacta del tipo de documento seleccionado.', 'error');
      return;
    }

    this.dataBusqueda.TipoBusqueda = this.TipoBusqueda;
    if (this.TipoBusqueda === 'P') {
      this.prePolizasService.postBusquedaPrePol(this.dataBusqueda)
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
                this.dataSource = new MatTableDataSource([]);
                this.dataSource.paginator = this.paginator;
                Swal.fire('Aviso', 'No existen pólizas para mostrar.', 'info');
                return;
              }
            }
          });
    }

    if (this.TipoBusqueda === 'C') {
      this.prePolizasService.postBusquedaPreCot(this.dataBusqueda)
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
                this.dataSource = new MatTableDataSource([]);
                this.dataSource.paginator = this.paginator;
                Swal.fire('Aviso', 'No existen cotizaciones para mostrar.', 'info');
                return;
              }
            }
          });
    }
  }

  polizaSeleccionada(poliza: MantenedorPrePolizas) {
    this.dataPolizaSeleccionada = poliza;
    this._router.navigate(['/mantenedorPrepolizas/', this.TipoBusqueda, this.dataPolizaSeleccionada.NumPoliza,'0']);
  }

  // Selección de combo Tipo de Documento.
  cambiarTipoDoc() {
    const tipoDoc = Number(this.dataBusqueda.TipoDocumento);
    this.dataBusqueda.TipoDocumento = tipoDoc;
    this.dataBusqueda.NumDocumento = '';

    if (tipoDoc === 1) {
      this.maxLengthNumDoc = '8';
    }
    if (tipoDoc === 2 || tipoDoc === 5) {
      this.maxLengthNumDoc = '12';
    }
    if (tipoDoc === 9) {
      this.maxLengthNumDoc = '11';
    }
    if (tipoDoc === 3 || tipoDoc === 4 || (tipoDoc > 5 && tipoDoc < 9) || tipoDoc === 10) {
      this.maxLengthNumDoc = '15';
    }
  }

  // Limpiar campos de pantalla.
  limpiarFiltros() {
    this.TipoBusqueda = 'D';
    this.dataPolizas = null;
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataBusqueda  = {
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

  numberDecimal(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode === 47 || charCode === 48 || charCode > 57)) {
      return false;
    }
    return true;
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
}
