import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'itime'
})

export class ItimePipe implements PipeTransform {
  transform(value: number): string {
    let dt = new Date(value);
    return this.pad(dt.getUTCHours(),2) + ':' + this.pad(dt.getUTCMinutes(),2);
  }

  pad(n, width, z?) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}