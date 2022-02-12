import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from '@picthor/layout/error-page/error-page.component';
import { LayoutComponent } from '@picthor/layout/layout.component';
import { FileDataListComponent } from '@picthor/file-data/file-data-grid/file-data-list.component';
import { DirectoryComponent } from '@picthor/directory/components/directory.component';
import { HomeComponent } from '@picthor/home/home.component';
import { RootsComponent } from '@picthor/roots/roots.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'files',
        component: FileDataListComponent
      },
      {
        path: 'directories/:id',
        component: DirectoryComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'roots',
        component: RootsComponent
      },
      {
        path: '**',
        component: ErrorPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
