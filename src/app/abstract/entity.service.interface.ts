import { Observable } from 'rxjs';
import { AbstractEntity } from '@picthor/abstract/abstract-entity';
import { PagedEntities } from '@picthor/abstract/paged-entities';
import { RouteParams } from '@picthor/abstract/route-params';

export interface EntityService<T extends AbstractEntity> {
  getById(id: number): Observable<T>;

  save(entity: T): Observable<T>;

  getPaged(path: string): Observable<any>;

  getPage(routeParams: RouteParams): Observable<PagedEntities<T>>;

  post(path: any, content: any): Observable<any>;

  delete(path: string): Observable<any>;

  put(path: string, content: string): Observable<any>;
}
