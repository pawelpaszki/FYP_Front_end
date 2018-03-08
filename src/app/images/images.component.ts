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
    this.getImagesList();
  }

  public ngOnInit() {
    localStorage.setItem('sorted', '');
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
        this.getImagesList();
      },
    );
  }

  public getImagesList() {
    this.imageService.getImages().subscribe((resp) => {
      this.images = (resp as any).imagesList;
    });
  }

  public sort() {
    let previous: number = -1;
    let next: number = 1;
    const sorted: string = localStorage.getItem('sorted');
    if (sorted === 'asc') {
      localStorage.setItem('sorted', 'desc');
      previous = 1;
      next = -1;
    } else {
      localStorage.setItem('sorted', 'asc');
    }
    console.log(sorted);
    this.images.sort((a, b) => (a.name > b.name) ? next : ((b.name > a.name) ? previous : 0) );
  }
}
