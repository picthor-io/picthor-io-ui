import { Component, Input, OnDestroy } from '@angular/core';
import { FilterAndSortService, SortsAndFilters } from '@picthor/file-data/file-data-grid-sort/filter-and-sort.service';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-file-data-grid-sort',
  templateUrl: 'file-data-grid-sort.component.html',
})
export class FileDataGridSortComponent implements OnDestroy {
  @Input()
  filters: SortsAndFilters = { sortBy: [], filterBy: [] };

  extensions$: Observable<{ extension: string; count: number }[]> = this.fileDataService.getExtensions();

  fileNameFilter?: string;
  fileNameChanged: Subject<string> = new Subject<string>();
  fileNameChange$ = this.fileNameChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
    this.filters.filterBy = this.filters.filterBy.filter((f) => f.field !== 'file_name');
    this.filters.filterBy.push({ field: 'file_name', value: term });
    this.sortService.emitChange(this.filters);
  });

  extensionsFilter: string[] = [];
  extensionsChanged: Subject<string> = new Subject<string>();
  extensionsChange$ = this.extensionsChanged.pipe(debounceTime(300)).subscribe((term) => {
    this.filters.filterBy = this.filters.filterBy.filter((f) => f.field !== 'extension');
    if (term && term.length !== 0) {
      this.filters.filterBy.push({ field: 'extension', value: term });
    }
    this.sortService.emitChange(this.filters);
  });

  constructor(protected sortService: FilterAndSortService, private fileDataService: FileDataService) {}

  toggleSort(field: string) {
    let fieldSort = this.filters.sortBy.find((s) => s.field === field);
    if (!fieldSort) {
      fieldSort = { field, dir: 'ASC' };
      this.filters.sortBy.push(fieldSort);
    } else {
      if (fieldSort.dir === 'ASC') {
        fieldSort.dir = 'DESC';
      } else if (fieldSort.dir === undefined) {
        fieldSort.dir = 'ASC';
      } else {
        this.filters.sortBy = this.filters.sortBy.filter((f) => f.field !== fieldSort?.field);
      }
    }
    this.sortService.emitChange(this.filters);
  }

  sortDirection(field: string) {
    if (this.filters) {
      let fieldSort = this.filters.sortBy.find((s) => s.field === field);
      if (fieldSort) {
        return fieldSort.dir;
      }
    }
    return undefined;
  }

  ngOnDestroy(): void {}
}
