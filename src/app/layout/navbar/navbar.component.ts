import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@picthor/abstract/route-params';
import { Directory } from '@picthor/directory/directory';
import { DirectoriesService } from '@picthor/directory/directory.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  roots?: Directory[];

  constructor(protected directoriesService: DirectoriesService) {}

  ngOnInit(): void {
    // this.directoriesService
    //   .getPage(new RouteParams({ pageNum: 1, pageSize: 100, filter: [{ field: 'type', value: 'ROOT' }] }))
    //   .subscribe((results) => {
    //     this.roots = results.content;
    //   });
  }
}
