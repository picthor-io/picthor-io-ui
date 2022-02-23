import { NgModule } from '@angular/core';
import { AppPrettyBytesPipe } from '@picthor/shared/pipes/pretty-bytes.pipe';
import { AppDatePipe } from '@picthor/shared/pipes/date.pipe';
import { FileDataPreviewPipe } from '@picthor/shared/pipes/file-data-preview';
import { ErrorMessagePipe } from '@picthor/shared/pipes/error-message.pipe';
import { ObjectKeysPipe } from '@picthor/shared/pipes/object-keys.pipe';
import { FormInputComponent } from '@picthor/shared/form/form-input.component';
import { ClrFormsModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppPrettyBytesPipe,
    AppDatePipe,
    FileDataPreviewPipe,
    ErrorMessagePipe,
    ObjectKeysPipe,
    FormInputComponent,
  ],
  exports: [AppPrettyBytesPipe, AppDatePipe, FileDataPreviewPipe, ErrorMessagePipe, ObjectKeysPipe, FormInputComponent],
  imports: [ClrFormsModule, CommonModule, ReactiveFormsModule],
})
export class SharedModule {}
