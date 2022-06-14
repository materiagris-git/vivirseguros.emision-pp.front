import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AppConsts } from 'src/app/AppConst';
import { BusquedaGeneralPoliza } from 'src/interfaces/busquedaGeneralPoliza.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Globales } from 'src/interfaces/globales';
import Swal from 'sweetalert2';
import { MantenedorPagosTercerosGSService } from 'src/providers/mantenedor-pagostercerosgs.service';
import { LoginService } from 'src/providers/login.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-consulta-pagosterceros-gs',
  templateUrl: './consulta-pagosterceros-gs.component.html',
  styleUrls: ['./consulta-pagosterceros-gs.component.css']
})
export class ConsultaPagostercerosGsComponent implements OnInit, AfterViewInit {

  private urlCombo = AppConsts.baseUrl + 'mantenedorprepolizas';

  dataBusqueda: BusquedaGeneralPoliza = {
    NumeroPoliza: '',
    CUSPP: '',
    TipoDocumento: 0,
    NumeroDocumento: '',
    GlsTipoDocumento: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    PrimerNombre: '',
    SegundoNombre: '',
    NumeroEndoso: 0,
    GlsParentesco: '',
    Mensaje: '',
    NumOrden: 0
  };

  dataBusquedaRes: BusquedaGeneralPoliza[] = [];

  columnas = [];
  public cmbTipoDoc: any[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private http: HttpClient,
              private router: Router,
              private pagosTercerosGSService: MantenedorPagosTercerosGSService,
              private serviceLog: LoginService,
              private cdRef: ChangeDetectorRef,
              public titleService: Title
              ) {
    this.columnas = ['item', 'numPol', 'numEndoso', 'nomAfiliado', 'fecha', 'acciones'];

    this.http.get<any>(this.urlCombo + '/CmbIde').subscribe(result => {
      this.cmbTipoDoc = result;
    }, error => console.error(error));
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Consulta Mantención de Pagos a Terceros - Gastos Sepelio';
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

  polizaSeleccionada(poliza: BusquedaGeneralPoliza) {
    // console.log(poliza);
    // console.log(poliza.NumeroPoliza);
    Globales.datosGastosSepelio = poliza;
    // this._router.navigate(['/mantenedorPrepolizas/', ]);
  }

  // Selección de combo Tipo de Documento.
  cambiarTipoDoc() {
    this.dataBusqueda.TipoDocumento = Number(this.dataBusqueda.TipoDocumento);
  }

  buscarData() {
    this.pagosTercerosGSService.getBusquedaPolizas(this.dataBusqueda)
      .then( (resp: any) => {
        if (resp[0].Mensaje !== 'EXITOSO') {
          this.mostrarAlertaError('ERROR', resp[0].Mensaje);
          return;
        } else {
          if (resp[0].NumeroPoliza !== null) {
            this.dataBusquedaRes = resp;
            this.dataSource = new MatTableDataSource(resp);
            this.dataSource.paginator = this.paginator;
          } else {
            Swal.fire('Aviso', 'No existen pólizas para mostrar.', 'info');
            return;
          }
        }
      });
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

  soloLetras(e): boolean {
    const key = e.keyCode || e.which;
    const tecla = String.fromCharCode(key).toLowerCase();
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
  limpiar(){
    this.dataBusqueda = {
      NumeroPoliza: '',
      CUSPP: '',
      TipoDocumento: 0,
      NumeroDocumento: '',
      GlsTipoDocumento: '',
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      PrimerNombre: '',
      SegundoNombre: '',
      NumeroEndoso: 0,
      GlsParentesco: '',
      Mensaje: '',
      NumOrden: 0
    };
    this.dataSource = new  MatTableDataSource([]);
  }

}
