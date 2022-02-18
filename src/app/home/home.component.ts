import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { Observable } from 'rxjs';
import { FileDataService } from '@picthor/file-data/file-data.service';
import {
  FilterAndSortService,
  SortParams,
  SortsAndFilters,
} from '@picthor/file-data/file-data-grid-sort/filter-and-sort.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  roots$?: Observable<Directory[]>;

  public filters: SortsAndFilters;

  constructor(
    protected directoriesService: DirectoriesService,
    protected fileDataService: FileDataService,
    protected sortService: FilterAndSortService
  ) {
    this.filters = { sortBy: [], filterBy: [] };
  }

  ngOnInit(): void {
    this.sortService.sort$.subscribe((sortAndFilter) => {
      this.filters = sortAndFilter;
    });
    this.roots$ = this.directoriesService.roots$;
  }
}
