import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idate'
})

export class IDatePipe implements PipeTransform {
  transform(value: number): string {
    let dt = new Date(value);
    return  this.pad(dt.getUTCDate(),2) + '/' + this.pad(dt.getUTCMonth()+1,2);
  }

  pad(n, width, z?) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}