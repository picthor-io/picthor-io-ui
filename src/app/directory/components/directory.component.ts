import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { FileData } from '@picthor/file-data/file-data';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { PagedEntities } from '@picthor/abstract/paged-entities';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-directory',
  templateUrl: 'directory.component.html',
})
export class DirectoryComponent implements OnInit {
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code == 'Backspace') {
      if (this.directory?.parentId) {
        this.router.navigateByUrl('directories/' + this.directory.parentId);
      }
    }
  }

  routeSub: any;
  id?: number;

  currentPage = 1;
  totalElements = 0;
  totalPages = 0;
  filesPage$: Observable<PagedEntities<FileData>> = of(new PagedEntities<FileData>());
  files$?: Observable<FileData[]>;

  children$?: Observable<Directory[]> = of([]);
  directory$?: Observable<Directory>;
  directory?: Directory;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
        this.directory$ = this.directoriesService.getById(this.id).pipe(
          tap((d) => (this.directory = d)),
          shareReplay()
        );
        this.children$ = this.directoriesService.getByParentId(this.id).pipe(
          shareReplay(),
          map((page) => page.content)
        );
      }
    });
  }
}
