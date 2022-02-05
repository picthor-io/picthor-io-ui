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
  modalImage?: FileData;
  modalMeta$?: Observable<any[]>;

  currentPage = 1;
  totalElements = 0;
  totalPages = 0;
  pageSize = 24;
  filesPage$: Observable<PagedEntities<FileData>> = of(new PagedEntities<FileData>());
  files$?: Observable<FileData[]>;

  isShown: boolean = false ;

  private filterData: { field: string; value: any }[] = [];

  @Input()
  public sort?: { field: string; dir: string }[];

  @Input()
  public options!: Options;

  private defaultOptions: Options = {
    SHOW_ADDED_ON: true,
    SHOW_INDEX_OFF_TOTAL: true,
  };

  private creationDateFields = ["image.date:created", "image.date:updated"];


  public jsonData = this.modalMeta$;

  public getFormat(data:any) : String{
    return data?.image["Format"] ||
      data?.image["format"] ||
      data?.image["Format"];

  }

  private toggleShow(){
    this.isShown = ! this.isShown;
  }

  public getImageGeometry(data: any): String{

    console.log(String(data?.image.pageGeometry["width"] + " x " +
      data?.image.pageGeometry["height"]));

    return String(data?.image.pageGeometry["width"] + " x " +
                        data?.image.pageGeometry["height"]);


  }

  public getCreationDate(data:any) : Date{
    return new Date(data?.image.properties["date:created"] ||
                              data?.image["date:updated"] ||
                              data?.image.properties["date:create"]);
  }

  public getModifiedDate(data:any) : Date {
    return new Date(data?.image.properties["date:created"] ||
      data?.image.properties["date:modify"] ||
      data?.image.properties["date:create"]);

  }







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
        return acc;
      }, [])
    );
  }

  ngOnInit(): void {
    this.options = Object.assign(this.defaultOptions, this.options);
    this.filter = [];
  }

  showModal(file: FileData) {
    this.openModal = true;
    this.modalImage = file;
    this.modalMeta$ = this.fileDataService.getMeta(file.id);
  }

  previewUrl(file: FileData, width = 250) {
    return FileData.previewUrl(file, width);
  }

  modalClosed() {
    this.modalImage = undefined;
  }

  imgLoad(file: FileData) {
    //this.http.get(this.previewUrl(file, 1080)).subscribe().unsubscribe();
  }

  downloadImage(){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');

    if(this.modalImage?.fullPath !== undefined){
      link.setAttribute('href',this.modalImage?.fullPath);
    }
    if(this.modalImage?.fileName !== undefined) {
      link.setAttribute('download', this.modalImage?.fileName);
    }
    document.body.appendChild(link);
    console.log(link);
    link.click();
    link.remove();
  }







}
