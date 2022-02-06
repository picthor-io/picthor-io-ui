import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileData } from '@picthor/file-data/file-data';
import { Observable, of } from 'rxjs';
import { FileDataService } from '@picthor/file-data/file-data.service';

@Component({
  selector: 'app-file-data-modal',
  templateUrl: './file-data-modal.component.html',
  styleUrls: ['./file-data-modal.component.css'],
})
export class FileDataModalComponent implements OnInit {
  isOpen!: boolean;

  @Input()
  fileData$!: Observable<FileData>;

  @Input()
  fileArr!: FileData[];

  @ViewChild('imageRotate')
  rotate: any;

  @Input()
  imageId!: number;

  @Output()
  showNext = new EventEmitter<number>();

  @Output()
  showPrevious = new EventEmitter<number>();

  loading: boolean = true;
  imgRotation: number = 0;
  state = 'normal';
  isShown = false;
  meta?: any;

  constructor(protected fileDataService: FileDataService) {}

  ngOnInit(): void {
    this.fileData$.subscribe((fileData) => {
      this.open();
      this.fileDataService.getMeta(fileData.id).subscribe((meta) => {
        if (meta) {
          this.meta = {
            // format: this.getFormat(meta),
            // geometry: this.getImageGeometry(meta),
            // modifiedDate: this.getModifiedDate(meta)
          };
        }
      });
    });
  }

  close() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  // public getFormat(data: any): String {
  //   return data?.image['Format'] || data?.image['format'] || data?.image['Format'];
  // }
  //
  // public getImageGeometry(data: any): String {
  //   return String(data?.image.pageGeometry['width'] + ' x ' + data?.image.pageGeometry['height']);
  // }
  //
  // public getCreationDate(data: any): Date {
  //   return new Date(
  //     data?.image.properties['date:created'] || data?.image['date:updated'] || data?.image.properties['date:create']
  //   );
  // }

  // public getModifiedDate(data: any): Date {
  //   return new Date(
  //     data?.image.properties['date:created'] ||
  //       data?.image.properties['date:modify'] ||
  //       data?.image.properties['date:create']
  //   );
  // }

  // rotateImg(){
  //   this.state == 'normal' ? this.state = 'rotated' : this.state= 'normal';
  // }

  downloadImage(modalImage?: FileData) {
    this.fileDataService.downloadImage(modalImage);
  }

  rotateImg() {
    let img = this.rotate.nativeElement;
    this.imgRotation += 90;
    if (this.imgRotation == 360) {
      this.imgRotation = 0;
    }
    img.style.transform = `rotate(${this.imgRotation}deg)`;
  }

  // parseMeta(meta: Observable<any>) {
  //   meta = this.modalMeta$!;
  //   meta.subscribe((x) => console.log(x));
  // }

  next() {
    this.showNext.emit();
  }

  previous() {
    this.showPrevious.emit();
  }
}
