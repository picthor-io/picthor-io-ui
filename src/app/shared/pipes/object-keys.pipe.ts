import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'objectKeys' })
export class ObjectKeysPipe implements PipeTransform {
  transform(value: any): Array<{ key: string; value: string }> {
    const keys = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        keys.push({ key, value: value[key] });
      }
    }
    return keys;
  }
}
