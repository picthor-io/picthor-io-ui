import { Component, Input, OnInit } from '@angular/core';
import { RouteParams } from '@picthor/abstract/route-params';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { FileData } from '@picthor/file-data/file-data';
import { PagedEntities } from '@picthor/abstract/paged-entities';
import { fromEvent, Observable, of } from 'rxjs';
import { concatMap, debounceTime, distinct, filter, map, scan, startWith, tap } from 'rxjs/operators';


export class Options {
  SHOW_ADDED_ON?: boolean;
  SHOW_INDEX_OFF_TOTAL?: boolean;
}

@Component({
  selector: 'app-file-data-list',
  templateUrl: 'file-data-list.component.html',
  styleUrls: ['file-data-list.component.css']
})
export class FileDataListComponent implements OnInit {
  openModal = false;
  modalImage!: FileData;
  modalMeta$?: Observable<any[]>;

  currentPage = 1;
  totalElements = 0;
  totalPages = 0;
  pageSize = 24;
  filesPage$: Observable<PagedEntities<FileData>> = of(new PagedEntities<FileData>());
  files$?: Observable<FileData[]>;

  fileArr: FileData[] = [];
  indexArr: any;

  private filterData: { field: string; value: any }[] = [];

  @Input()
  public sort?: { field: string; dir: string }[];

  @Input()
  public options!: Options;

  private defaultOptions: Options = {
    SHOW_ADDED_ON: true,
    SHOW_INDEX_OFF_TOTAL: true,
  };


  private bottomReached$ = fromEvent(window, 'scroll').pipe(
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

  private pageToLoad$ = this.bottomReached$.pipe(
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
  );

  constructor(protected fileDataService: FileDataService) {}

  @Input()
  set filter(filter: { field: string; value: any }[]) {
    this.filterData = filter;
    this.files$ = this.pageToLoad$.pipe(
      startWith(1),
      concatMap((page) => {
        return this.fileDataService
          .getPage(
            new RouteParams({
              pageNum: page,
              pageSize: this.pageSize,
              filter: this.filterData,
              sort: this.sort,
            })
          )
          .pipe(
            map((pagedEntities) => {
              this.totalElements = pagedEntities.pageMetadata.totalElements;
              this.totalPages = pagedEntities.pageMetadata.totalPages;
              return pagedEntities.content;
            })
          );
      }),
      scan<FileData[]>((acc, curr) => {
        acc.push(...curr);
        this.fileArr.push(...curr);
        return acc;
      }, [])
    );
  }

  ngOnInit(): void {
    this.options = Object.assign(this.defaultOptions, this.options);
    this.filter = [];
  }

  previewUrl(file: FileData, width = 250) {
    return FileData.previewUrl(file, width);
  }

  showModal(file: FileData) {
    this.modalImage = file;
    this.modalMeta$ = this.fileDataService.getMeta(file.id);
    this.openModal = true;
    }


  imgLoad(file: FileData) {
    //this.http.get(this.previewUrl(file, 1080)).subscribe().unsubscribe();
  }

  hideModal(){
    this.openModal = false;
    console.log("MODAL CLOSED");
  }


  displayNext(galId: number) {
    this.showModal(this.fileArr[galId+1]);
  }

  displayPrevious(galId: number) {
    this.showModal(this.fileArr[galId-1]);
  }
}
