import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorMessage',
})
export class ErrorMessagePipe implements PipeTransform {
  transform(error: { key: string; value: any }): string {
    let msg = '';
    switch (error.key.toLowerCase()) {
      case 'notnull':
        msg = `This field is required`;
        break;
      case 'required':
        msg = `This field is required`;
        break;
      case 'pattern':
        msg = `Invalid format`;
        break;
      case 'maxlength':
        msg = `Value too long. Max length: ` + error.value.requiredLength;
        break;
      case 'minlength':
        msg = `Value too short. Min length: ` + error.value.requiredLength;
        break;
      case 'nxminnum':
        msg = `Number too low. Min value: ` + error.value.requiredMin;
        break;
      case 'nxmaxnum':
        msg = `Number too low. Min value: ` + error.value.requiredMax;
        break;
      case 'mustmatch':
        msg = `Values must match`;
        break;
      case 'email':
        msg = `Email address is not valid`;
        break;
      case 'emailnotavailable':
        msg = `Email address is already taken`;
        break;
      case 'age':
        msg =
          'Age is invalid. ' + error.value.type + ' age: ' + error.value.required + ', actual: ' + error.value.actual;
        break;
      default:
        if (typeof error.value === 'string') {
          msg = error.value;
        } else {
          console.log('Error not mapped: ' + error);
        }
        break;
    }
    return msg;
  }
}
