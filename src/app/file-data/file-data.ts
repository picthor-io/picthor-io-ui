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

  static previewUrl(file: FileData, size = 250) {
    return environment.apiHost + '/thumbs/by-id/' + size + '/' + file.id + '.jpg';
  }
  //
  // static getModalImage(file: FileData): Image {
  //   return new Image(
  //     file.id,
  //     { img: FileData.previewUrl(file, 1350), title: file.fileName },
  //     { img: FileData.previewUrl(file), title: file.fileName }
  //   );
  // }
}
