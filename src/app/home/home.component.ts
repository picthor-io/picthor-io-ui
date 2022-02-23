import { Component, OnInit } from '@angular/core';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { FilterAndSortService, SortsAndFilters } from '@picthor/file-data/file-data-grid-sort/filter-and-sort.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public filters: SortsAndFilters;

  constructor(protected fileDataService: FileDataService, protected sortService: FilterAndSortService) {
    this.filters = { sortBy: [], filterBy: [{ field: 'sync_state', value: 'SCANNED' }] };
  }

  ngOnInit(): void {
    this.sortService.sort$.subscribe((sortAndFilter) => {
      this.filters = sortAndFilter;
    });
  }
}
