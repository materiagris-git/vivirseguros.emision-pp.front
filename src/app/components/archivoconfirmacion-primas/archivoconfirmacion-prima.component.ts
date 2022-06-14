import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import * as moment from 'moment';
import { ArchivoConfirmacionPrima, ArchivoConfirmacionPrimaXML} from 'src/interfaces/archivoconfirmacion-prima.model';
import { ArchivoconfirmacionPrimaService } from 'src/providers/archivoconfirmacion-prima.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import Swal from 'sweetalert2';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import { ConfirmacionPrimasXML } from 'src/providers/ConfirmacionPrimasXML.service';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-archivocontrable-primaunica',
  templateUrl: './archivoconfirmacion-prima.component.html',
  styleUrls: ['./archivoconfirmacion-prima.component.css']
})
export class ArchivoConfirmacionPrimasComponent implements OnInit, AfterViewChecked {

  frmArchConfPrim: FormGroup;
  fecInicio = "";
  fecFin = "";
  archConfPrimas: ArchivoConfirmacionPrima ={
    NumPoliza: 0,
    MtoPrima: 0,
    Usuario: "",
    Fecha: "",
    Hora: "",
    variableUsuario: "",
    NombreArchivo:"ArcConfirmacion"+moment().format('YYYYMMDD').toString(),
  }

  archConfPrimasXML: ArchivoConfirmacionPrimaXML;

  constructor(private fb: FormBuilder,
              private _archConfPrimaService: ArchivoconfirmacionPrimaService,
              public titleService: Title,
              private generarAchivoXMLService: ConfirmacionPrimasXML,
              private _serviceFecha: ServiciofechaService, 
              private serviceLog:LoginService, 
              private cdRef:ChangeDetectorRef) { }
              

  ngOnInit() {
    Globales.titlePag = 'Generación de Archivo de Confirmación de Primas';
    this.titleService.setTitle(Globales.titlePag);
    this.frmArchConfPrimas();

    this.fecInicio = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD');
    this.fecFin = moment(new Date()).format('YYYY-MM-DD');
    
    
  }

  ngAfterViewChecked() {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  get fecDesde() {
    return this.frmArchConfPrim.get('fecDesde').invalid && this.frmArchConfPrim.get('fecDesde').touched;
  }

  get fecHasta() {
    return this.frmArchConfPrim.get('fecHasta').invalid && this.frmArchConfPrim.get('fecHasta').touched;
  }

  frmArchConfPrimas() {
    this.frmArchConfPrim = this.fb.group({
      fecDesde: [, Validators.required],
      fecHasta: [, Validators.required],
      nTotalPol: [''],
      mTotalPrim: [''],
      usuarioCreacion: [''],
      fechaCreacion: [''],
      horaCreacion: ['']
    });
  }

  vaciarLista(){
    this.archConfPrimas = {
      NumPoliza: 0,
      MtoPrima: 0,
      FechaInicio: "",
      FechaFin: "",
      Usuario: "",
      Fecha: "",
      Hora: "",
      variableUsuario: "",
      NombreArchivo: "ArcConfirmacion"+moment().format('YYYYMMDD').toString(),
    }
  }

  consultarRecepcionPrimas() {
    this.vaciarLista();
    this.archConfPrimas.FechaInicio = this.fecInicio;
    this.archConfPrimas.FechaFin = this.fecFin;

    let fecD = (new Date(this.frmArchConfPrim.get('fecDesde').value));
    let fecH = (new Date(this.frmArchConfPrim.get('fecHasta').value));

    if (fecD.getFullYear() < 1900) {
      Swal.fire('Error de Datos', 'La Fecha ingresada es menor a la mínima que se puede ingresar (01/01/1900).', 'error');
      return;
    }

    if (fecD > fecH) {
      Swal.fire('Error de Datos', 'Fecha mínima incorrecta, es mayor a la Fecha máxima.', 'error');
      return;
    }

    if (Object.prototype.toString.call(fecD) === "[object Date]" || Object.prototype.toString.call(fecH) === "[object Date]") {
      if (isNaN(fecD.getTime()) || isNaN(fecH.getTime())) {
        this.frmArchConfPrim.controls['fecDesde'].markAsTouched();
        this.frmArchConfPrim.controls['fecHasta'].markAsTouched();
        Swal.fire('Error de Datos', 'El Ingreso de las fechas es incorrecto', 'error');
        return;
      }
    }
    //this.archConfPrimas.Usuario = localStorage.getItem('currentUser');
    this.archConfPrimas.variableUsuario = localStorage.getItem('currentUser');
    this._archConfPrimaService.getResumenArchivoConf(this.archConfPrimas).then( (resp:any) => {
      this.archConfPrimas = resp;
      // console.log(this.archConfPrimas)
      if (this.archConfPrimas.NumPoliza > 0){
        this.frmArchConfPrim.controls['usuarioCreacion'].setValue(this.archConfPrimas.Usuario);
      } else{
        Swal.fire('Información', 'No existen pólizas en el rango de fechas ingresado.', 'warning');
      }
    });
  }

  consultarRecepcionPrimasXML() {
    this.archConfPrimas.FechaInicio = this.fecInicio;
    this.archConfPrimas.FechaFin = this.fecFin;

    let fecD = (new Date(this.frmArchConfPrim.get('fecDesde').value));
    let fecH = (new Date(this.frmArchConfPrim.get('fecHasta').value));

    if (fecD.getFullYear() < 1900) {
      Swal.fire('Error de Datos', 'La Fecha ingresada es menor a la mínima que se puede ingresar (01/01/1900).', 'error');
      return;
    }

    if (fecD > fecH) {
      Swal.fire('Error de Datos', 'Fecha mínima incorrecta, es mayor a la Fecha máxima.', 'error');
      return;
    }

    if (Object.prototype.toString.call(fecD) === "[object Date]" || Object.prototype.toString.call(fecH) === "[object Date]") {
      if (isNaN(fecD.getTime()) || isNaN(fecH.getTime())) {
        this.frmArchConfPrim.controls['fecDesde'].markAsTouched();
        this.frmArchConfPrim.controls['fecHasta'].markAsTouched();
        Swal.fire('Error de Datos', 'El Ingreso de las fechas es incorrecto', 'error');
        return;
      }
    }

    this._archConfPrimaService.getConsultaArchivoConf(this.archConfPrimas).then( (resp:any) => {
      this.archConfPrimasXML = resp;
      // console.log(this.archConfPrimasXML)
      if (resp.length > 0){
        this.generarAchivoXMLService.GeneracionArchivo(resp, "ArcConfirmacion"+moment().format('YYYYMMDD').toString());
        
        this.archConfPrimas.NombreArchivo = "ArcConfirmacion"+moment().format('YYYYMMDD').toString()+".xml";
        this.archConfPrimas.Usuario =  this.frmArchConfPrim.get('usuarioCreacion').value;
        this._archConfPrimaService.getInsertaDatosArchivoConf(this.archConfPrimas).then( (resp:any) => {
        });
      } else{
        Swal.fire('Información', 'No existen pólizas en el rango de fechas ingresado.', 'warning');
      }
    });
  }

  limpiar() {
    this.frmArchConfPrim.reset();
 

    this.frmArchConfPrim.get('fecDesde').setValue( moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD'));
    this.frmArchConfPrim.get('fecHasta').setValue( moment(new Date()).format('YYYY-MM-DD'));
  }

}
