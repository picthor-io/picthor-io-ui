import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SortParams {
  field: string;
  dir: string;
}

export interface FilterParams {
  field: string;
  value: any;
}

export interface SortsAndFilters {
  sortBy: SortParams[];
  filterBy: FilterParams[];
}

@Injectable({
  providedIn: 'root',
})
export class FilterAndSortService {
  public sort$ = new Subject<SortsAndFilters>();

  emitChange(changes: SortsAndFilters) {
    this.sort$.next(changes);
  }

  constructor() {}
}
