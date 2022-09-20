import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@picthor/layout/layout.module';
import { AppRoutingModule } from '@picthor/app-routing.module';
import { AppComponent } from '@picthor/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DirectoryComponent } from '@picthor/directory/components/directory.component';
import { HomeComponent } from '@picthor/home/home.component';
import { SharedModule } from '@picthor/shared/shared.module';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { FileDataGridComponent } from '@picthor/file-data/file-data-grid/file-data-grid.component';
import { RootsComponent } from '@picthor/roots/roots.component';
import { RootCardComponent } from '@picthor/roots/root-card.component';
import { NotificationsService } from '@picthor/notifications/notifications.service';
import { ToastrModule } from 'ngx-toastr';
import { CdsButtonModule, CdsDividerModule, CdsIconModule } from '@cds/angular';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import {
  ClrComboboxModule,
  ClrDropdownModule, ClrInputModule, ClrLoadingModule,
  ClrModalModule,
  ClrProgressBarModule,
  ClrSignpostModule,
  ClrSpinnerModule,
} from '@clr/angular';
import { FileDataModalComponent } from '@picthor/file-data/file-data-modal/file-data-modal.component';
import { FileDataGridSortComponent } from '@picthor/file-data/file-data-grid-sort/file-data-grid-sort.component';
import { FormsModule } from '@angular/forms';
import { FileDataMetaComponent } from './file-data/file-data-meta/file-data-meta.component';

function initializeAppEnv(httpClient: HttpClient): () => Observable<any> {
  return () =>
    httpClient.get('env.json').pipe(
      tap((resp) => {
        Object.assign(environment, resp);
      })
    );
}

@NgModule({
  declarations: [
    AppComponent,
    DirectoryComponent,
    HomeComponent,
    FileDataGridComponent,
    FileDataGridSortComponent,
    RootsComponent,
    RootCardComponent,
    FileDataModalComponent,
    FileDataMetaComponent,
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    SharedModule,
    ClrProgressBarModule,
    CdsIconModule,
    CdsDividerModule,
    CdsButtonModule,
    ClrModalModule,
    ClrSignpostModule,
    LazyLoadImageModule,
    ClrSpinnerModule,
    ClrDropdownModule,
    ClrComboboxModule,
    ClrInputModule,
    FormsModule,
    ClrLoadingModule,
  ],
  providers: [
    DirectoriesService,
    FileDataService,
    NotificationsService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppEnv,
      deps: [HttpClient],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
