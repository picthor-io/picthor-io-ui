import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { FileData } from '@picthor/file-data/file-data';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { PagedEntities } from '@picthor/abstract/paged-entities';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-directory',
  templateUrl: 'directory.component.html',
})
export class DirectoryComponent implements OnInit {
  routeSub: any;
  id?: number;

  currentPage = 1;
  totalElements = 0;
  totalPages = 0;
  filesPage$: Observable<PagedEntities<FileData>> = of(new PagedEntities<FileData>());
  files$?: Observable<FileData[]>;

  children$?: Observable<Directory[]> = of([]);
  directory$?: Observable<Directory>;

  constructor(
    private route: ActivatedRoute,
    protected service: FileDataService,
    protected fileDataService: FileDataService,
    protected directoriesService: DirectoriesService,
    protected http: HttpClient
  ) {}

  ngOnInit(): void {
    this.directory$ = undefined;
    this.children$ = undefined;

    this.routeSub = this.route.params.subscribe((params) => {
      this.id = +params['id'];
      if (this.id) {
        this.directory$ = this.directoriesService.getById(this.id).pipe(shareReplay());
        this.children$ = this.directoriesService.getByParentId(this.id).pipe(
          shareReplay(),
          map((page) => page.content)
        );
      }
    });
  }
}
