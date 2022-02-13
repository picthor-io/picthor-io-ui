import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Directory } from '@picthor/directory/directory';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { SorterService } from '@picthor/layout/sorter.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  roots?: Directory[];

  asc: boolean = false;

  constructor(protected directoriesService: DirectoriesService,
              protected sortService: SorterService) {
  }
  ngOnInit(): void {
    // this.directoriesService
    //   .getPage(new RouteParams({ pageNum: 1, pageSize: 100, filter: [{ field: 'type', value: 'ROOT' }] }))
    //   .subscribe((results) => {
    //     this.roots = results.content;
    //   });
  }

  setSort(sortBy: string){

    let direction;
    this.asc = !this.asc;
    this.asc ? direction = 'DESC' : direction = 'ASC';
    this.sortService.emitSort([sortBy, direction]);
  }
}
