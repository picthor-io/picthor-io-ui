import { Component, Input, OnInit } from '@angular/core';
import { FileDataService } from '@picthor/file-data/file-data.service';
import { FileData } from '@picthor/file-data/file-data';

@Component({
  selector: 'app-file-data-meta',
  templateUrl: './file-data-meta.component.html',
  styleUrls: ['./file-data-meta.component.css']
})
export class FileDataMetaComponent implements OnInit {

  constructor(protected fileDataService:FileDataService) { }

  ngOnInit(): void {
    this.fileDataService.getMeta(this.fileData.id).subscribe((meta) => {
      this.meta = meta;
    });
  }

  @Input()
  fileData!: FileData;

  @Input()
  desktop!: boolean;

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
}
