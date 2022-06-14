import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiciofechaService {

  constructor() { }

  format(date: Date): string {
    // console.log(date);
    let day: string = date.getDate().toString();
    day = +day < 10 ? '0' + day : day;
    let month: string = (date.getMonth() + 1).toString();
    month = +month < 10 ? '0' + month : month;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatGuion(date: Date): string {
    // console.log(date);
    let day: string = date.getDate().toString();
    day = +day < 10 ? '0' + day : day;
    let month: string = (date.getMonth() + 1).toString();
    month = +month < 10 ? '0' + month : month;
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  formatBD(date: Date): string {
    // console.log(date);
    let day: string = date.getDate().toString();
    day = +day < 10 ? '0' + day : day;
    let month: string = (date.getMonth() + 1).toString();
    month = +month < 10 ? '0' + month : month;
    let year = date.getFullYear().toString();
    return `${year}${month}${day}`;
  }

  fechaConv(fecha) {
    let date1 = fecha.split('/');
    let fechaConv = date1[1] + '/' + date1[0] + '/' + date1[2];
    return fechaConv;
  }
}
