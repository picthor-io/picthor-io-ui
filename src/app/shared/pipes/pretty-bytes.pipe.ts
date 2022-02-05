import { Pipe, PipeTransform } from '@angular/core';
import * as prettyBytes from 'pretty-bytes';

@Pipe({ name: 'appPrettyBytes' })
export class AppPrettyBytesPipe implements PipeTransform {
  transform(value?: number): string {
    if(!value) return '';

    return prettyBytes(value);
  }
}
