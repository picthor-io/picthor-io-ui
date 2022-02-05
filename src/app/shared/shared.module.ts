import { NgModule } from '@angular/core';
import { AppPrettyBytesPipe } from '@picthor/shared/pipes/pretty-bytes.pipe';
import { AppDatePipe } from '@picthor/shared/pipes/date.pipe';

@NgModule({
  declarations: [AppPrettyBytesPipe, AppDatePipe],
  exports: [AppPrettyBytesPipe, AppDatePipe],
})
export class SharedModule {}
