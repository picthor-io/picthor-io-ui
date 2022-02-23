import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export class FormHelper {
  static bindErrorsToForm(responseErrors: any, form: FormGroup) {
    if (!responseErrors) {
      return;
    }
    for (const field of Object.keys(responseErrors)) {
      // handle sub form group errors returned such as products[2].name
      if (field.indexOf('[') !== -1) {
        const regex = /(.*)\[(\d*)]\.(.*)/gm;
        const match = regex.exec(field);
        if (match && match[1] && match[2] && match[3]) {
          const groupName = match[1];
          const controlIndex = Number(match[2]);
          const fieldName = match[3];
          const group = form.get(groupName) as FormArray;
          const control = group.controls[controlIndex].get(fieldName);
          if (control) {
            FormHelper.bindErrorsToControl(responseErrors[field], control);
          }
        }
      } else {
        FormHelper.bindErrorsToControl(responseErrors[field], form.controls[field]);
      }
    }
  }

  static bindErrorsToControl(responseErrors: any, control: AbstractControl | null) {
    if (control) {
      let errors = control.errors;
      if (!errors) {
        errors = {};
      }
      for (const error of responseErrors) {
        errors[error.code] = error.message;
      }
      control.setErrors(errors);
      control.markAsDirty();
    }
  }

  static formatErrorsMessage(responseErrors: any): string {
    let str = '';
    for (const field of Object.keys(responseErrors)) {
      for (const error of responseErrors[field]) {
        str += field + ': ' + error.message;
      }
    }
    return str;
  }
}
