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
import { FileDataListComponent } from '@picthor/file-data/file-data-grid/file-data-list.component';
import { RootsComponent } from '@picthor/roots/roots.component';
import { RootCardComponent } from '@picthor/roots/root-card.component';
import { NotificationsService } from '@picthor/notifications/notifications.service';
import { ToastrModule } from 'ngx-toastr';
import { CdsButtonModule, CdsDividerModule, CdsIconModule } from '@cds/angular';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ClrModalModule, ClrProgressBarModule, ClrSignpostModule, ClrSpinnerModule } from '@clr/angular';
import { FileDataModalComponent } from '@picthor/file-data/file-data-modal/file-data-modal.component';

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
    FileDataListComponent,
    RootsComponent,
    RootCardComponent,
    FileDataModalComponent,
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
    ClrSpinnerModule

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
