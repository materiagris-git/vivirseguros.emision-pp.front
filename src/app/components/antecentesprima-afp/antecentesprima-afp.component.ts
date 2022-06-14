import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { AntecedentesprimaAfpService } from 'src/providers/antecedentesprima-afp.service';
import { AntecedentesPrimaAfp, Moneda } from 'src/interfaces/antecedentesprima-afp.model';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from 'src/app/AppConst';
import { ServiciofechaService } from 'src/providers/serviciofecha.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Globales } from 'src/interfaces/globales';
import { DecimalPipe } from '@angular/common';
import { parse } from 'querystring';
import { LoginService } from 'src/providers/login.service';

@Component({
  selector: 'app-antecentesprima-afp',
  templateUrl: './antecentesprima-afp.component.html',
  styleUrls: ['./antecentesprima-afp.component.css'],
})
export class AntecentesprimaAfpComponent implements OnInit {

  formSearch: FormGroup;
  primDefNs = '0';
  mtoPensionDef = 0;
  fecTras = moment(new Date()).format('YYYY-MM-DD');;
  mens = '';
  public tblPolPriRe: any[];
  private url = AppConsts.baseUrl + 'antecedentesprima';
  now = new Date();
  guardarCambios = false;


  pol: AntecedentesPrimaAfp = {
    NumPoliza: '',
    CodTippension: '',
    NumIdenafi: '',
    GlsTipoidencor: '',
    CodCuspp: '',
    CodTipren: '',
    NumMesdif: 0,
    CodModalidad: '',
    NumMesgar: 0,
    MtoBono: 0,
    MtoPriuni: 0,
    MtoPension: 0,
    MtoPensiongar: 0,
    MtoValprepentmp: 0,
    MtoRentatmpafp: 0,
    MtoCtaindafp: 0,
    MtoResmat: 0,
    MtoPenanual: 0,
    MtoRmpension: 0,
    MtoRmgtosep: 0,
    MtoRmgtoseprv: 0,
    MtoPriunisim: 0,
    PrcTasarprt: 0,
    GlsPension: '',
    GlsRenta: '',
    GlsModalidad: '',
    GlsNomben: '',
    GlsNomsegben: '',
    GlsPatben: '',
    GlsMatben: '',
    CodMoneda: '',
    FecAcepta: '',
    FecDev: '',
    MtoValmoneda: 0,
    MtoPriunidif: 0,
    PrcRentatmp: 0,
    MtoSumpension: 0,
    CodTipreajuste: '',
    MtoValreajustetri: 0,
    MtoValreajustemen: 0,
    GlsTipreajuste: '',
    CodMontipreaju: '',
    GlsMontipreaju: '',
    NumMesesc: 0,
    PrcRentaesc: 0,
    PrcPension: 0,
    MtoPrirecpesos: 0,
    MtoValmonedarec: 0,
    Prc_TasaRPRT: 0,
    PrcFacvar: 0,
    MtoPriafp: 0,
    MtoPensionafp: 0,
    MtoPricia: 0,
    MtoSumpensionafp: 0,
    NomCompleto: '',
    TipoPensionCom: '',
    TipoRentaCom: '',
    TipoModalidadCom: '',
    TipoMonedaCom: '',
    MtoSumPensionDef: 0,
    FecTraspaso: '',
    CodUsuariocrea: '',
    MtoPenvarfon: 0,
    MtoPenvartc: 0,
    MtoPenvarfont: 0,
    FecVigencia: '2020-02-02',
    CodLiquidacion: '',
    CodFactura: '',
    CodRenvit: '',
    MtoSumpensioninf: 0,
    NumCotizacion: '',
    Mensaje: '',
    Usuario:''
  };

  monedaNS: Moneda = new Moneda();
  monedaSolDolar: Moneda = new Moneda();

  isDisabled = true;


  constructor(private fb: FormBuilder, private http: HttpClient,
              private _antPrimaAFPServvice: AntecedentesprimaAfpService,
              public titleService: Title,
              private _serviceFecha: ServiciofechaService, 
              private activatedRoute: ActivatedRoute, 
              private _decimalPipe: DecimalPipe,
              private serviceLog:LoginService,
              private cdRef:ChangeDetectorRef) { }

