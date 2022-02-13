import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { Observable } from 'rxjs';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { SorterService } from '@picthor/layout/sorter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  roots$?: Observable<Directory[]>;

  sortOption!: string;
  sortDir!: string;


  constructor(protected directoriesService: DirectoriesService,
              protected fileDataService: FileDataService,
              protected sortService: SorterService,) {
  }

  ngOnInit(): void {

    this.sortService.sort$.subscribe(newSort => {
      this.sortOption = newSort[0];
      this.sortDir = newSort[1];
    });

    this.roots$ = this.directoriesService.roots$;
  }
}
