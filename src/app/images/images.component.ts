import { Component, OnInit } from '@angular/core';
import {ContainerService} from '../services/container.service';
import {ImageService} from '../services/image.service';
import {IImageModel} from './image.model';

@Component({
  selector: 'app-images',
  styleUrls: ['./images.component.css'],
  templateUrl: './images.component.html',
})
export class ImagesComponent implements OnInit {

  public hoveredImageDivId: string[] = [];
  public hoveredImageDivTag: string[] = [];
  public images: IImageModel[] = [];
  public showFreshnessDefinition: boolean;
  private token: string;

  constructor(public imageService: ImageService, public containerService: ContainerService) {
    this.getImagesList();
  }

  public ngOnInit() {
    localStorage.setItem('sortedImages', '');
    this.showFreshnessDefinition = false;
    this.token = localStorage.getItem('token');
  }

  public mouseEnter() {
    this.showFreshnessDefinition = true;
  }

  public mouseLeave() {
    this.showFreshnessDefinition = false;
  }

  public mouseEnterDiv(id: string, tag: string) {
    this.hoveredImageDivId.push(id);
    this.hoveredImageDivTag.push(tag);
  }

  public mouseLeaveDiv(id: string, tag: string) {
    this.hoveredImageDivId.splice(this.hoveredImageDivId.indexOf(id), 1);
    this.hoveredImageDivTag.splice(this.hoveredImageDivTag.indexOf(tag), 1);
  }

  public removeImage(id: string) {
    this.imageService.removeImage(id).subscribe(() => {
        this.getImagesList();
        this.imageService.imageRemovalInProgress.splice(this.imageService.imageRemovalInProgress.indexOf(id), 1);
      },
    );
  }

  public getImagesList() {
    this.imageService.getImages().subscribe((resp) => {
      this.images = (resp as any).imagesList;
    });
  }

  public createContainer(name: string) {
    console.log('create container');
    this.containerService.createContainer(name).subscribe(() => {
      this.containerService.createdContainerInProgress.splice(
        this.containerService.createdContainerInProgress.indexOf(name), 1);
    });
  }

  public sort() {
    let previous: number = -1;
    let next: number = 1;
    const sorted: string = localStorage.getItem('sortedImages');
    if (sorted === 'asc') {
      localStorage.setItem('sortedImages', 'desc');
      previous = 1;
      next = -1;
    } else {
      localStorage.setItem('sortedImages', 'asc');
    }
    this.images.sort((a, b) => (a.name > b.name) ? next : ((b.name > a.name) ? previous : 0) );
  }
}
