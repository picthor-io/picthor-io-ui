import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractEntityService } from '@picthor/abstract/abstract-entity.service';
import { FileData } from '@picthor/file-data/file-data';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class FileDataService extends AbstractEntityService<FileData> {
  constructor(http: HttpClient) {
    super('/api/file-data', http);
  }

  getMeta(id: number) {
    return this.get('/' + id + '/meta');
  }

  getExtensions(): Observable<{ extension: string; count: number }[]> {
    return this.http.get<{ extension: string; count: number }[]>(this.apiUrl + this.basePath + '/extensions');
  }

  preloadThumb(fileData: FileData, size: number) {
    let previewUrl = FileData.previewUrl(fileData, size);
    return this.http.get(previewUrl, { responseType: 'blob' }).pipe(map((_) => previewUrl));
  }
}
