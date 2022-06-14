import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})

export class generarAchivoCSV{
    constructor( private http: HttpClient ) { }

    archivoDatosBeneficiario( buffer: any ,name: string) {
      var texto = [];
      //generando la cabecera
      texto.push('Número de Póliza;Nro. de Endoso;Cód. AFP;Tipo de Pensión;Cód. Estado;Cód. Tipo de Renta;Cód. Modalidad;Nro. de Beneficiarios;')
      texto.push('Fecha de Vigencia;Fecha de Termino de Vigencia;Monto Prima;Monto Pensión;Nro. Meses Diferidos;Nro. Meses Garantizados;Tasa Costo Equivalente;')
      texto.push('Tasa de Venta;Tasa Costo Reaseguro;Tasa Interés Periodo Garantizado;Fecha de Inicio de Pago Pensión;Cód. Moneda;Cód. Tipo Reajuste;');
      texto.push('Factor Ajuste Trimestral;Factor Ajuste Mensual;Nro. Meses Escalonada 1er. Tramo;Prc. Renta Escalonada 2do. Tramo;');
      texto.push('Fecha Termino Escalonada 1er. Tramo;Nro. de Orden;Fecha de Ingreso;Tipo Documento;Nro. de Documento;Nombre Beneficiario;');
      texto.push('Segundo Nombre Beneficiario;Apellido Paterno Beneficiario;Apellido Materno Beneficiario;Código Dirección;Descripción Dirección;');
      texto.push('Descripción Distrito;Descripción Provincia;Descripción Departamento;Teléfono1;Teléfono2;Teléfono3;Correo 1;Correo 2;Correo 3;');
      texto.push('Cód. Grupo Familiar;Cód. Parentesco;Cód. Sexo;Cód. Situación Invalidez;Cód. Derecho a Crecer;Cód. Derecho a Pensión;');
      texto.push('Cód. Causal de Invalidez.;Fecha de Nacimiento;Fecha Nacimiento Hijo Menor;Fecha Invalidez;Cód. Motivo Requisito Pensión;');
      texto.push('Monto Pensión;Monto Pensión Garantizada;Porc. Pensión;Cód. Institución de Salud;Cód. Modalidad de Salud;Monto Plan Salud;');
      texto.push('Cód. Estado Pensión;Cód. Vía de Pago;Cód. de Banco;Cód. Tipo de Cuenta;Nro. de Cuenta;Nro Cta CCI;Cód. Sucursal AFP;Fecha de Fallecimiento;');
      texto.push('Cód. de Causa de Suspensión;Fecha de Suspensión;Fecha de Inicio Pago Pensión;Fecha de Término de Pago Pensión Garantizada;');
      texto.push('\n');
      for (let index = 0; index < buffer.length; index++) {
        //const element = buffer[index].col1;
        texto.push(buffer[index].vlNumPoliza +";");
        texto.push(buffer[index].vlNumEndoso+";");
        texto.push(buffer[index].vlCodAFP+";");
        texto.push(buffer[index].vlCodTipPension+";");
        texto.push(buffer[index].vlCodEstado+";");
        texto.push(buffer[index].vlCodTipRen+";");
        texto.push(buffer[index].vlCodModalidad+";");
        texto.push(buffer[index].vlNumCargas+";");
        texto.push(buffer[index].vlFecVigencia+";");
        texto.push(buffer[index].vlFecTerVigencia+";");
        texto.push(buffer[index].vlMtoPrima+";");
        texto.push(buffer[index].vlMtoPension+";");
        texto.push(buffer[index].vlNumMesDif+";");
        texto.push(buffer[index].vlNumMesGar+";");
        texto.push(buffer[index].vlPrcTasaCe+";");
        texto.push(buffer[index].vlPrcTasaVta+";");
        texto.push(buffer[index].vlPrcTasaCtoRea+";");
        texto.push(buffer[index].vlPrcTasaIntPerGar+";");
        texto.push(buffer[index].vlFecIniPagoPen+";");
        texto.push(buffer[index].vlCodMoneda+";");
        texto.push(buffer[index].vlCodTipoReajuste+";");
        texto.push(buffer[index].vlFactorAjusteTri+";");
        texto.push(buffer[index].vlFactorAjusteMen+";");
        texto.push(buffer[index].vlNumMesEsc+";");
        texto.push(buffer[index].vlPrcRentaEsc+";");
        texto.push(buffer[index].vlFecTerPagoPriTramoEsc+";");
        texto.push(buffer[index].vlNumOrden+";");
        texto.push(buffer[index].vlFecIngreso+";");
        texto.push(buffer[index].vlCodTipoIdenBen+";");
        texto.push(buffer[index].vlNumIden+";");
        texto.push(buffer[index].vlGlsNomBen+";");
        texto.push(buffer[index].vlGlsSegNomBen+";");
        texto.push(buffer[index].vlGlsPatBen+";");
        texto.push(buffer[index].vlGlsMatBen+";");
        texto.push(buffer[index].vlCodDireccion+";");
        texto.push(buffer[index].vlGlsDirBen+";");
        texto.push(buffer[index].vlGlsComuna+";");
        texto.push(buffer[index].vlGlsProvincia+";");
        texto.push(buffer[index].vlGlsRegion+";");
        texto.push(buffer[index].vlGlsFonoBen+";");
        texto.push(buffer[index].vgRegistroGLS_FONO2+";");
        texto.push(buffer[index].vgRegistroGLS_FONO3+";");
        texto.push(buffer[index].vlGlsCorreoBen+";");
        texto.push(buffer[index].vgRegistroGLS_Correo2+";");
        texto.push(buffer[index].vgRegistroGLS_Correo3+";");
        texto.push(buffer[index].vlCodGruFam+";");
        texto.push(buffer[index].vlCodPar+";");
        texto.push(buffer[index].vlCodSexo+";");
        texto.push(buffer[index].vlCodSitInv+";");
        texto.push(buffer[index].vlCodDerCre+";");
        texto.push(buffer[index].vlCodDerpen+";");
        texto.push(buffer[index].vlCodCauInv+";");
        texto.push(buffer[index].vlFecNacBen+";");
        texto.push(buffer[index].vlFecNacHM+";");
        texto.push(buffer[index].vlFecInvBen+";");
        texto.push(buffer[index].vlCodMotReqPen+";");
        texto.push(buffer[index].vlMtoPensionB+";");
        texto.push(buffer[index].vlMtoPensionGar+";");
        texto.push(buffer[index].vlPrcPension+";");
        texto.push(buffer[index].vlCodInsSalud+";");
        texto.push(buffer[index].vlCodModSalud+";");
        texto.push(buffer[index].vlMtoPlanSalud+";");
        texto.push(buffer[index].vlCodEstPension+";");
        texto.push(buffer[index].vlCodViaPago+";");
        texto.push(buffer[index].vlCodBanco+";");
        texto.push(buffer[index].vlCodTipCuenta+";");
        texto.push(buffer[index].vlNumCuenta+";");
        texto.push(buffer[index].vgRegistroNum_Cuenta_CCI+";");
        texto.push(buffer[index].vlCodSucursal+";");
        texto.push(buffer[index].vlFecFallBen+";");
        texto.push(buffer[index].vlCodCauSusBen+";");
        texto.push(buffer[index].vlFecSusBen+";");
        texto.push(buffer[index].vlFecIniPagoPenB+";");
        texto.push(buffer[index].vlFecTerPagoPenGarB+";");

        texto.push('\n');
      }
        let file = new Blob(texto, { type: "text/csv;charset=utf-8" });//formato CSV
        FileSaver(file, name+".csv")
        
    }
}