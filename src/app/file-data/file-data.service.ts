import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractEntityService } from '@picthor/abstract/abstract-entity.service';
import { FileData } from '@picthor/file-data/file-data';

@Injectable()
export class FileDataService extends AbstractEntityService<FileData> {
  constructor(http: HttpClient) {
    super('/api/file-data', http);
  }

  getMeta(id: number) {
    return this.get('/' + id + '/meta');
  }

}
