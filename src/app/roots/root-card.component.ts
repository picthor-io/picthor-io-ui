import { Component, Input, OnDestroy } from '@angular/core';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { Subscription, timer } from 'rxjs';
import { BatchJob } from '@picthor/batch-job/batch-job';
import { filter, finalize, mergeMap, takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root-card',
  templateUrl: './root-card.component.html',
})
export class RootCardComponent implements OnDestroy {
  @Input()
  directory!: Directory;

  syncJobs?: BatchJob[];

  pollingSyncState = false;
  poll$?: Subscription;
  pollObservable = timer(0, 1000).pipe(
    mergeMap(() => this.directoriesService.getSyncJobs(this.directory)),
    finalize(() => {
      this.pollingSyncState = false;
    }),
    filter((job) => job != null),
    tap((jobs) => {
      this.syncJobs = jobs;
      this.pollingSyncState = !!jobs.find(j => j.state == 'PROCESSING');
    }),
    mergeMap(() => this.directoriesService.getById(this.directory.id)),
    tap((dir) => {
      this.directory = dir;
    })
  );

  constructor(protected directoriesService: DirectoriesService) {
    if (!this.pollingSyncState) {
      this.pollingSyncState = true;
      this.poll$ = this.pollObservable.pipe(takeWhile(() => this.pollingSyncState)).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.poll$?.unsubscribe();
  }

  syncDirectory(directory: Directory) {
    if (!this.pollingSyncState) {
      this.pollingSyncState = true;
      this.directoriesService.sync(directory).subscribe((res) => {
        this.poll$ = this.pollObservable.pipe(takeWhile(() => this.pollingSyncState)).subscribe();
      });
    }
  }
}
