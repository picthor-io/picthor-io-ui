import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractEntityService } from '@picthor/abstract/abstract-entity.service';
import { Directory } from '@picthor/directory/directory';
import { RouteParams } from '@picthor/abstract/route-params';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BatchJob } from '@picthor/batch-job/batch-job';

@Injectable()
export class DirectoriesService extends AbstractEntityService<Directory> {
  private readonly _roots$: Observable<Directory[]>;

  constructor(http: HttpClient) {
    super('/api/directories', http);

    this._roots$ = this.getPage(
      new RouteParams({ pageNum: 1, pageSize: 100, filter: [{ field: 'type', value: 'ROOT' }] })
    ).pipe(
      shareReplay(),
      map((page) => page.content)
    );
  }

  getByParentId(parentId: number) {
    return this.getPage(
      new RouteParams({ pageNum: 1, pageSize: 2000, filter: [{ field: 'parent_id', value: parentId }] })
    );
  }

  getTree(rootId: number) {
    return this.get('/' + rootId + '/tree');
  }

  sync(directory: Directory) {
    return this.post('/' + directory.id + '/sync', '');
  }

  getSyncJobs(directory: Directory):Observable<BatchJob[]> {
    return this.get('/' + directory.id + '/jobs');
  }

  get roots$(): Observable<any> {
    return this._roots$;
  }
}
