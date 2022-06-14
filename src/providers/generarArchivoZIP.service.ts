import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as fs from 'file-saver';
import * as JSZip from 'jszip'; 

@Injectable({
  providedIn: 'root'
})
//instalar
//npm i jszip  
export class generarAchivoZIP {
  constructor(private http: HttpClient) { }
  //Metodo mas mejor para generar archivos comprimidos by Kevin and children pony
  createZip(files: any[],nameArchivo: any[], zipName: string) {  
    const zip = new JSZip();  
    const name = zipName + '.zip';  
    // tslint:disable-next-line:prefer-for-of  
    for (let counter = 0; counter < files.length; counter++) {  
      const element = files[counter];  
      const fileData: any = element;  
      const b: any = new Blob([fileData], { type: '' + fileData.type + ''}); 
      zip.file(nameArchivo[counter], b);  
    }  
    zip.generateAsync({ type: 'blob' }).then((content) => {  
      if (content) {  
        fs.saveAs(content, name);  
      }  
    });  
  }
  /*  let Archivo=[];
      let ArchivoName=[];
      ArchivoName.push(name + '.xlsx');
      Archivo.push(blob);  
      this.generarAchivoZIP.createZip(Archivo,ArchivoName,"PRUEEBA");*/
}

