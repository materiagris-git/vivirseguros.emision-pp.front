import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})

export class generarAchivoXML{
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
      texto.push('<?xml version="1.0" encoding="UTF-8" ?>\n');
      texto.push('<datos>\n');
      for (let index = 0; index < buffer.length; index++) {
            texto.push('\t<nombre>');
            texto.push(this.escaparXML(buffer[index].col1));
            texto.push('</nombre>\n');
            texto.push('\t<telefono>');
            texto.push(this.escaparXML(buffer[index].col2));
            texto.push('</telefono>\n');
            texto.push('\t<fecha>');
            texto.push(this.escaparXML(buffer[index].col3));
            texto.push('</fecha>\n');
      }
      texto.push('</datos>');
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