import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SorterService {
  public sort$ = new Subject<[string, string]>();

  emitSort(sortBy: [string, string]) {
    this.sort$.next([...sortBy]);
  }

  constructor() {}
}
