import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-roots',
  templateUrl: './roots.component.html',
})
export class RootsComponent implements OnInit {
  roots$?: Observable<Directory[]>;

  constructor(protected directoriesService: DirectoriesService) {}

  ngOnInit(): void {
    this.roots$ = this.directoriesService.roots$;
  }

}
