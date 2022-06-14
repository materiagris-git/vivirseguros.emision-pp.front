import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PagoTercerosService } from 'src/providers/pago-terceros.service';
import { Router } from '@angular/router';
import { Globales } from 'src/interfaces/globales';
import { InfoConsultado, CuotaMortuaria, PagoGarantizado } from 'src/interfaces/pago-terceros-model';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/providers/login.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pago-terceros',
  templateUrl: './pago-terceros.component.html',
  styleUrls: ['./pago-terceros.component.css']
})
export class PagoTercerosComponent implements OnInit {

  columnasCM = [];
  columnasPG = [];
  TipNumIdent = '';

  infoConsultado: InfoConsultado = new InfoConsultado();
  tblCuotaMortuaria: CuotaMortuaria = new CuotaMortuaria();
  tblPagoGarantizado: PagoGarantizado = new PagoGarantizado();

  constructor(private _pagoTerceroService: PagoTercerosService,
              private cdRef: ChangeDetectorRef,
              public titleService: Title,
              private router: Router,
              private serviceLog:LoginService) {
    this.columnasCM = ["NumPoliza", "NumEndoso", "TipoIdent", "Nombre", "Domicilio"];
    this.columnasPG = ["NumPoliza", "NumEndoso", "TipoIdent", "Nombre", "Domicilio"];
   }

  dsCuotaMortuaria: MatTableDataSource<any> = new MatTableDataSource(null);
  dsPagoGarantizado: MatTableDataSource<any> = new MatTableDataSource(null);

  ngOnInit() {
    Globales.titlePag = 'Consulta Pago Terceros';
    this.titleService.setTitle(Globales.titlePag);
    this.infoConsultado.NumPoliza = Globales.datosAntPensionados.NumPoliza;
    this.infoConsultado.NumEndoso = Globales.datosAntPensionados.NumEndoso;
    this.infoConsultado.Num_Orden = Globales.datosAntPensionados.NumOrden;

    this._pagoTerceroService.postCargaInfoPoliza(this.infoConsultado).then( (resp: any) => {
      this.infoConsultado.NumPoliza = resp.NumPoliza;
      this.infoConsultado.NumEndoso = resp.NumEndoso;
      this.infoConsultado.Documento = resp.Documento;
      this.infoConsultado.CUSPP = resp.CUSPP;
      this.infoConsultado.Titular = resp.Titular;
      this.TipNumIdent = resp.TipNumIdent;
    });

    this._pagoTerceroService.getInfoCuotaMortuaria(this.infoConsultado.NumPoliza).then( (resp:any) => {

      this.dsCuotaMortuaria = new MatTableDataSource(resp);

      this._pagoTerceroService.getInfoPagoGarantizado(this.infoConsultado.NumPoliza).then( (resp:any) => {

        this.dsPagoGarantizado = new MatTableDataSource(resp);
  
        if(this.dsPagoGarantizado.filteredData.length == 0 && this.dsCuotaMortuaria.filteredData.length == 0) {
          Swal.fire({title: 'Advertencia',text: 'No existe información de pagos para la póliza seleccionada.' , icon: 'warning', allowOutsideClick: false})
          .then(
            (result) => {
              this.router.navigate(['/busquedaPagoTerceros'])
            }
          )
        }
      });
    });

  }

  ngAfterViewInit(): void {
    if (Globales.datosAntPensionados.NumPoliza == "" && Globales.datosAntPensionados.NumEndoso == "" && Globales.datosAntPensionados.NumOrden == 0){
      this.router.navigate(['/busquedaPagoTerceros']);
    }
    this.cdRef.detectChanges();
  }
  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  exportar(){
    var archivo = "";
    var poliza = Globales.datosAntPensionados.NumPoliza;
    this._pagoTerceroService.getExportar(poliza)
    .then( (resp: any) => {
      archivo = resp.result;
      
      var blob = this._pagoTerceroService.downloadFile(archivo).subscribe(res=>{  
        saveAs(res,archivo);
      }, err=>{
      //this.titulo = "Error";
      //this.mensaje = "Ha ocurrido un error al descargar el archivo, intente nuevamente más tarde"
      //this.toastr.error(this.mensaje, this.titulo);
      //console.log(err)
    });


    });    
 
  }

}
