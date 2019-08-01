import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name:'duration'})
export class DurationPipe implements PipeTransform {
  transform(value: number, ...args: any[]) {
    const hours = Math.floor(value / 60);
    const minutes = value - hours * 60;

    if (hours == 0) {
      return minutes + "m";
    } else if (minutes == 0) {
      return hours + "h";
    } else {
      return hours + "h " + minutes + "m";
    }
  }
}