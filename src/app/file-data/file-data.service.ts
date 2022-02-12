import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractEntityService } from '@picthor/abstract/abstract-entity.service';
import { FileData } from '@picthor/file-data/file-data';
import { map } from 'rxjs/operators';

@Injectable()
export class FileDataService extends AbstractEntityService<FileData> {
  constructor(http: HttpClient) {
    super('/api/file-data', http);
  }

  getMeta(id: number) {
    return this.get('/' + id + '/meta');
  }

  preloadThumb(fileData: FileData, size: number) {
    let previewUrl = FileData.previewUrl(fileData, size);
    return this.http.get(previewUrl, { responseType: 'blob' }).pipe(map((_) => previewUrl));
  }
}
