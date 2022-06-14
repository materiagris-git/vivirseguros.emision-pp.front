import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
import { generarAchivoZIP } from 'src/providers/generarArchivoZIP.service';

@Injectable({
  providedIn: 'root'
})

export class generarAchivoXLSX {
  constructor(private http: HttpClient, private generarAchivoZIP: generarAchivoZIP) { }
  generateExcelArchivoBeneficiarios(dataList: any) {
    //Excel Title, Header, Data
    const header = ["Num Poliza", "Num Endoso"]
    const data = []
    //generamos el array con la informacion a mostrar
    for (let index = 0; index < dataList.length; index++) {
      const element = [dataList[index].vlNumPoliza, dataList[index].vlNumEndoso];
      data.push(element);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Datos Beneficiario');
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }//color letra
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    //se agrega la informacion 
    worksheet.addRows(data);
    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ArchivoDatosBen_.xlsx');
    })
  }
  //excel de ejemplo
  //el metodo worksheet.addRow funciona para agregar filas en el doc 
  //esto sirve para generar los encabezados o bien agregar footer
  generateExcel() {

    //Excel Title, Header, Data
    const title = 'Car Sell Report';
    const header = ["Year", "Month", "Make", "Model", "Quantity", "Pct"]
    const data = [
      [2007, 1, "Volkswagen ", "Volkswagen Passat", 1267, 10],
      [2007, 1, "Toyota ", "Toyota Rav4", 819, 6.5],
      [2007, 1, "Toyota ", "Toyota Avensis", 787, 6.2],
      [2007, 1, "Volkswagen ", "Volkswagen Golf", 720, 5.7],
      [2007, 1, "Toyota ", "Toyota Corolla", 691, 5.4],
      [2007, 1, "Peugeot ", "Peugeot 307", 481, 3.8],
      [2008, 1, "Toyota ", "Toyota Prius", 217, 2.2],
      [2008, 1, "Skoda ", "Skoda Octavia", 216, 2.2],
      [2008, 1, "Peugeot ", "Peugeot 308", 135, 1.4],
      [2008, 2, "Ford ", "Ford Mondeo", 624, 5.9],
      [2008, 2, "Volkswagen ", "Volkswagen Passat", 551, 5.2],
      [2008, 2, "Volkswagen ", "Volkswagen Golf", 488, 4.6],
      [2008, 2, "Volvo ", "Volvo V70", 392, 3.7],
      [2008, 2, "Toyota ", "Toyota Auris", 342, 3.2],
      [2008, 2, "Volkswagen ", "Volkswagen Tiguan", 340, 3.2],
      [2008, 2, "Toyota ", "Toyota Avensis", 315, 3],
      [2008, 2, "Nissan ", "Nissan Qashqai", 272, 2.6],
      [2008, 2, "Nissan ", "Nissan X-Trail", 271, 2.6],
      [2008, 2, "Mitsubishi ", "Mitsubishi Outlander", 257, 2.4],
      [2008, 2, "Toyota ", "Toyota Rav4", 250, 2.4],
      [2008, 2, "Ford ", "Ford Focus", 235, 2.2],
      [2008, 2, "Skoda ", "Skoda Octavia", 225, 2.1],
      [2008, 2, "Toyota ", "Toyota Yaris", 222, 2.1],
      [2008, 2, "Honda ", "Honda CR-V", 219, 2.1],
      [2008, 2, "Audi ", "Audi A4", 200, 1.9],
      [2008, 2, "BMW ", "BMW 3-serie", 184, 1.7],
      [2008, 2, "Toyota ", "Toyota Prius", 165, 1.6],
      [2008, 2, "Peugeot ", "Peugeot 207", 144, 1.4]
    ];
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Car Data');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Date : 28032020'])
    //Add Image
    /* let logo = workbook.addImage({
       base64: logoFile.logoBase64,
       extension: 'png',
     });
     worksheet.addImage(logo, 'E1:F3');*/
    worksheet.mergeCells('A1:D2');
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
      let qty = row.getCell(5);
      let color = 'FF99FF99';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    }
    );
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.addRow([]);
    //para las sumas se asigna la posision pero el valor se debe calcular aparte
    //pero la formula se activa de manera correcta cuando se edita el xlxs pero el valor no lo calcula 
    //el calcula debe ser desde back
    worksheet.fillFormula('B' + worksheet.rowCount.toString() + ':B' + worksheet.rowCount.toString(), 'SUMA(B6:B7)', [3]);
    //worksheet.fillFormula('C8:C'+worksheet.rowCount.toString(), 'SUMA(C6:C7)',[0]);
    //Footer Row
    let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' }
    };
    footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CarData.xlsx');
    })
  }
  //pantalla calculoPagosRecurrentes
  generateExcelCalculoPagosRecurrentes(dataList: any, name: string, tipo: string, fecha: string) {
    //Excel Title, Header, Data
    const header = ["PÓLIZA", "Nº ORDEN", "TIPO PENSIÓN", "IDENTIFICACIÓN", "NOMBRE",

      "PENSIÓN", "HAB. IMP.", "DESCTO. IMP.",
      "BASE IMP.", "SALUD", "BASE TRIB.",

      "IMPUESTO", "HAB. NO IMP.", "DESCTO. NO IMP.", "PENSIÓN LIQUIDA",
      "IDENTIFICACIÓN RECEPTOR", "NOMBRE RECEPTOR"]
    const data = []
    function numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    //generamos el array con la informacion a mostrar
    for (let index = 0; index < dataList.length; index++) {

      const element = [dataList[index].Num_Poliza, dataList[index].vlNumOrden,
      dataList[index].Cod_TipPension, dataList[index].Des_TipoIdenBen , dataList[index].NombreCompleto,

      numberWithCommas(dataList[index].vlMtoPensionUF), numberWithCommas(dataList[index].vlMtoHabImp), numberWithCommas(dataList[index].vlMtoDesImp),
      numberWithCommas(dataList[index].Mto_BaseImp), numberWithCommas(dataList[index].vlMtoSalud), numberWithCommas(dataList[index].Mto_BaseTri),

      numberWithCommas(dataList[index].vlMtoImpuesto), numberWithCommas(dataList[index].vlMtoHabNoImp), numberWithCommas(dataList[index].vlMtoDesNoImp), numberWithCommas(dataList[index].vlMtoPenLiq),
       dataList[index].Des_CodTipoIdenRec , dataList[index].NombreCompletoReceptor
      ];

      data.push(element);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Datos Beneficiario');

    worksheet.addRow(["Compañía de Seguros de Vivir Seguros S.A."]).font = { name: 'times new roman', family: 4, size: 10, italic: true };
    worksheet.mergeCells('A1:D1');
    worksheet.addRow(["División Seguros"]).font = { name: 'times new roman', family: 4, size: 10, italic: true };
    worksheet.mergeCells('A2:D2');
    let titleRow;
    if(tipo == "SUS")
    {
      titleRow = worksheet.addRow(["CÁLCULO DE PAGOS SUSPENDIDOS"]);
    }
    else{
      titleRow = worksheet.addRow(["CÁLCULO DE PAGOS RECURRENTES"]);
    }
    titleRow.font = { name: 'times new roman', family: 4, size: 16, underline: 'single', bold: true }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3:Q3');

    let tipoDes = "DEFINITIVO"
    if (tipo === "P") {
      tipoDes = "PROVISORIO"
    }
    if(tipo == "SUS")
    { tipoDes = "SUSPENDIDOS"}
    let Row = worksheet.addRow([tipoDes]);
    Row.font = { name: 'times new roman', family: 4, size: 10 }
    Row.alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.mergeCells('A4:Q4');

    let RowFecha = worksheet.addRow(["Fecha de Pago : ", moment(fecha).format('DD/MM/YYYY').toString(), , , , , , , , , , , , , , , "Fecha : " + moment().format('DD/MM/YYYY').toString()]);
    RowFecha.font = { name: 'times new roman', family: 4, size: 10 }
    worksheet.getCell('A5').font = { bold: true };
    worksheet.getCell('B5').font = { bold: true };
    worksheet.getCell('Q5').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.addRow([]);


    //Add Header Row
    let headerRow = worksheet.addRow(header);
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }//color letra
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    })

    data.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let nombre = row.getCell(5);
      nombre.alignment = { vertical: 'top', horizontal: 'left' };
      nombre = row.getCell(17);
      nombre.alignment = { vertical: 'top', horizontal: 'left' };
      /*let color = 'FF99FF99';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }*/
    }
    );
    //se agrega la informacion 
    //worksheet.addRows(data);
    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 14;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 50;
    worksheet.getColumn(6).width = 15;

    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 15;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 15;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 16;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 25;
    worksheet.getColumn(17).width = 50;
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name + '.xlsx');
    })
  }
  generateExcelCalculoPagosRecurrentesNoAceptados(dataList: any, name: string, tipo: string, fecha: string) {
    //Excel Title, Header, Data
    const header = ["PÓLIZA", "Nº ORDEN", "Nº ENDOSO", "TIPO DOCUMENTO","N° DOCUMENTO", "NOMBRE",

      "Monto", "Prc Pension.", "Periodo", "Observación"]
    const data = []
    function numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    //generamos el array con la informacion a mostrar
    for (let index = 0; index < dataList.length; index++) {
      let Identificacion = dataList[index].Gls_nomben + " " + dataList[index].gls_patben + " " + dataList[index].gls_matben;
      if (dataList[index].gls_Nomsegben == !'' || dataList[index].gls_Nomsegben == ! null) {
        Identificacion = dataList[index].Gls_nomben + " " + dataList[index].gls_Nomsegben + " " + dataList[index].gls_patben + " " + dataList[index].gls_matben;
      }
      const element = [dataList[index].num_poliza, dataList[index].Num_Orden, dataList[index].num_endoso, dataList[index].GLS_TIPOIDENCOR, dataList[index].Num_IdenBen, Identificacion,
      dataList[index].mto_pension, dataList[index].PRC_PENSION, dataList[index].periodo, dataList[index].GLS_ELEMENTO];

      data.push(element);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Datos Beneficiario');

    worksheet.addRow(["Compañía de Seguros de Vida Cámara S.A."]).font = { name: 'times new roman', family: 4, size: 10, italic: true };
    worksheet.mergeCells('A1:D1');
    worksheet.addRow(["División Seguros"]).font = { name: 'times new roman', family: 4, size: 10, italic: true };
    worksheet.mergeCells('A2:D2');

    let titleRow = worksheet.addRow(["CÁLCULO DE PAGOS RECURRENTES"]);
    titleRow.font = { name: 'times new roman', family: 4, size: 16, underline: 'single', bold: true }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3:I3');

    let tipoDes = "DEFINITIVO"
    if (tipo === "P") {
      tipoDes = "PROVISORIO"
    }
    let Row = worksheet.addRow([tipoDes]);
    Row.font = { name: 'times new roman', family: 4, size: 10 }
    Row.alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.mergeCells('A4:I4');

    let RowFecha = worksheet.addRow(["Fecha de Pago : ", moment(fecha).format('DD/MM/YYYY').toString(), , , , , , , "Fecha : " + moment().format('DD/MM/YYYY').toString()]);
    RowFecha.font = { name: 'times new roman', family: 4, size: 10 }
    worksheet.getCell('A5').font = { bold: true };
    worksheet.getCell('B5').font = { bold: true };
    worksheet.getCell('I5').alignment = { vertical: 'bottom', horizontal: 'right' };
    worksheet.addRow([]);


    //Add Header Row
    let headerRow = worksheet.addRow(header);
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }//color letra
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    })

    data.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let nombre = row.getCell(6);
      nombre.alignment = { vertical: 'top', horizontal: 'left' };
      nombre = row.getCell(10);
      nombre.alignment = { vertical: 'top', horizontal: 'left' };
    }
    );
    //se agrega la informacion 
    //worksheet.addRows(data);
    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 50;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 15;
    worksheet.getColumn(10).width = 75;

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name + '.xlsx');
    })
  }
  //pantalla Consulta de Hijos que cumplirán la mayoria de edad
  generateExcelConsultaHijosCumpliranMayoriaEdad(dataList: any, name: string) {
    console.log(dataList)
    console.log(name)
    //Excel Title, Header, Data
    const header = ["Nº Poliza", "Nº Orden", "Tipo Doc", "Nº Documento", "Parentesco", "Género",
      "Beneficiario", "Fecha Nacimiento", "Edad", "Situacion Invalidez", "Ind Est",
      "Estado Pension", "Tiene CS", "Tiene CE", "Fecha Devengue", "Fecha Primer Pago"]
    const data = []
    //generamos el array con la informacion a mostrar
    for (let index = 0; index < dataList.length; index++) {
      const element = [dataList[index].N_Poliza, dataList[index].N_Orden
        , dataList[index].Tipo_Doc, dataList[index].N_Documento
        , dataList[index].Parentesco, dataList[index].Sexo
        , dataList[index].Beneficiario, dataList[index].Fec_Nacimiento
        , dataList[index].Edad, dataList[index].Sit_Inv
        , dataList[index].Ind_Est, dataList[index].Est_Pension
        , dataList[index].Tiene_CS, dataList[index].Tiene_CE
        , dataList[index].Fec_Devengue, dataList[index].Fec_Primer_Pago
      ];
      data.push(element);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Datos Beneficiario');
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }//color letra
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    //se agrega la informacion 
    worksheet.addRows(data);
    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 45;
    worksheet.getColumn(8).width = 17;
    worksheet.getColumn(9).width = 15;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 15;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 15;
    worksheet.getColumn(15).width = 17;
    worksheet.getColumn(16).width = 17;
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name + '.xlsx');
    })
  }

  // Inicio Excel Pólizas Traspasadas
  generateExcelPolizasTrasp(dataList: any, dataListTP: any, dataListTR: any, dataListTM: any, d1: Date, d2: Date) {
    let name = "Reporte Polizas Traspasadas"

    //Excel Title, Header, Data
    const header = ["Nro. Póliza", "Fecha Trasp. Pri.", "Monto Prima (S./)", "Fecha Trasp. PP", "Fecha Vigencia", "CUSPP Afiliado",
      "Nombre", "Tipo Pensión", "Tipo Renta", "Años Dif", "Modal.",
      "Meses Gar.", "Meses Esc.", "A.F.P", "Pensión", , "Moneda", "Reajuste Trimestral"]

    function numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }

    const data = []
    //generamos el array con la informacion a mostrar
    for (let index = 0; index < dataList.length; index++) {
      const element = [dataList[index].NUM_POLIZA, dataList[index].FEC_TRASPASO
        , numberWithCommas(dataList[index].MTO_PRICIA), dataList[index].FEC_TRAPAGOPEN
        , dataList[index].FEC_VIGENCIA, dataList[index].COD_CUSPP
        , dataList[index].NOMBRE, dataList[index].COD_TIPPENSION
        , dataList[index].COD_TIPREN, dataList[index].ANIOSDIF
        , dataList[index].COD_MODALIDAD, dataList[index].NUM_MESGAR
        , dataList[index].NUM_MESESC, dataList[index].NOM_AFP
        , dataList[index].SimboloMoneda, numberWithCommas(dataList[index].MTO_PENSION)
        , dataList[index].SimboloAjustado, dataList[index].MTO_VALREAJUSTETRI
      ];
      data.push(element);
    }

    var elementm= "";
    for (let index = 0; index < dataListTM.length; index++) {
      elementm += [dataListTM[index].TIPO] + " / ";
    }

    var elementtp = "";
    for (let index = 0; index < dataListTP.length; index++) {
      elementtp += [dataListTP[index].TIPO] + " / ";
    }
    //datatp.push(elementtp);

    var elementr = "";
    for (let index = 0; index < dataListTR.length; index++) {
      elementr += [dataListTR[index].TIPO] + " / ";
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Polizas_Traspasadas');

    let currentDate = new Date();

    worksheet.addRow(["Compañía de Seguros de Vida Cámara S.A.", , , , , , , , , , , , , , , , , "Fecha : " + moment(currentDate).format('DD/MM/YYYY').toString()]).font = { name: 'times new roman', family: 4, size: 12, italic: true };
    worksheet.mergeCells('A1:D1');
    // worksheet.addRow([]).font = { name: 'times new roman', family: 4, size: 10, italic: true };
    // worksheet.mergeCells('Q1:R1');
    worksheet.addRow(["División Seguros"]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    worksheet.mergeCells('A2:D2');

    let titleRow = worksheet.addRow(["INFORME DE CONSULTA DE PÓLIZAS TRASPASADAS"]);
    titleRow.font = { name: 'times new roman', family: 4, size: 16, underline: 'single', bold: true }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3:R3');

    worksheet.addRow(["Periodo: " + moment(d1).format('DD/MM/YYYY').toString() + " * " + moment(d2).format('DD/MM/YYYY').toString()]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    worksheet.mergeCells('A4:C4');
    //Add Header Row
    let headerRow = worksheet.addRow(header);
    //Filtros de encabezado
    worksheet.autoFilter = 'A5:R5';

    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }, //color letra
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    //se agrega la informacion 
    data.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let nombre = row.getCell(1);
      nombre.alignment = { vertical: 'top', horizontal: 'right' };
      nombre = row.getCell(2);
      nombre.alignment = { vertical: 'middle', horizontal: 'center' };
      nombre = row.getCell(3);
      nombre.alignment = { vertical: 'top', horizontal: 'right' };
      nombre = row.getCell(4);
      nombre.alignment = { vertical: 'middle', horizontal: 'center' };
      nombre = row.getCell(5);
      nombre.alignment = { vertical: 'middle', horizontal: 'center' };
      nombre = row.getCell(6);
      nombre.alignment = { vertical: 'top', horizontal: 'left' };
      nombre = row.getCell(7);
      nombre.alignment = { vertical: 'top', horizontal: 'left' };
      nombre = row.getCell(10);
      nombre.alignment = { vertical: 'top', horizontal: 'right' };
      nombre = row.getCell(12);
      nombre.alignment = { vertical: 'top', horizontal: 'right' };
      nombre = row.getCell(13);
      nombre.alignment = { vertical: 'top', horizontal: 'right' };
      nombre = row.getCell(14);
      nombre.alignment = { vertical: 'top', horizontal: 'left' };
      nombre = row.getCell(15);
      nombre.alignment = { vertical: 'top', horizontal: 'left' };
      nombre = row.getCell(16);
      nombre.alignment = { vertical: 'top', horizontal: 'right' };
      nombre = row.getCell(18);
      nombre.alignment = { vertical: 'top', horizontal: 'right' };
    }
    );

    worksheet.mergeCells('O5:P5');

    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 45;
    worksheet.getColumn(8).width = 17;
    worksheet.getColumn(9).width = 15;
    worksheet.getColumn(10).width = 14;
    worksheet.getColumn(11).width = 14;
    worksheet.getColumn(12).width = 14;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 22;
    worksheet.getColumn(15).width = 6;
    worksheet.getColumn(16).width = 14;
    worksheet.getColumn(17).width = 17;
    worksheet.getColumn(18).width = 22;

    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow(["Tipo de Pensión:", elementtp]).font = { name: 'times new roman', family: 4, size: 12, italic: true };
    worksheet.mergeCells('B' + worksheet.rowCount.toString() + ':R' + worksheet.rowCount.toString());
    worksheet.addRow(["Tipo de Renta:", elementr]).font = { name: 'times new roman', family: 4, size: 12, italic: true };
    worksheet.mergeCells('B' + worksheet.rowCount.toString() + ':R' + worksheet.rowCount.toString());
    worksheet.addRow(["Tipo de Modalidad:", elementm]).font = { name: 'times new roman', family: 4, size: 12, italic: true };
    worksheet.mergeCells('B' + worksheet.rowCount.toString() + ':R' + worksheet.rowCount.toString());
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow(["Sistema Previsional"]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    worksheet.addRow(["Producción"]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name + '.xlsx');
    })
  }
  // Fin Excel Pólizas Traspasadas

  // Inicio Excel Pensión Actualizada
  generateExcelPensionAct(dataList: any, dataListInfo: any) {
    let name = "2 - Mantención de Antecedentes del Pensionado - Pen Act"

    //Excel Title, Header, Data
    const header = ["Fecha Actualización", "Monto Pensión Act."]

    function numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }

    const dataPensionAct = []
    //generamos el array con la informacion a mostrar
    for (let index = 0; index < dataList.length; index++) {
      const element = [dataList[index].FEC_DESDE, numberWithCommas(dataList[index].MTO_PENSION)];
      dataPensionAct.push(element);
    }
    
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Pension_Act');

    let currentDate = new Date();

    worksheet.addRow(["Compañía de Seguros de Vida Cámara S.A."]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    worksheet.mergeCells('A1:D1');
    worksheet.addRow(["División Seguros"]).font = { name: 'times new roman', family: 4, size: 12, italic: true };
    worksheet.mergeCells('A2:D2');

    let titleRow = worksheet.addRow(["INFORME DE CONSULTA DE ACTUALIZACIÓN DE PENSIONES"]);
    titleRow.font = { name: 'times new roman', family: 4, size: 16, underline: 'single', bold: true }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3:J3');
    worksheet.addRow([]);
    worksheet.addRow(["a) Datos Generales"]).font = { name: 'times new roman', family: 4, size: 14, italic: false, bold: true };
    worksheet.addRow([,"Nro. Póliza:", dataListInfo[0].NUM_POLIZA,,,,,,,"Nro. Endoso:", dataListInfo[0].NUM_ENDOSO]).font = { name: 'times new roman', family: 4, size: 12, italic: false };
    worksheet.addRow(["Tipo de Pensión:", dataListInfo[0].TIPPENSION]).font = { name: 'times new roman', family: 4, size: 12, italic: false };
    worksheet.addRow(["Tipo de Renta:", dataListInfo[0].TIPRENTA]).font = { name: 'times new roman', family: 4, size: 12, italic: false };
    worksheet.addRow(["Tipo de Modalidad:", dataListInfo[0].TIPMODALIDAD]).font = { name: 'times new roman', family: 4, size: 12, italic: false };
    worksheet.addRow(["Fecha Vigencia Póliza:", dataListInfo[0].FEC_VIGENCIA]).font = { name: 'times new roman', family: 4, size: 12, italic: false };
    worksheet.addRow(["Fecha de Devengue:", dataListInfo[0].FEC_DEV]).font = { name: 'times new roman', family: 4, size: 12, italic: false };
    worksheet.addRow(["Tipo Moneda:", dataListInfo[0].SimboloAjustado]).font = { name: 'times new roman', family: 4, size: 12, italic: false };
    worksheet.addRow([]);
    worksheet.addRow(["b) Pensiones Actualizadas"]).font = { name: 'times new roman', family: 4, size: 14, italic: false, bold: true };

    //Add Header Row
    let headerRow = worksheet.addRow(header);
    //Filtros de encabezado
    worksheet.autoFilter = 'A15:B15';

    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }, //color letra
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    //se agrega la informacion 
    dataPensionAct.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let nombre = row.getCell(1);
      nombre.alignment = { vertical: 'middle', horizontal: 'center' };
      nombre = row.getCell(2);
      nombre.alignment = { vertical: 'top', horizontal: 'right' };
    }
    );

    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 22;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(9).width = 13;

    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow(["Sistema Previsional"]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    worksheet.addRow(["Pago de Pensiones"]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name + '.xlsx');
    })
  }
  // Fin Excel Pólizas Traspasadas
  generateExcelConsultaPlanillaMensualRRVV(dataList: any, name: string) {
    //Excel Title, Header, Data
    const header = ["CIA", "Numero Interno Poliza", "AFP", 
                    "CUSPP", "Nombre Afiliado",

                    "Tipo de beneficiario", "Nombre Beneficiario", "Tipo de Documento",
                    "Número de Documento", "Fecha de nacimiento", "Sexo Beneficiario",
                    "Fecha vigencia de continuidad de estudios", "Inválido permanente",
                    
                    "Cobrante (Persona que cobra)", "Tipo de Documento cobrante","Número de Documento cobrante", 
                    
                    "PRESTACION","COB. PAGADA","MODALIDAD","Fecha de fin de período garantizado","Moneda de Pago","Característica Moneda ","Gratificacion",                  
                  
                    "TIPO DE PAGO","DEV","Monto bruto a pagar","Monto de retención ESSALUD","Monto de Retencion Judicial",
                    "Monto de otras retenciones","Monto neto a pagar","Mes de Pago","OBSERVACION",                  
                  
                    "FORMA PAGO","TIPO CUENTA","NRO. CUENTA",
                    "CCI","BANCO","FECHA DE TRANSFERENCIA"]

    const data = []
    function numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    //generamos el array con la informacion a mostrar
    for (let index = 0; index < dataList.length; index++) {
      let Fecha_Vig_Con_Estudios= moment(dataList[index].Fecha_Vig_Con_Estudios).format('DD/MM/YYYY').toString();
      if(Fecha_Vig_Con_Estudios=='Invalid date'){
        Fecha_Vig_Con_Estudios = '';
      }
      let Fecha_fin_período_garantizado= moment(dataList[index].Fecha_fin_período_garantizado).format('DD/MM/YYYY').toString();
      if(Fecha_fin_período_garantizado=='Invalid date'){
        Fecha_fin_período_garantizado ='';
      }
      let FECHA_TRANSFERENCIA=moment(dataList[index].FECHA_TRANSFERENCIA).format('DD/MM/YYYY').toString();
      if(FECHA_TRANSFERENCIA == 'Invalid date'){
        FECHA_TRANSFERENCIA = '';
      }
      const element = [dataList[index].CIA, dataList[index].NUM_POLIZA,dataList[index].AFP,
                        //Seccion Titular
                        dataList[index].CUSPP,
                        dataList[index].Afiliado,
                        //Seccion Beneficiario
                        dataList[index].Tipo_Beneficiario,
                        dataList[index].Beneficiario,
                        dataList[index].Tipo_Documento,
                        dataList[index].Numero_Documento,
                        moment(dataList[index].Fecha_Nacimiento).format('DD/MM/YYYY').toString(),
                        dataList[index].Sexo,
                        Fecha_Vig_Con_Estudios,
                        dataList[index].Invalido_Permanente,
                        //Seccion Cobrante
                        dataList[index].Cobrante,
                        dataList[index].Cobrante_Tipo_Documento,
                        dataList[index].Cobrante_Numero_Documento,
                        //Seccion Prestacion
                        dataList[index].Prestacion,
                        dataList[index].COB_PAGADA,
                        dataList[index].MODALIDAD,
                        Fecha_fin_período_garantizado,
                        dataList[index].Moneda,
                        dataList[index].Caracteristica_Moneda,
                        dataList[index].Gratificacion,
                        //Seccion de PAGO
                        dataList[index].TIPO_PAGO,
                        dataList[index].DEV,
                        numberWithCommas(dataList[index].Monto_bruto_total),
                        numberWithCommas(dataList[index].ESSALUD),
                        numberWithCommas(dataList[index].Monto_Retencion_Judicial),
                        numberWithCommas(dataList[index].Monto_otras_retenciones),
                        numberWithCommas(dataList[index].Monto_neto_pagar),
                        dataList[index].MES,
                        dataList[index].Observacion,
                        //seccion FORMA DE PAGO	
                        dataList[index].FORMA_PAGO,
                        dataList[index].Tipo_Cuenta,
                        dataList[index].Numero_Cuena,
                        dataList[index].Numero_CCI,
                        dataList[index].BANCO,
                        FECHA_TRANSFERENCIA
                         ];

      data.push(element);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('PLANILLA RRVV');

    
    let encabezado = worksheet.addRow(["","","","TITULAR",,"BENEFICIARIO",,,,,,,,"COBRANTE",,,"PRESTACION",,,,,,,"PAGO",,,,,,,,,"FORMA DE PAGO"]);
    encabezado.font = { name: 'Calibri', family: 4, size: 10, bold: true }
    worksheet.mergeCells('A1:C1');
    worksheet.mergeCells('D1:E1');
    worksheet.mergeCells('F1:M1');
    worksheet.mergeCells('N1:P1');
    worksheet.mergeCells('Q1:W1');
    worksheet.mergeCells('X1:AF1');
    worksheet.mergeCells('AG1:AL1');

    encabezado.eachCell((cell, number) => {      
      if (number>3){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'CDD0D3' },//fondo de celda
          //bgColor: { argb: 'FF0000FF' }//color letra
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }      
    })

    //Add Header Row
    let headerRow = worksheet.addRow(header);
    //Filtros de encabezado
    worksheet.autoFilter = 'A2:AL2';
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }//color letra
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    })

    data.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let centradoCelda = row.getCell(3);
      centradoCelda.alignment = { vertical: 'middle', horizontal: 'left' };
      centradoCelda = row.getCell(5);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(6);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(7);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(14);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(17);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(18);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(19);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(21);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(33);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(34);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
      centradoCelda = row.getCell(37);
      centradoCelda.alignment = { vertical: 'top', horizontal: 'left' };
    }
    );

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 25;

    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 50;

    worksheet.getColumn(6).width = 25;
    worksheet.getColumn(7).width = 50;
    worksheet.getColumn(8).width = 25;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 25;
    worksheet.getColumn(11).width = 25;
    worksheet.getColumn(12).width = 50;
    worksheet.getColumn(13).width = 25;

    worksheet.getColumn(14).width = 50;
    worksheet.getColumn(15).width = 50;
    worksheet.getColumn(16).width = 50;

    worksheet.getColumn(17).width = 30;
    worksheet.getColumn(18).width = 60;
    worksheet.getColumn(19).width = 50;
    worksheet.getColumn(20).width = 40;
    worksheet.getColumn(21).width = 25;
    worksheet.getColumn(22).width = 25;
    worksheet.getColumn(23).width = 25;

    worksheet.getColumn(24).width = 25;
    worksheet.getColumn(25).width = 25;
    worksheet.getColumn(26).width = 25;
    worksheet.getColumn(27).width = 35;
    worksheet.getColumn(28).width = 35;
    worksheet.getColumn(29).width = 35;
    worksheet.getColumn(30).width = 25;
    worksheet.getColumn(31).width = 25;
    worksheet.getColumn(32).width = 25;

    worksheet.getColumn(33).width = 25;
    worksheet.getColumn(34).width = 25;
    worksheet.getColumn(35).width = 25;
    worksheet.getColumn(36).width = 25;
    worksheet.getColumn(37).width = 40;
    worksheet.getColumn(38).width = 30;
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, name + '.xlsx');
    })
  }
  generateExcelValidaciones(periodo:string ,FecHasta:string, dataListEstudios: any,dataListHijos: any,dataListSupervivencia: any,dataListTutores: any,FechaInicio:string ,FechaFin:string ) {
    //Excel Title, Header, Data
    const data = []
    const data2 = []
    const data3= []
    const data4 = []
    //data para el primer hoja
    //generamos el array con la informacion a mostrar
    //primer hoja Reporte de Certificado de Estudios por Caducar
    for (let index = 0; index < dataListEstudios.length; index++) {//dataList.length
      const element = [dataListEstudios[index].NUM_POLIZA,
      dataListEstudios[index].NUM_ORDEN,dataListEstudios[index].TIPO_DOC,dataListEstudios[index].NUM_IDENBEN,
      dataListEstudios[index].PARENTESCO,dataListEstudios[index].Beneficiario,
      moment(dataListEstudios[index].Inicio_Certif).format('DD/MM/YYYY').toString()
      ,moment(dataListEstudios[index].Fin_Certif).format('DD/MM/YYYY').toString() ];
      data.push(element);
    }
    ///segunda hoja Reporte de Hijos que cumplen la Mayoria de Edad
    for (let index = 0; index < dataListHijos.length; index++) {
      const element = [dataListHijos[index].NUM_POLIZA,
      dataListHijos[index].Num_orden,
      dataListHijos[index].TIPO_DOC,
      dataListHijos[index].NUM_DOC,
      dataListHijos[index].PARENTESCO,
      dataListHijos[index].cod_sexo,
      dataListHijos[index].Beneficiario,
      moment(dataListHijos[index].FEC_NAC).format('DD/MM/YYYY').toString(),
      dataListHijos[index].Fecha_Cumple18];
     // dataListHijos[index].Edad,
     // dataListHijos[index].Sit_Inv,
     // dataListHijos[index].Ind_Est,
    // dataListHijos[index].Est_Pension,
      // dataListHijos[index].SwTieneCertificadoSobrevivencia,
      //dataListHijos[index].SwTieneCertificadoEstudio,
     // moment( dataListHijos[index].Fec_Devengue).format('DD/MM/YYYY').toString(),
     // moment( dataListHijos[index].Fec_Primer_Pago).format('DD/MM/YYYY').toString()];
      data2.push(element);
    }
    ///tercer hoja Certificado de Supervenvivencia por caducar
    for (let index = 0; index < dataListSupervivencia.length; index++) {
      const element = [dataListSupervivencia[index].NUM_POLIZA,
      dataListSupervivencia[index].NUM_ORDEN,dataListSupervivencia[index].TIPO_DOC,dataListSupervivencia[index].NUM_IDENBEN,
      dataListSupervivencia[index].PARENTESCO,dataListSupervivencia[index].Beneficiario,
      moment(dataListSupervivencia[index].Inicio_Certif).format('DD/MM/YYYY').toString()
      ,moment(dataListSupervivencia[index].Fin_Certif).format('DD/MM/YYYY').toString()];
      data3.push(element);
    }
    ///cuarta hoja Vencimiento de tutores
    for (let index = 0; index < dataListTutores.length; index++) {
      const element = [dataListTutores[index].Num_Poliza,
      dataListTutores[index].TIPO_PENSION,
      dataListTutores[index].TIPO_IDEN_RECEPTOR,
      dataListTutores[index].NUM_RECEPTOR,
      dataListTutores[index].NUM_ORDEN,
      dataListTutores[index].Receptor,
      moment(dataListTutores[index].VIGENCIA_PODER_DESDE).format('DD/MM/YYYY').toString(),
      moment(dataListTutores[index].VIGENCIA_PODER_HASTA).format('DD/MM/YYYY').toString(),
      dataListTutores[index].TIPO_IDENT,
      dataListTutores[index].NUM_IDENTUT,
      dataListTutores[index].NOMBRE_TUTOR];
      data4.push(element);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    ///
    ///primer hoja Reporte de Certificado de Estudios por Caducar
    ///
    let worksheet = workbook.addWorksheet('Cert Estudios Por Cad');


    let encabezado =worksheet.addRow(["Reporte de Certificado de Estudios por Caducar"]);
    encabezado.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    worksheet.mergeCells('A1:D1');
    worksheet.addRow();
    encabezado =worksheet.addRow(["Mes de Vencimiento del Certificado "+FechaInicio + " - " + FechaFin]);
    encabezado.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    worksheet.mergeCells('A3:D3');
    worksheet.addRow();
    //Add Header Row
    const header = ["Nº Poliza", "Nº Orden","Tipo Doc","Nº Documento","Parentesco","Beneficiario","Inicio Certif","Fin Certif"]
    let headerRow = worksheet.addRow(header);
    //Filtros de encabezado
    worksheet.autoFilter = 'A5:H5';
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FFFFFF' }//color letra
      },
      cell.font = {
        name: 'Calibri',
        sz: 11,
        pattern: 'solid',
    		color: {argb:'FFFFFF'},
    		bold: true,
    		italic: false,
    		underline: false
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    //se agrega la informacion 
    data.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let alineamiento = row.getCell(5);
      alineamiento.alignment = { vertical: 'middle', horizontal: 'left' };
      alineamiento = row.getCell(6);
      alineamiento.alignment = { vertical: 'middle', horizontal: 'left' };
    }
    );
    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 14;
    worksheet.getColumn(2).width = 12;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 24;
    worksheet.getColumn(6).width = 50;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;

    ///
    ///segunda hoja Reporte de Hijos que cumplen la Mayoria de Edad
    ///
    worksheet = workbook.addWorksheet('Beneficiarios por Cumplir 18');

    encabezado =worksheet.addRow(["Reporte de Hijos que cumplen la Mayoria de Edad"]);
    encabezado.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    worksheet.mergeCells('A1:D1');
    worksheet.addRow();
    encabezado =worksheet.addRow(["Periodo en el que cumplen la Mayoria "+FechaInicio + " - " + FechaFin]);
    encabezado.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    worksheet.mergeCells('A3:D3');
    worksheet.addRow();
    //Add Header Row
    const header2 = ["Nº Poliza", "Nº Orden","Tipo Doc","Nº Documento","Parentesco","Sexo","Beneficiario","Fec Nacimiento","Fecha de Cumplimiento de 18 años"]
    headerRow = worksheet.addRow(header2);
     //Filtros de encabezado
     worksheet.autoFilter = 'A5:I5';
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }//color letra
      },
      cell.font = {
        name: 'Calibri',
        sz: 11,
        pattern: 'solid',
    		color: {argb:'FFFFFF'},
    		bold: true,
    		italic: false,
    		underline: false
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      
    })
    //se agrega la informacion 
    data2.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let alineamiento = row.getCell(7);
      alineamiento.alignment = { vertical: 'middle', horizontal: 'left' };
    });
    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 14;
    worksheet.getColumn(2).width = 12;
    worksheet.getColumn(3).width = 14;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 50;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 10;
    //worksheet.getColumn(10).width = 10;
    //worksheet.getColumn(11).width = 10;
    //worksheet.getColumn(12).width = 14;
    //worksheet.getColumn(13).width = 14;
    //worksheet.getColumn(14).width = 14;
    //worksheet.getColumn(15).width = 15;
    //worksheet.getColumn(16).width = 20;


    ///
    ///tercer hoja Certificado de Supervenvivencia por caducar
    ///
    worksheet = workbook.addWorksheet('Cert de Supervenvivencia Cad');
    encabezado =worksheet.addRow(["Reporte de Certificado de Superviviencia por Caducar"]);
    encabezado.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    worksheet.mergeCells('A1:D1');
    worksheet.addRow();
    encabezado =worksheet.addRow(["Mes de Vencimiento del Certificado "+FechaInicio + " - " + FechaFin]);
    encabezado.font = { name: 'Calibri', family: 4, size: 11, bold: true }
    worksheet.mergeCells('A3:D3');
    worksheet.addRow();
    //Add Header Row
    const header3 = ["Nº Poliza", "Nº Orden","Tipo Doc","Nº Documento","Parentesco","Beneficiario","Inicio Certif","Fin Certif"]
    headerRow = worksheet.addRow(header3);
    //Filtros de encabezado
    worksheet.autoFilter = 'A5:H5';
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }//color letra
      },
      cell.font = {
        name: 'Calibri',
        sz: 11,
        pattern: 'solid',
    		color: {argb:'FFFFFF'},
    		bold: true,
    		italic: false,
    		underline: false
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    //se agrega la informacion 
    data3.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let alineamiento = row.getCell(5);
      alineamiento.alignment = { vertical: 'middle', horizontal: 'left' };
      alineamiento = row.getCell(6);
      alineamiento.alignment = { vertical: 'middle', horizontal: 'left' };
    }
    );
    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 14;
    worksheet.getColumn(2).width = 12;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 24;
    worksheet.getColumn(6).width = 50;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;


    ///
    ///cuarta hoja Vencimiento de tutores
    ///
    worksheet = workbook.addWorksheet('Vencimiento de Tutores');


    let currentDate = new Date();
    worksheet.addRow();
    let fila1 = worksheet.addRow(["Compañía de Seguros de Vida Cámara S.A.", , , , , , , , , , "Fecha : " + moment(currentDate).format('DD/MM/YYYY').toString()]);
    worksheet.mergeCells('A2:D2');
    fila1.font = { name: 'times new roman', family: 4, size: 12, italic: true}
    let fila1Estilo = fila1.getCell(11);
    fila1Estilo.alignment = { vertical: 'top', horizontal: 'right' };


    worksheet.addRow();
    worksheet.addRow(["División Seguros"]).font = { name: 'times new roman', family: 4, size: 12, italic: true };
    worksheet.mergeCells('A4:D4');

    let titleRow = worksheet.addRow(["INFORME DE VENCIMIENTOS DE TUTORES"]);
    titleRow.font = { name: 'times new roman', family: 4, size: 16, underline: 'single', bold: true }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A5:K5');
    worksheet.addRow();
    //variables a recibir
    //let tipo='P';
    //let tipoDes = "DEFINITIVO"
    //if (tipo === "P") {
     // tipoDes = "PROVISORIO"
    //}
    //let Row = worksheet.addRow([tipoDes]);
    //Row.font = { name: 'times new roman', family: 4, size: 12 }
    //Row.alignment = { vertical: 'bottom', horizontal: 'right' };
    //worksheet.mergeCells('A7:K7');

    worksheet.addRow(["Periodo: " + FechaInicio+ " * " + FechaFin]).font = { name: 'times new roman', family: 4, size: 12, italic: true };
    worksheet.mergeCells('A8:C8');
    worksheet.addRow();

    //Add Header Row
    const header4 = ["PÓLIZA", "TIPO PENSIÓN" , "TIPO IDENT.","Nº IDENT.","Nº ORDEN","NOMBRE","VIGENCIA PODER DESDE","VIGENCIA PODER HASTA","TIPO IDENT. RECEPTOR","Nº IDENT. RECEPTOR","NOMBRE RECEPTOR",]
    headerRow = worksheet.addRow(header4);
    //Filtros de encabezado
    worksheet.autoFilter = 'A10:K10';
    //se edita los colores del header
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0090B2' },//fondo de celda
        bgColor: { argb: 'FF0000FF' }//color letra
      },
      cell.font = {
        name: 'Calibri',
        sz: 11,
        pattern: 'solid',
    		color: {argb:'FFFFFF'},
    		bold: true,
    		italic: false,
    		underline: false
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    //se agrega la informacion 
    data4.forEach(d => {
      let row = worksheet.addRow(d);
      //centrar la info
      row.alignment = { vertical: 'middle', horizontal: 'center' };

      let alineamiento = row.getCell(6);
      alineamiento.alignment = { vertical: 'middle', horizontal: 'left' };
      alineamiento = row.getCell(11);
      alineamiento.alignment = { vertical: 'middle', horizontal: 'left' };
    }
    );

    // Add Data and Conditional Formatting
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(6).width = 50;
    worksheet.getColumn(7).width = 25;
    worksheet.getColumn(8).width = 25;
    worksheet.getColumn(9).width = 23;
    worksheet.getColumn(10).width = 23;
    worksheet.getColumn(11).width = 50;

    worksheet.addRow();
    worksheet.addRow();
    worksheet.addRow(["Sistema Previsional"]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    worksheet.addRow(["Pago de Pensiones"]).font = { name: 'times new roman', family: 4, size: 14, italic: true };
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'validaciones.xlsx');
    })
  }
}

