import { NgModule } from '@angular/core';
import { AppPrettyBytesPipe } from '@picthor/shared/pipes/pretty-bytes.pipe';
import { AppDatePipe } from '@picthor/shared/pipes/date.pipe';
import { FileDataPreviewPipe } from '@picthor/shared/pipes/file-data-preview';

@NgModule({
  declarations: [AppPrettyBytesPipe, AppDatePipe, FileDataPreviewPipe],
  exports: [AppPrettyBytesPipe, AppDatePipe, FileDataPreviewPipe],
})
export class SharedModule {}
