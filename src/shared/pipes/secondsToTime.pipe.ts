import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SecondsToTime'
})

export class SecondsToTimePipe implements PipeTransform {
  transform(seconds: number): number {
    return new Date(1970, 0, 1).setSeconds(seconds);
  }
}