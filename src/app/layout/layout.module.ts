import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '@picthor/layout/layout.component';
import { NavbarComponent } from '@picthor/layout/navbar/navbar.component';
import { FooterComponent } from '@picthor/layout/footer/footer.component';
import { ErrorPageComponent } from '@picthor/layout/error-page/error-page.component';
import { SidenavComponent } from '@picthor/layout/sidenav/sidenav.component';
import { ClrNavigationModule } from '@clr/angular';
import {
  arrowIcon,
  boatIcon,
  ClarityIcons,
  downloadIcon,
  fileIcon,
  folderIcon,
  homeIcon,
  storageIcon
} from '@cds/core/icon';
import { CdsIconModule } from '@cds/angular';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ClrNavigationModule, CdsIconModule],
  declarations: [LayoutComponent, NavbarComponent, FooterComponent, ErrorPageComponent, SidenavComponent],
})
export class LayoutModule {
  constructor() {
    ClarityIcons.addIcons(folderIcon, homeIcon, boatIcon, arrowIcon, fileIcon, storageIcon, downloadIcon);
  }
}
