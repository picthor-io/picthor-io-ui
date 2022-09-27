import { Component, Input, OnDestroy } from '@angular/core';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { BatchJob } from '@picthor/batch-job/batch-job';
import { JobCounter } from '@picthor/batch-job/job-counter';
import { RxStompService } from '@picthor/rx-stomp.service';
import { filter, map, tap } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-root-card',
  templateUrl: './root-card.component.html',
})
export class RootCardComponent implements OnDestroy {
  @Input()
  directory!: Directory;

  syncJobs: BatchJob[] = [];

  constructor(protected directoriesService: DirectoriesService, private rxStompService: RxStompService) {
    this.rxStompService.watch('/topic/jobs/add').pipe(
      map<Message, BatchJob>(message => Object.assign(new BatchJob(), JSON.parse(message.body))),
      filter(job => job.rootDirectoryId === this.directory.id),
      tap(job => this.syncJobs.push(job))
    ).subscribe();

    this.rxStompService.watch('/topic/jobs/remove').pipe(
      map<Message, BatchJob>(message => Object.assign(new BatchJob(), JSON.parse(message.body))),
      filter(job => job.rootDirectoryId === this.directory.id),
      tap(job => this.syncJobs = this.syncJobs.filter(sj => sj.id !== job.id))
    ).subscribe();

    this.rxStompService.watch('/topic/jobs/counter-update').pipe(
      map<Message, JobCounter>(message => Object.assign(new JobCounter(), JSON.parse(message.body))),
      tap(counter => {
        this.syncJobs.forEach((sc, index) => {
          if (sc.rootDirectoryId === this.directory.id && sc.id === counter.jobId) {
            this.syncJobs[index].counter = counter;
          }
        });
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    // this.jobRemoved$?.unsubscribe();
    // this.jobAdded$?.unsubscribe();
  }

  syncDirectory(directory: Directory) {
    if (this.syncJobs.length === 0) {
      this.directoriesService.sync(directory).subscribe();
    }
  }
}
