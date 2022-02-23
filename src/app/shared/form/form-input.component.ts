import { Component, Input } from '@angular/core';
import { BaseFormComponent } from '@picthor/shared/form/base-form.component';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
})
export class FormInputComponent extends BaseFormComponent {
  @Input()
  control?: any;

  @Input()
  type = 'text';

  @Input()
  size = '30';

  @Input()
  label!: string;

  @Input()
  placeholder = '';

  @Input()
  required = true;

  @Input()
  readonly = false;

  @Input()
  style = '';

  @Input()
  pattern!: string;

  @Input()
  maxLength!: number;

  @Input()
  minLength!: number;

  @Input()
  helpText!: string;

  @Input()
  inputMask!: any;

  @Input()
  context: any = {};

  constructor() {
    super();
    if (!this.placeholder) {
      this.placeholder = this.label;
    }
  }
}
