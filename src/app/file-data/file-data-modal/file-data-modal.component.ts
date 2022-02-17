import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileData } from '@picthor/file-data/file-data';
import { Observable } from 'rxjs';
import { FileDataService } from '@picthor/file-data/file-data.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-file-data-modal',
  templateUrl: './file-data-modal.component.html',
  styleUrls: ['./file-data-modal.component.css'],
})
export class FileDataModalComponent implements OnInit {
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.hasPrevious && event.code == 'ArrowLeft') {
      this.previous();
    }
    if (this.hasNext && event.code == 'ArrowRight') {
      this.next();
    }
    if (event.code == 'KeyR') {
      this.rotateImg();
    }
    if (event.code == 'Space') {
      this.toggleFull();
    }
  }

  isOpen!: boolean;

  @Input()
  fileData$!: Observable<FileData>;

  @Input()
  fileArr!: FileData[];

  @ViewChild('image')
  image: any;

  @Input()
  imageId!: number;

  @Input()
  hasPrevious = false;

  @Input()
  hasNext = false;

  @Output()
  showNext = new EventEmitter<number>();

  @Output()
  showPrevious = new EventEmitter<number>();

  @Output()
  closed = new EventEmitter<any>();

  @Output()
  initialized = new EventEmitter<any>();

  private swipeCoord!: [number, number];
  private swipeTime!: number;

  loading: boolean = true;
  imgRotation: number = 0;
  meta?: {
    Software?: string;
    GPSAltitude?: string;
    GPSLongitude?: string;
    GPSLatitude?: string;
    LensID?: string;
    ImageWidth?: string;
    ImageHeight?: string;
    FocalLength?: string;
    FocalLengthIn35mmFormat?: string;
    ISO?: string;
    Aperture?: string;
    Model?: string;
    Make?: string;
    ShutterSpeed?: string;
    CreateDate?: string;
    DateTimeOriginal?: string;
  };
  fileData?: FileData;
  thumbPath?: string;

  isFull?: boolean;

  constructor(protected fileDataService: FileDataService) {}

  ngOnInit(): void {
    this.fileData$.subscribe((fileData) => {
      this.fileData = fileData;
      this.fileDataService.preloadThumb(this.fileData, 1080).subscribe((path) => (this.thumbPath = path));
      this.isOpen = true;
      this.fileDataService.getMeta(fileData.id).subscribe((meta) => {
        this.meta = meta;
      });
    });
    this.initialized.next();
  }

  downloadOriginal(modalImage: FileData) {
    FileSaver.saveAs(FileData.originalFileUrl(modalImage), modalImage?.fileName);
  }

  rotateImg() {
    let img = this.image.nativeElement;
    this.imgRotation += 90;
    if (this.imgRotation == 360) {
      this.imgRotation = 0;
    }
    img.style.transform = `rotate(${this.imgRotation}deg)`;
  }

  reset() {
    this.loading = true;
    this.fileData = undefined;
    this.thumbPath = undefined;
    this.isFull = false;
  }

  close() {
    this.closed.next();
  }

  next() {
    this.reset();
    this.showNext.emit();
  }

  previous() {
    this.reset();
    this.showPrevious.emit();
  }

  toggleFull() {
    this.isFull = !this.isFull;
  }

  swipe(e: TouchEvent, when: string) {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        if (direction[0] < 0) {
          this.next();
        } else {
          this.previous();
        }
      }
    }
  }
}
