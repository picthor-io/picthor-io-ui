import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AbstractEntity } from '@picthor/abstract/abstract-entity';
import { EntityService } from '@picthor/abstract/entity.service.interface';
import { PagedEntities } from '@picthor/abstract/paged-entities';
import { RouteParams } from '@picthor/abstract/route-params';

export abstract class AbstractEntityService<T extends AbstractEntity> implements EntityService<T> {
  protected basePath: string;
  protected http: HttpClient;
  protected apiUrl = environment.apiScheme + environment.apiHost;

  protected constructor(basePath: string, http: HttpClient) {
    this.basePath = basePath;
    this.http = http;
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(this.apiUrl + this.basePath + '/' + id);
  }

  save(entity: T): Observable<T> {
    if (entity.id) {
      return this.put('/' + entity.id, JSON.stringify(entity));
    } else {
      return this.post('', JSON.stringify(entity));
    }
  }

  getPaged(path: string): Observable<PagedEntities<T>> {
    return this.http.get<PagedEntities<T>>(this.apiUrl + this.basePath + path);
  }

  getPage(routeParams: RouteParams): Observable<PagedEntities<T>> {
    return this.getPaged(routeParams.toServiceQuery());
  }

  getArray(path: string): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.apiUrl + this.basePath + path);
  }

  get(path: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + this.basePath + path);
  }

  post(path: string, content: string): Observable<T> {
    return this.http.post<T>(this.apiUrl + this.basePath + path, content);
  }

  delete(path: string): Observable<any> {
    return this.http.delete(this.apiUrl + this.basePath + path);
  }

  put(path: string, content: string): Observable<any> {
    return this.http.put(this.apiUrl + this.basePath + path, content);
  }
}
