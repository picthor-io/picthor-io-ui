import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractEntityService } from '@picthor/abstract/abstract-entity.service';
import { Directory } from '@picthor/directory/directory';
import { RouteParams } from '@picthor/abstract/route-params';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BatchJob } from '@picthor/batch-job/batch-job';
import { PagedEntities } from '@picthor/abstract/paged-entities';

@Injectable()
export class DirectoriesService extends AbstractEntityService<Directory> {
  constructor(http: HttpClient) {
    super('/api/directories', http);
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

  getSyncJobs(directory: Directory): Observable<BatchJob[]> {
    return this.get('/' + directory.id + '/jobs');
  }

  addRoot(data: any): Observable<any> {
    let path = data.path;
    if (path.endsWith('/')) {
      path = path.substring(0, path.length - 1);
    }
    return this.http.post(this.apiUrl + this.basePath, { name: data.name, path: path });
  }

  getRoots(): Observable<Directory[]> {
    return this.getPage(
      new RouteParams({ pageNum: 1, pageSize: 100, filter: [{ field: 'type', value: 'ROOT' }] })
    ).pipe(
      shareReplay(),
      map((page) => page.content)
    );
  }
}
