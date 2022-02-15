import { Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { RouteParams } from '@picthor/abstract/route-params';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { FileData } from '@picthor/file-data/file-data';
import { PagedEntities } from '@picthor/abstract/paged-entities';
import { fromEvent, merge, Observable, of, Subject } from 'rxjs';
import { concatMap, debounceTime, distinct, filter, map, scan, startWith, tap } from 'rxjs/operators';

export class Options {
  SHOW_ADDED_ON?: boolean;
  SHOW_INDEX_OFF_TOTAL?: boolean;
}

@Component({
  selector: 'app-file-data-list',
  templateUrl: 'file-data-list.component.html',
  styleUrls: ['file-data-list.component.css'],
})
export class FileDataListComponent implements OnInit {
  currentPage = 1;
  totalElements = 0;
  totalPages = 0;
  pageSize = 24;
  pagesLoaded: number[] = [];
  files$!: Observable<FileData[]>;
  allFiles: FileData[] = [];

  modalImageIndex = 0;
  modalFileData$: Subject<FileData> = new Subject();

  private filterData: { field: string; value: any }[] = [];
  private sortData: { field: string; dir: string }[] = [];

  @Input()
  public options!: Options;

  private defaultOptions: Options = {
    SHOW_ADDED_ON: true,
    SHOW_INDEX_OFF_TOTAL: true,
  };

  private loadNextPage$ = new Subject<boolean>();
  private pageLoaded$ = new Subject<boolean>();
  private windowScrolled$ = new Subject<Event>();

  @HostListener('window:scroll', [])
  onScroll() {
    this.windowScrolled$.next();
  }

  // emmit event when page bottom almost reached
  private bottomReached$ = this.windowScrolled$.pipe(
    map(() => window.scrollY),
    distinct(),
    debounceTime(20),
    map((y) => {
      let windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
      let body = document.body;
      let html = document.documentElement;
      let docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      let windowBottom = windowHeight + y + 100;
      return windowBottom >= docHeight;
    })
  );

  // listen to loadNextPage and bottomReached events and emit page number to be loaded next
  private pageToLoad$ = merge(
    this.loadNextPage$.pipe(
      map(() => {
        if (this.currentPage + 1 <= this.totalPages) {
          return ++this.currentPage;
        }
        return this.currentPage;
      })
    ),
    this.bottomReached$.pipe(
      filter((reached) => {
        return reached;
      }),
      map((_) => this.currentPage + 1),
      distinct(),
      filter((page) => {
        return page == 1 || page <= this.totalPages;
      }),
      tap((page) => {
        this.currentPage = page;
      })
    )
  );

  constructor(protected fileDataService: FileDataService) {}

  @Input()
  set sort(sort: { field: string; dir: string }[]) {
    this.sortData = sort;
    this.reset();
  }

  @Input()
  set filter(filterData: { field: string; value: any }[]) {
    this.filterData = filterData;
    this.reset();
  }

  private reset() {
    // listen on next page number to be loaded
    this.files$ = this.pageToLoad$.pipe(
      // load first page always
      startWith(1),
      // filter already loaded pages
      // filter((page) => {
      //   return this.pagesLoaded.indexOf(page) == -1;
      // }),
      // fetch page data from backend
      concatMap((page) => {
        return this.fileDataService
          .getPage(
            new RouteParams({
              pageNum: page,
              pageSize: this.pageSize,
              filter: this.filterData,
              sort: this.sortData,
            })
          )
          .pipe(
            map((pagedEntities) => {
              // add this page as loaded
              this.pagesLoaded.push(page);
              this.totalElements = pagedEntities.pageMetadata.totalElements;
              this.totalPages = pagedEntities.pageMetadata.totalPages;
              return pagedEntities.content;
            })
          );
      }),
      // append all loaded files into array for later usage in modal paging
      scan<FileData[]>((acc, curr) => {
        acc.push(...curr);
        this.allFiles.push(...curr);
        return acc;
      }, []),
      // emit page loaded event
      tap(() => this.pageLoaded$.next())
    );
  }

  ngOnInit(): void {
    this.options = Object.assign(this.defaultOptions, this.options);
  }

  showModal(file: FileData, index: number) {
    this.modalImageIndex = index;
    this.modalFileData$.next(file);
  }

  modalNext() {
    if (this.allFiles[this.modalImageIndex + 1]) {
      // if all loaded files contain next image emit it as event for modal
      this.modalFileData$.next(this.allFiles[++this.modalImageIndex]);
    } else {
      // if all loaded files does not contain next image but there are more pages to load
      // emit loadNextPage event and switch to next image after the next page was loaded
      if (this.totalElements > this.modalImageIndex) {
        this.loadNextPage$.next();
        this.pageLoaded$?.subscribe(() => {
          this.modalFileData$.next(this.allFiles[++this.modalImageIndex]);
        });
      }
    }
  }

  modalPrevious() {
    // if all loaded files contain next image emit it as event for modal
    if (this.allFiles[this.modalImageIndex - 1]) {
      this.modalFileData$.next(this.allFiles[--this.modalImageIndex]);
    }
  }
}
