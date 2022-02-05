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

  downloadImage(modalImage? : FileData){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');

    if(modalImage?.fullPath !== undefined){
      link.setAttribute('href', modalImage?.fullPath); //server
    }
    if(modalImage?.fileName !== undefined) {
      link.setAttribute('download', modalImage?.fileName);
    }
    document.body.appendChild(link);
    console.log(link);
    link.click();
    link.remove();
  }

}
