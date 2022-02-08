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

  @ViewChild('image')
  image: any;

  @Input()
  imageId!: number;

  @Output()
  showNext = new EventEmitter<number>();

  @Output()
  showPrevious = new EventEmitter<number>();
  private swipeCoord!: [number, number];
  private swipeTime!: number;

  loading: boolean = true;
  mobile = false;
  imgRotation: number = 0;
  state = 'normal';
  isShown = false;
  meta?: any;

  constructor(protected fileDataService: FileDataService) {}

  ngOnInit(): void {
    this.fileData$.subscribe((fileData) => {
      this.isOpen = true;
      window.screen.width <= 1200? this.mobile = true : this.mobile = false
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

  downloadImage(modalImage?: FileData) {
    this.fileDataService.downloadImage(modalImage);
  }

  rotateImg() {
    let img = this.image.nativeElement;
    this.imgRotation += 90;
    if (this.imgRotation == 360) {
      this.imgRotation = 0;
    }
    img.style.transform = `rotate(${this.imgRotation}deg)`;
  }

  next() {
    this.showNext.emit();
  }

  previous() {
    this.showPrevious.emit();
  }

  fullscreen(){

    console.log(this.image);
    if (!document.fullscreenElement) {
      this.image.nativeElement.requestFullscreen({ navigationUI: "hide" }).catch((err: { message: any; name: any; }) => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  swipe(e: TouchEvent, when: string){
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    }else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;if (duration < 1000
        && Math.abs(direction[0]) > 30
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        if (direction[0] < 0) {
          this.next()
        } else {
          this.previous();
        }
      }
    }
  }
}