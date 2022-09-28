import { Component, Input, OnDestroy } from '@angular/core';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { BatchJob } from '@picthor/batch-job/batch-job';
import { JobCounter } from '@picthor/batch-job/job-counter';
import { RxStompService } from '@picthor/rx-stomp.service';
import { filter, map, tap } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root-card',
  templateUrl: './root-card.component.html',
})
export class RootCardComponent implements OnDestroy {
  @Input()
  directory!: Directory;

  syncJobs: BatchJob[] = [];
  private jobCounterUpdate$: Subscription;
  private jobAdd$: Subscription;
  private jobRemove$: Subscription;

  constructor(protected directoriesService: DirectoriesService, private rxStompService: RxStompService) {

    let directoryUpdateTimer: any = null;

    this.jobAdd$ = this.rxStompService.watch('/topic/jobs/add').pipe(
      map<Message, BatchJob>(message => Object.assign(new BatchJob(), JSON.parse(message.body))),
      filter(job => job.rootDirectoryId === this.directory.id),
      tap(job => this.syncJobs.push(job))
    ).subscribe();

    this.jobRemove$ = this.rxStompService.watch('/topic/jobs/remove').pipe(
      map<Message, BatchJob>(message => Object.assign(new BatchJob(), JSON.parse(message.body))),
      filter(job => job.rootDirectoryId === this.directory.id),
      tap(job => this.syncJobs = this.syncJobs.filter(sj => sj.id !== job.id))
    ).subscribe();

    this.jobCounterUpdate$ = this.rxStompService.watch('/topic/jobs/counter-update').pipe(
      map<Message, JobCounter>(message => Object.assign(new JobCounter(), JSON.parse(message.body))),
      filter(counter => counter.rootDirectoryId === this.directory.id),
      tap(counter => {
        this.syncJobs.forEach((sc, index) => {
          if (sc.id === counter.jobId) {
            this.syncJobs[index].counter = counter;
          }
        });
        if (this.directory.stats.sizeBytes === 0 && directoryUpdateTimer == null) {
          directoryUpdateTimer = setTimeout(() => {
            this.directoriesService.getById(this.directory.id).subscribe(d => {
              this.directory = d
              directoryUpdateTimer = null;
            });
          }, 5000);
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.jobAdd$.unsubscribe();
    this.jobRemove$.unsubscribe();
    this.jobCounterUpdate$.unsubscribe();
  }

  syncDirectory(directory: Directory) {
    if (this.syncJobs.length === 0) {
      this.directoriesService.sync(directory).subscribe();
    }
  }
}
