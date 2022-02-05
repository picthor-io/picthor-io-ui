import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { Observable } from 'rxjs';
import { FileDataService } from '@picthor/file-data/file-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  roots$?: Observable<Directory[]>;

  constructor(protected directoriesService: DirectoriesService, protected fileDataService: FileDataService) {}

  ngOnInit(): void {

    this.roots$ = this.directoriesService.roots$;
  }
}
