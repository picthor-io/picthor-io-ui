import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Pipe({ name: 'appDate' })
export class AppDatePipe implements PipeTransform {
  transform(input?: string | Date | null, pattern: string = 'yyyy-MM-dd HH:mm:ss'): string {
    if (input == null) {
      return '';
    }

    let date;
    if (!(input instanceof Date)) {
      date = parseISO(input);
    } else {
      date = input;
    }
    return format(date, pattern);
  }
}
