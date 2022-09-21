import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
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
      this.toggleFull(event);
    }
  }

  isOpen!: boolean;

  @Input()
  fileData$!: Observable<FileData>;

  @Input()
  fileArr!: FileData[];

  @ViewChild('image')
  image: any;

  @ViewChild('phoneBackrop')
  phoneBackdrop!: ElementRef;

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
  fileData?: FileData;
  thumbPath?: string;

  isFull?: boolean;
  desktop: boolean = true;
  isPhoneMetaDisplay: boolean = false;
  phoneTranslateY: string = '0';
  phoneTranslateX: string = '0';
  isVerticalDrag!: boolean;
  isDragDirectionRegistered: boolean = false;
  constructor(protected fileDataService: FileDataService) {}

  ngOnInit(): void {
    this.fileData$.subscribe((fileData) => {
      this.fileData = fileData;
      this.fileDataService.preloadThumb(this.fileData, 1080).subscribe((path) => (this.thumbPath = path));
      this.isOpen = true;
    });
    this.initialized.next();

    if(window.outerWidth < 768){
      this.desktop = false;
    }

  }

  downloadOriginal(modalImage: FileData, e?: Event) {
    e?.stopPropagation();
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
    this.image.nativeElement.style.transform = '';
    this.phoneTranslateY = '0';
    this.phoneTranslateX = '0';
  }

  close(e?: Event) {
    e?.stopPropagation();
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

  toggleFull(e: Event) {
    e.stopPropagation();
    this.isFull = !this.isFull;
  }

  swipe(e: TouchEvent, when: string) {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if(when === 'move'){
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      if(!this.isDragDirectionRegistered) {
        if (Math.abs(direction[0]) > Math.abs(direction[1])) {
          this.isVerticalDrag = false;
          this.phoneTranslateX = direction[0] + 'px';
        } else {
          this.isVerticalDrag = true;
          this.phoneTranslateY = direction[1] + 'px';
          this.phoneBackdrop.nativeElement.style.backgroundColor = `rgba(0, 0, 0, ${1 - (Math.abs(direction[1]) / 100)})`
        }
        this.isDragDirectionRegistered = true;
      } else{
        if(!this.isVerticalDrag) {
          this.phoneTranslateX = direction[0] + 'px';
        } else{
          this.phoneTranslateY = direction[1] + 'px';
          this.phoneBackdrop.nativeElement.style.backgroundColor = `rgba(0, 0, 0, ${1 - (Math.abs(direction[1]) / 100)})`
        }
      }
    } else if (when === 'end') {

      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      if(this.phoneTranslateY && Math.abs(direction[1]) > 90){
        this.close();
      } else{
        this.image.nativeElement.style.transform = '';
        this.phoneBackdrop.nativeElement.style.backgroundColor = `rgba(0, 0, 0, 1)`
      }
      const duration = time - this.swipeTime;
      if (duration < 1000 &&
        Math.abs(direction[0]) > 30 &&
        Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {

        this.phoneTranslateX = '0';
        this.image.nativeElement.classList.add('horizTranslate');

        if (direction[0] < 0) {
          this.next();
        } else {
          this.previous();
        }
      }
    }
  }

  requestMeta(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.isPhoneMetaDisplay = !this.isPhoneMetaDisplay;
  }
}
