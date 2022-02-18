import { Component } from '@angular/core';
import { FilterAndSortService } from '@picthor/file-data/file-data-grid-sort/filter-and-sort.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(protected sortService: FilterAndSortService) {}


}
