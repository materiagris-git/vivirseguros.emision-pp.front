import { Component, OnInit, Inject } from '@angular/core';
import { Globales } from 'src/interfaces/globales';
import { Title } from '@angular/platform-browser';
import { consultaCalendarioPagosModel } from 'src/interfaces/mantencion-calendario-pagos.model';
import { DOCUMENT } from '@angular/common';
import { mantenimientoGeneral } from 'src/interfaces/mantenimiento-general.model';
import { MantenimientoGeneralService } from 'src/providers/mantenimiento-general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenimiento-general',
  templateUrl: './mantenimiento-general.component.html',
  styleUrls: ['./mantenimiento-general.component.css']
})
export class MantenimientoGeneralComponent implements OnInit {

  mantenimientoIGVDisabled: boolean = true;
  impuestoRentaDisabled: boolean = true;
  capitalSocialDisabled: boolean = true;
  patrimonioDisabled: boolean = true;

  dataMantenimiento: mantenimientoGeneral = new mantenimientoGeneral();

  constructor(public titleService: Title,
              private mantenimientoGralService: MantenimientoGeneralService ) {

                this.mantenimientoGralService.postConsultaMantenimientoGnral()
                .then( (resp: any) => {
                 this.dataMantenimiento.IGV = resp.IGV;
                 this.dataMantenimiento.ImpuestoRenta = resp.ImpuestoRenta;
                 this.dataMantenimiento.CapitalSocial = resp.CapitalSocial;
                 this.dataMantenimiento.Patrimonio = resp.Patrimonio;
                 console.log(this.dataMantenimiento);
                });
   }

  ngOnInit() {
    Globales.titlePag = 'Mantenimiento General';
    this.titleService.setTitle(Globales.titlePag);
  }

  ActivarIGV(){
    this.mantenimientoIGVDisabled = false;
    this.impuestoRentaDisabled = true;
    this.capitalSocialDisabled = true;
    this.patrimonioDisabled = true;
  }
 ActivarImpuestoRenta(){
  this.mantenimientoIGVDisabled = true;
  this.impuestoRentaDisabled = false;
  this.capitalSocialDisabled = true;
  this.patrimonioDisabled = true;
  }  
  ActivarCapitalSocial(){
    this.mantenimientoIGVDisabled = true;
    this.impuestoRentaDisabled = true;
    this.capitalSocialDisabled = false;
    this.patrimonioDisabled = true;
  }  

  ActivarPatrimonio(){
    this.mantenimientoIGVDisabled = true;
    this.impuestoRentaDisabled = true;
    this.capitalSocialDisabled = true;
    this.patrimonioDisabled = false;
  }  

  numberDecimal(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode === 47 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ActualizarParametros() {
    if (this.dataMantenimiento.IGV == 0 || this.dataMantenimiento.ImpuestoRenta == 0 || this.dataMantenimiento.CapitalSocial == 0 || this.dataMantenimiento.Patrimonio == 0) {
      Swal.fire('Error', 'Favor de ingresar todos los parametros.', 'error');
      return;
    }
    else{
    this.mantenimientoGralService.postActualizarParametros(this.dataMantenimiento)
                             .then( (resp: mantenimientoGeneral) => {
                              if (resp != null){
                                Swal.fire('Aviso', 'Los valores han sido actualizados exitosamente', 'success').then(function() {
                                  window.location.reload();
                                });;
                                return;
                              }else{
                                Swal.fire('Error', 'Ha sucedido un error al actualizar los valores', 'error');
                                return;
                              }
                             });      
                            }        
  }

  RecargarPagina (){
    window.location.reload();
  }
}