  seleccionarFilaPoliza(numeroPoliza: string) {
    this.pol.NumPoliza = numeroPoliza;
    this.formSearch.get('nPoliza').setValue(numeroPoliza);
  }

  ngOnInit() {
    Globales.titlePag = 'Generar Solicitud de Traspaso a AFP';
    this.titleService.setTitle(Globales.titlePag);
    this.pol.NumPoliza = this.activatedRoute.snapshot.paramMap.get('poliza');
    this.buscarPoliza(this.activatedRoute.snapshot.paramMap.get('poliza').toString());

    this.formAntecedentesAFP();
    this.formSearch.controls['fechaInfoAFP'].disable();
    this.formSearch.controls['primaDefinitivaNS'].disable();
    this.isDisabled;
  }

  ngAfterViewChecked()
  {
    if(!localStorage.getItem('currentUser')){
      this.serviceLog.verificarSesion();
    }
    this.cdRef.detectChanges();
  }

  get inputValidation() {
    return this.formSearch.get('nPoliza').invalid && this.formSearch.get('nPoliza').touched;
  }

  get fechaInfoAfp() {
    return this.formSearch.get('fechaInfoAFP').invalid && this.formSearch.get('fechaInfoAFP').touched;
  }

  get primaDefinitivaNS() {
    return this.formSearch.get('primaDefinitivaNS').invalid && this.formSearch.get('primaDefinitivaNS').touched;
  }

  // Validación input solo numeros.
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  validateNumber(e: any) {
    let input = String.fromCharCode(e.charCode);
    const reg = /^\d*(?:[.,]\d{1,2})?$/;

    if (!reg.test(input)) {
      e.preventDefault();
    }
  }

  // Creación del form inicial
  formAntecedentesAFP() {
    this.formSearch = this.fb.group({
      nPoliza: [null, [Validators.required, Validators.maxLength(10)]],
      fechaInfoAFP: [],
      primaDefinitivaNS: [],
      factorVariacionRenta: ['',],
      tipoCambio: [''],
      mtoPenDefComp: [''],
      primDefComp: [''],
      mtoPenDefNS: [''],
      primDefNS: [''],
      prcPension: [this.pol.PrcPension]
    });
  }

  // Formulario al momento de cambiar valores
  onChangeFormAntecedentesAfp() {
    this.formSearch.get('nPoliza').valueChanges.subscribe(nPol => {
      this.formSearch.get('fechaInfoAFP').enable();
      this.formSearch.get('fechaInfoAFP').setValidators([Validators.required]);
      this.formSearch.get('primaDefinitivaNS').enable();
      this.formSearch.get('primaDefinitivaNS').setValidators([Validators.required]);
    });
  }

  vaciarLista() {
    this.pol = {
      NumPoliza: "",
      CodTippension: "",
      NumIdenafi: "",
      GlsTipoidencor: "",
      CodCuspp: "",
      CodTipren: "",
      NumMesdif: 0,
      CodModalidad: "",
      NumMesgar: 0,
      MtoBono: 0,
      MtoPriuni: 0,
      MtoPension: 0,
      MtoPensiongar: 0,
      MtoValprepentmp: 0,
      MtoRentatmpafp: 0,
      MtoCtaindafp: 0,
      MtoResmat: 0,
      MtoPenanual: 0,
      MtoRmpension: 0,
      MtoRmgtosep: 0,
      MtoRmgtoseprv: 0,
      MtoPriunisim: 0,
      PrcTasarprt: 0,
      GlsPension: "",
      GlsRenta: "",
      GlsModalidad: "",
      GlsNomben: "",
      GlsNomsegben: "",
      GlsPatben: "",
      GlsMatben: "",
      CodMoneda: "",
      FecAcepta: "",
      FecDev: "",
      MtoValmoneda: 0,
      MtoPriunidif: 0,
      PrcRentatmp: 0,
      MtoSumpension: 0,
      CodTipreajuste: "",
      MtoValreajustetri: 0,
      MtoValreajustemen: 0,
      GlsTipreajuste: "",
      CodMontipreaju: "",
      GlsMontipreaju: "",
      NumMesesc: 0,
      PrcRentaesc: 0,
      PrcPension: 0,
      MtoPrirecpesos: 0,
      MtoValmonedarec: 0,
      Prc_TasaRPRT: 0,
      PrcFacvar: 0,
      MtoPriafp: 0,
      MtoPensionafp: 0,
      MtoPricia: 0,
      MtoSumpensionafp: 0,
      NomCompleto: "",
      TipoPensionCom: "",
      TipoRentaCom: "",
      TipoModalidadCom: "",
      TipoMonedaCom: "",
      MtoSumPensionDef: 0,
      FecTraspaso: "",
      CodUsuariocrea: "",
      MtoPenvarfon: 0,
      MtoPenvartc: 0,
      MtoPenvarfont: 0,
      FecVigencia: "",
      CodLiquidacion: "",
      CodFactura: "",
      CodRenvit: "",
      MtoSumpensioninf: 0,
      Mensaje: ""
    };
  }

  zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ''; // siempre devuelve tipo cadena
  }


  buscarPoliza(numPoliza: string) {
    // this.vaciarLista();

    // var pad = "0000000000";
    // var numPol = this.formSearch.get('nPoliza').value;
    // var result = (pad + numPol).slice(-pad.length);
    // this.pol.NumPoliza = result;
    this.pol.FecTraspaso = '2020-01-01';

    this._antPrimaAFPServvice.getPolizas(numPoliza).then((resp: any) => {
      this.pol = resp;
      this.pol.FecDev = this._serviceFecha.format(new Date(moment(this.pol.FecDev).format('LLLL')));
      this.pol.FecAcepta = this._serviceFecha.format(new Date(moment(this.pol.FecAcepta).format('LLLL')));
      this.pol.FecEmision = this.pol.FecEmision === '' ? '' : this._serviceFecha.format(new Date(moment(this.pol.FecEmision).format('LLLL')));

      // if (numPol === null || numPol === '') {
      //  this.formSearch.controls['nPoliza'].markAsTouched();
      //  Swal.fire('Falta de Información', 'Debe Ingresar el Número de la Póliza a Registrar la Prima Recaudada', 'error');
      //  return;
      // }

      if (this.pol.Mensaje === 'EXITOSO') {
        this.onChangeFormAntecedentesAfp();
        this.formSearch.controls['fechaInfoAFP'].enable();
        this.formSearch.controls['primaDefinitivaNS'].enable();
        this.isDisabled = false;

        this._antPrimaAFPServvice.getCodMoneda("NS").then((resp: any) => {
          this.monedaNS = resp;
        });

        this._antPrimaAFPServvice.getCodMoneda(this.pol.CodMoneda).then((resp: any) => {
          this.monedaSolDolar = resp;
        });
      } else { // if (this.pol.Mensaje === 'La póliza no se ha encontrado en base de datos.') {
        this.isDisabled = true;
        this.formSearch.reset();
        this.formSearch.controls['fechaInfoAFP'].disable();
        this.formSearch.controls['primaDefinitivaNS'].disable();
        this.formSearch.get('fechaInfoAFP').setValidators(null);
        this.formSearch.get('fechaInfoAFP').updateValueAndValidity();
        this.formSearch.get('primaDefinitivaNS').setValidators(null);
        this.formSearch.get('primaDefinitivaNS').updateValueAndValidity();
        Swal.fire('Error', 'El número de póliza no existe.', 'error');
        return;
      }

    });
  }

  calcular() {
    this.pol.FecTraspaso = this.fecTras;
    this.pol.MtoPrirecpesos = Number(this.primDefNs.replace(/,/g, ''));
    this.primDefNs = this._decimalPipe.transform(this.primDefNs.replace(/,/g, ''), '1.2-2');

    this._antPrimaAFPServvice.getCalculoPension(this.pol).then((resp: any) => {
      this.pol = resp;
      this.mens = resp.Mensaje;
      if (this.pol.Mensaje === 'ERROR') {
        this.guardarCambios = false;
        Swal.fire('Error', 'Error fecha de información AFP es mayor a la fecha actual.', 'error');
      }
      if (this.pol.Mensaje === 'ERROR MONEDA') {
        if (this.pol.CodMoneda == "NS"){
          Swal.fire('Error', 'No se encuentra registrado el valor de la moneda S. para la fecha de traspaso de la prima.', 'error');
        }else if (this.pol.CodMoneda == "US"){
          Swal.fire('Error', 'No se encuentra registrado el valor de la moneda US$ para la fecha de traspaso de la prima.', 'error');
        }
        
      }
    if (this.pol.Mensaje ==='EXITOSO')
    {
      this.guardarCambios = true;
    }


      // this.pol.MtoPensionafp = this.pol.MtoSumpensioninf;
      // this.pol.MtoPriafp = this.pol.MtoSumpensioninf * this.pol.MtoValprepentmp;
      // this.pol.MtoSumpensioninf = this.pol.MtoSumpensioninf / 2;
    });



    if (this.pol.FecTraspaso === '' || this.pol.MtoPrirecpesos === 0) {
      var date = new Date(this.fecTras);

      this.formSearch.get('fechaInfoAFP').setValidators([Validators.required]);
      this.formSearch.get('fechaInfoAFP').updateValueAndValidity();
      this.formSearch.get('primaDefinitivaNS').setValidators([Validators.required]);
      this.formSearch.get('primaDefinitivaNS').updateValueAndValidity();
      this.formSearch.controls['fechaInfoAFP'].markAsTouched();
      this.formSearch.controls['primaDefinitivaNS'].markAsTouched();

      Swal.fire('Falta de información', 'Por favor llene todos los campos vacíos.', 'error');
    }

  }

  async guardar() {
    // let fechaInfoAfp = (<HTMLInputElement>document.getElementById("fechaInfoAfp")).value;
    // let primaDefNs = (<HTMLInputElement>document.getElementById("primaDefNS")).value;

    /*if (this.formSearch.get('nPoliza').value === null || this.formSearch.get('nPoliza').value === "") {
      this.formSearch.controls['nPoliza'].markAsTouched();
      Swal.fire('Error de Datos', 'Debe Seleccionar la Póliza a Registrar la Prima', 'error');
    }*/
    if (this.guardarCambios === false)
    {
      Swal.fire('Error de datos', 'Debe realizar el cálculo para poder guardar cambios.', 'error');
    }
    else
    {
      if (this.pol.FecTraspaso === '' || this.pol.MtoPrirecpesos === 0 || Number(this.primDefNs.replace(/,/g, '')) === 0) {
        this.formSearch.get('fechaInfoAFP').setValidators([Validators.required]);
        this.formSearch.get('fechaInfoAFP').updateValueAndValidity();
        this.formSearch.get('primaDefinitivaNS').setValidators([Validators.required]);
        this.formSearch.get('primaDefinitivaNS').updateValueAndValidity();
        this.formSearch.controls['fechaInfoAFP'].markAsTouched();
        this.formSearch.controls['primaDefinitivaNS'].markAsTouched();

        Swal.fire('Falta de información', 'Por favor llene todos los campos vacíos.', 'error');
        return;
      }

      Swal.fire({
        title: 'Confirmación',
        text: '¿Estás seguro que deseas actualizar la información?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0090B2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          //this.pol.FecEmision = this.pol.FecEmision === '' ? '' : this._serviceFecha.formatBD(new Date(moment(this.pol.FecEmision).format('LLLL')));
          this.pol.Usuario =  localStorage.getItem('currentUser');
          this._antPrimaAFPServvice.grabarPension(this.pol).then((resp: any) => {
            //resp.FecEmision = resp.FecEmision === '' ? '' : this._serviceFecha.format(new Date(moment(resp.FecEmision).format('LLLL')));
            this.pol = resp;

            if (this.pol.Mensaje === 'La Póliza ya existe.') {
              this.formSearch.reset();
              this.formSearch.controls['fechaInfoAFP'].disable();
              this.formSearch.controls['primaDefinitivaNS'].disable();
              this.formSearch.get('fechaInfoAFP').setValidators(null);
              this.formSearch.get('fechaInfoAFP').updateValueAndValidity();
              this.formSearch.get('primaDefinitivaNS').setValidators(null);
              this.formSearch.get('primaDefinitivaNS').updateValueAndValidity();
              // this.vaciarLista();
              this.isDisabled = true;
              Swal.fire('Error', 'La póliza ya existe en la base de datos.', 'warning');

            } else if (this.pol.Mensaje === 'Exitoso') {
              this.formSearch.reset();
              this.isDisabled = true;
              Swal.fire('Éxito', 'El traspaso de prima de AFP se registró correctamente.', 'success');
            }
          });
        }
      });
    }
  }

  numberDecimal(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode === 47 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
