import { Pipe, PipeTransform } from '@angular/core';
import { FileData } from '@picthor/file-data/file-data';

@Pipe({ name: 'fileDataPreview' })
export class FileDataPreviewPipe implements PipeTransform {
  transform(fileData: FileData | null, width?: number): string {
    if (fileData == null) {
      return '';
    }
    return FileData.previewUrl(fileData, width);
  }
}
