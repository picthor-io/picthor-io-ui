import { AbstractEntity } from '@picthor/abstract/abstract-entity';
import { environment } from '../../environments/environment';

export class FileData extends AbstractEntity {
  type!: string;
  fileName!: string;
  extension!: string;
  mimeType!: string;
  baseName!: string;
  hash!: string;
  width!: number;
  fullPath!: string;
  indexNanos!: number;
  dirPath!: string;
  height!: number;
  sizeBytes!: number;
  syncState!: string;
  rootDirectoryId!: number;
  directoryId!: number;

  static previewUrl(file: FileData, size: number | string = 250) {
    return environment.apiScheme + environment.apiHost + '/thumbs/by-id/' + size + '/' + file.id + '.jpg';
  }

  static originalFileUrl(file: FileData) {
    return environment.apiScheme + environment.apiHost + '/originals/by-id/' + file.id + '/' + file.fileName;
  }
}
