import { Component, OnInit } from '@angular/core';
import {ImageService} from '../services/image.service';
import {IImageModel} from './image.model';

@Component({
  selector: 'app-images',
  styleUrls: ['./images.component.css'],
  templateUrl: './images.component.html',
})
export class ImagesComponent implements OnInit {

  public images: IImageModel[] = [];

  public showFreshnessDefinition: boolean;

  constructor(private imageService: ImageService) {
    this.imageService.getImages().subscribe((resp) => {
      console.log(resp);
      this.images = (resp as any).imagesList;
      console.log(this.images);
    });
  }

  public ngOnInit() {
    this.showFreshnessDefinition = false;
  }

  public mouseEnter() {
    this.showFreshnessDefinition = true;
  }

  public mouseLeave() {
    this.showFreshnessDefinition = false;
  }

  public removeImage(id: string) {
    this.imageService.removeImage(id).subscribe(() => {
      this.imageService.getImages().subscribe((resp) => {
        this.images = (resp as any).imagesList;
      });
      },
    );
  }
}
