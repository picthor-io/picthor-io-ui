import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Directory } from '@picthor/directory/directory';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { SorterService } from '@picthor/sorter.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  roots?: Directory[];

  asc: boolean = false;

  constructor(protected sortService: SorterService) {}
  ngOnInit(): void {}

  setSort(sortBy: string) {
    let direction;
    this.asc = !this.asc;
    this.asc ? (direction = 'DESC') : (direction = 'ASC');
    this.sortService.emitSort([sortBy, direction]);
  }
}
