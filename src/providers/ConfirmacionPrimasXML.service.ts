import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { ArchivoConfirmacionPrimaXML } from 'src/interfaces/archivoconfirmacion-prima.model';

@Injectable({
    providedIn: 'root'
})

export class ConfirmacionPrimasXML{
    constructor( private http: HttpClient ) { }

    
    GeneracionArchivo( Data: [ArchivoConfirmacionPrimaXML], name: string ) {
       
      var texto = [];
      texto.push('<?xml version="1.0" encoding="ISO-8859-1" ?>\n');
      texto.push('<!-- edited with XMLSpy v2006 rel. 3 sp1 (http://www.altova.com) by newbe (EMBRACE) -->\n');
      texto.push('<cargaConfirmaciones>\n');
      Data.forEach(function (x) {
            texto.push('\t<confirmacion>\n');
                texto.push('\t\t<operacion>');
                texto.push(x.NumOperacion);
                texto.push('</operacion>\n');
                texto.push('\t\t<CUSPP>');
                texto.push(x.CUSPP);
                texto.push('</CUSPP>\n');
                texto.push('\t\t<pensionEESS>\n');
                    texto.push('\t\t\t<numeroPoliza>');
                    texto.push(x.NumPoliza);
                    texto.push('</numeroPoliza>\n');
                    if(x.TipPension == '08'){
                        if(x.MesDif == 0){
                            if(x.MesEsc == 0){
                                texto.push('\t\t\t<primeraPensionRV>');
                                texto.push(x.MtoSumPension);
                                texto.push('</primeraPensionRV>\n');
                            }
                            else{
                                texto.push('\t\t\t<primeraPensionRT>');
                                texto.push(x.MtoSumPension);
                                texto.push('</primeraPensionRT>\n');
                                texto.push('\t\t\t<primeraPensionRVD>');
                                texto.push(x.MtoRentaEsc);
                                texto.push('</primeraPensionRVD>\n');                            
                            }                            
                        }
                        else{
                            texto.push('\t\t\t<primeraPensionRT>');
                            texto.push(x.MtoPensionRT);
                            texto.push('</primeraPensionRT>\n');
                            texto.push('\t\t\t<primeraPensionRVD>');
                            texto.push(x.MtoSumPension);
                            texto.push('</primeraPensionRVD>\n');
                        }
                    }
                    else{
                        if(x.MesDif == 0){
                            if(x.MesEsc == 0){
                                texto.push('\t\t\t<primeraPensionRV>');
                                texto.push(x.MtoPension);
                                texto.push('</primeraPensionRV>\n');
                            }
                            else{
                                texto.push('\t\t\t<primeraPensionRT>');
                                texto.push(x.MtoPension);
                                texto.push('</primeraPensionRT>\n');
                                texto.push('\t\t\t<primeraPensionRVD>');
                                texto.push(x.MtoRentaEsc);
                                texto.push('</primeraPensionRVD>\n');                            
                            }                            
                        }
                        else{
                            texto.push('\t\t\t<primeraPensionRT>');
                            texto.push(x.MtoPensionRT);
                            texto.push('</primeraPensionRT>\n');
                            texto.push('\t\t\t<primeraPensionRVD>');
                            texto.push(x.MtoPension);
                            texto.push('</primeraPensionRVD>\n');
                        }
                    }
                    if(x.MesDif > 0){
                        texto.push('\t\t\t<primaUnicaAFPEESS>');
                        texto.push(x.MtoPriRecAFP);
                        texto.push('</primaUnicaAFPEESS>\n');
                    }
                    texto.push('\t\t\t<primaUnicaEESS>');
                    texto.push(x.MtoPriRec);
                    texto.push('</primaUnicaEESS>\n');
                    texto.push('\t\t\t<inicioVigencia>');
                    texto.push(x.IniVigencia);
                    texto.push('</inicioVigencia>\n');                  

                texto.push('\t\t</pensionEESS>\n');
            texto.push('\t</confirmacion>\n');
        });
      texto.push('</cargaConfirmaciones>');
    let file= new Blob(texto, { type: 'application/xml' });//formato XML
    FileSaver(file, name+".xml")
        
    }
    //clase para formateo de la cadena
    escaparXML(cadena) {
        if (typeof cadena !== 'string') {
            return '';
        };
        cadena = cadena.replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;');
        return cadena;
    }
}