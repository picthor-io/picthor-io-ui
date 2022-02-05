import { Component, OnInit } from '@angular/core';
import { Directory } from '@picthor/directory/directory';
import { DirectoriesService } from '@picthor/directory/directory.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: 'sidenav.component.html',
})
export class SidenavComponent implements OnInit {
  roots?: Directory[];
  trees: Directory[] = [];
  collapsed = false;

  constructor(protected directoriesService: DirectoriesService) {
  }

  ngOnInit(): void {
    //   this.directoriesService
    //     .getPage(new RouteParams({ pageNum: 1, pageSize: 100, filter: [{ field: 'type', value: 'ROOT' }] }))
    //     .subscribe((results) => {
    //       this.roots = results.content;
    //       this.roots.forEach((root) => {
    //         this.directoriesService.getTree(root.id).subscribe((tree) => {
    //           this.trees.push(tree);
    //         });
    //       });
    //     });
  }
}
