import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})

export class generarAchivoTXT{
    constructor( private http: HttpClient ) { }

    archivoEJEMPLO( buffer: any, name: string ) {
        buffer = [
            { col1: "a1", col2: "b1", col3: "c1", col4: "d1", col5: "e1" },
            { col1: "a2", col2: "b2", col3: "c2", col4: "d2", col5: "e2" },
            { col1: "a3", col2: "b3", col3: "c3", col4: "d3", col5: "e3" },
            { col1: "a4", col2: "b4", col3: "c4", col4: "d4", col5: "e4" },
            { col1: "a5", col2: "b5", col3: "c5", col4: "d5", col5: "e5" }
          ] 
        var texto = [];
        texto.push('col1 col2 col3');
        texto.push('\n');
        //ciclo para generar las lineas
        for (let index = 0; index < buffer.length; index++) {
          //const element = buffer[index].col1;
          texto.push(buffer[index].col1+" "+buffer[index].col2);
          texto.push('\n');
        }    
        let file= new Blob(texto, { type: 'text/plain' });
        FileSaver(file, name+".txt")
        
    }
    archivoCalculoPagosRecurrentes( dataList: any, name: string ) {
      var texto = [];
      //cabecera
      texto.push('PÓLIZA; Nº ORDEN; TIPO PENSIÓN; IDENTIFICACIÓN; NOMBRE; PENSIÓN; HAB. IMP.; DESCTO. IMP.; BASE IMP.; SALUD; BASE TRIB.; IMPUESTO; HAB. NO IMP.; DESCTO. NO IMP.; PENSIÓN LIQUIDA; IDENTIFICACIÓN RECEPTOR; NOMBRE RECEPTOR');
      texto.push('\n');
      //ciclo para generar las lineas
      for (let index = 0; index < dataList.length; index++) {    
        texto.push(
        dataList[index].Num_Poliza+";"+dataList[index].vlNumOrden+";"+
        dataList[index].Cod_TipPension+";"+dataList[index].Des_TipoIdenBen +";"+dataList[index].NombreCompleto+";"+

        dataList[index].vlMtoPensionUF+";"+dataList[index].vlMtoHabNoImp+";"+dataList[index].vlMtoDesImp+";"+
        dataList[index].Mto_BaseImp+";"+dataList[index].vlMtoSalud+";"+dataList[index].Mto_BaseTri+";"+

        dataList[index].vlMtoImpuesto+";"+dataList[index].vlMtoHabNoImp+";"+dataList[index].vlMtoDesNoImp+";"+dataList[index].vlMtoPenLiq+";"+
        dataList[index].Des_CodTipoIdenRec +";"+dataList[index].NombreCompletoReceptor
        );
        texto.push('\n');
      }  
      let file= new Blob(texto, { type: 'text/plain' });
      FileSaver(file, name+".txt")
  }
  archivoGeneracionArchivoCotizacionEsSalud( dataList: any, name: string ) {
    var texto = [];
    //cabecera
    texto.push('CODPLA;ANOPRO;MESPRO;CODPER;TIPDOC;NRODOC;APPPER;APMPER;NOMPER;FCHNAC;SEXPER;TLFPER;FCHING;SITTRA;TIPTRA;FCHBAJ;'+
               'RUCEPS;ESSVID;REGPEN;SCTR_1;NOMVIA;NUMERO;INTERI;NOMZON;REFERE;TIPVIA;TIPZON;UBIGEO;DIATRA;REMSAL;FCHAFP;NOMREN;'+
               'NOMCIA;CUSPP;POLIZA;NOMCAU;PASEMI;TIPPEN;REGIMENPEN;CATEGO;TIPREG;CODCON;TIPPAG');
    texto.push('\n');
    //ciclo para generar las lineas
    for (let index = 0; index < dataList.length; index++) {
      texto.push(
           dataList[index].vlTipoPension +";"+dataList[index].vlNumPagoAno
      +";"+dataList[index].vlNumPagoMes+";"+dataList[index].vlNumOrden2
      +";"+dataList[index].vlTipoIdentif+";"+dataList[index].vlNumIdenBenef
      +";"+dataList[index].vlPaterno+";"+dataList[index].vlMatBen
      +";"+dataList[index].vlNombre+";"+dataList[index].vlFecNac
      +";"+dataList[index].vlSexo+";"+dataList[index].vlTelefono
      +";"+dataList[index].vlFecIngreso+";"+dataList[index].clArcFonasaSittra
      +";"+dataList[index].clArcFonasaTiptra+";"+dataList[index].vlFchBaj

      +";"+dataList[index].vlRuceps+";"+dataList[index].clArcFonasaEssvid
      +";"+dataList[index].clArcFonasaRegpen+";"+dataList[index].clArcFonasaSctr_1
      +";"+dataList[index].vldireccion+";"+dataList[index].vlNumDireccion
      +";"+dataList[index].vlInteri+";"+dataList[index].vlNomZon


      +";"+dataList[index].vlRefEre+";"+dataList[index].vlTipVia
      +";"+dataList[index].vlTipZon+";"+dataList[index].vlUbiGeo
      +";"+dataList[index].clArcFonasaDiatra+";"+dataList[index].vlMtoConHab
      +";"+dataList[index].vlFchAfp+";"+dataList[index].vlMoneda


      +";"+dataList[index].vlNomCompania+";"+dataList[index].vlCuspp
      +";"+dataList[index].vlNumPoliza2+";"+dataList[index].vlNomCausante
      +";"+dataList[index].PaisEmisor+";"+dataList[index].TipoPensionista


      +";"+dataList[index].RegimenPensionarnario+";"+dataList[index].Categoria
      +";"+dataList[index].TipoRegistro+";"+dataList[index].CodigoConceptoRemNoRem
      +";"+dataList[index].TipoPago

      );
      texto.push('\n');
    }
    let file= new Blob(texto, { type: 'text/plain' });
    FileSaver(file, name+".txt")
}
}