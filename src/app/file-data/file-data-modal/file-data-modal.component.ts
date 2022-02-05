import {
  Component,
  EventEmitter,
  Input, OnChanges, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FileData } from '@picthor/file-data/file-data';
import { Observable } from 'rxjs';
import { FileDataService } from '@picthor/file-data/file-data.service';

@Component({
  selector: 'app-file-data-modal',
  templateUrl: './file-data-modal.component.html',
  styleUrls: ['./file-data-modal.component.css']
})
export class FileDataModalComponent implements OnInit, OnDestroy , OnChanges{
  @Input()
  openModal! : boolean;
  @Input()
  modalImage?: FileData;
  @Input()
  modalMeta$?: Observable<any[]>;
  @Input()
  fileArr!: FileData[];

  @Input()
  imageId!: number;

  @Output()
  modalVisible = new EventEmitter<boolean>();

  @Output()
  showNext = new EventEmitter<number>();

  @Output()
  showPrevious = new EventEmitter<number>();

  loading: boolean = true
  imgRotation: number = 0;
  state = 'normal';
  @ViewChild('imageRotate') rotate: any;

  isShown = false;

  @Input()
  fileData! : FileData;

  tinyPreview?:any;
  fullPreview?: any;

  constructor(protected fileDataService: FileDataService) { }



  ngOnInit(): void {
  }

  ngOnChanges(){
    console.log('MODALIMAGEON INIT', this.modalImage);
    console.log("INIT MODAL");
    this.fullPreview = FileData.previewUrl(this.modalImage!, 1080);
    this.tinyPreview = FileData.previewUrl(this.modalImage!);
  }

  ngOnDestroy():void {
    console.log("DETROY MODAL");
  }

  modalClose() {


    //this.galleryId.emit(this.fileArr.indexOf());
    //console.log(this.fileArr.indexOf(this.modalImage));
    this.modalImage = undefined;
    this.openModal = false;
    this.modalVisible.emit(false)


  }


  public getFormat(data:any) : String{
    return data?.image["Format"] ||
      data?.image["format"] ||
      data?.image["Format"];
  }

  public getImageGeometry(data: any): String{

    return String(data?.image.pageGeometry["width"] + " x " +
      data?.image.pageGeometry["height"]);


  }

  public getCreationDate(data:any) : Date{
    return new Date(data?.image.properties["date:created"] ||
      data?.image["date:updated"] ||
      data?.image.properties["date:create"]);
  }



  public getModifiedDate(data:any) : Date {
    return new Date(data?.image.properties["date:created"] ||
      data?.image.properties["date:modify"] ||
      data?.image.properties["date:create"]);

  }

  // rotateImg(){
  //   this.state == 'normal' ? this.state = 'rotated' : this.state= 'normal';
  // }

  downloadImage(modalImage? : FileData){
    this.fileDataService.downloadImage(modalImage);
  }

  previewUrl(file: FileData, width = 250) {
    return FileData.previewUrl(file, width);
  }

  rotateImg(){
    let img = this.rotate.nativeElement;
    this.imgRotation+= 90;
    if(this.imgRotation == 360){
      this.imgRotation = 0;
    }

    img.style.transform = `rotate(${this.imgRotation}deg)`;
  }
  log(val: any) {
    return typeof val;
  }


  onLoad() {
    this.loading = false;
  }

  parseMeta(meta: Observable<any>){
    meta = this.modalMeta$!;
    meta.subscribe(x => console.log(x));
  }


  modalNext() {
    if (this.modalImage && this.fileArr.indexOf(this.modalImage) < this.fileArr.length - 1) {
      this.showNext.emit(this.fileArr.indexOf(this.modalImage))
    }
    else{
      if (this.modalImage) {
        this.showPrevious.emit(0);
      }
    }
  }

  modalPrevious() {
    if (this.modalImage && this.fileArr.indexOf(this.modalImage) > 0) {
      this.showPrevious.emit(this.fileArr.indexOf(this.modalImage))
    }
    else{
      if (this.modalImage) {
        this.showPrevious.emit(this.fileArr.length)
      }
    }
  }
}
