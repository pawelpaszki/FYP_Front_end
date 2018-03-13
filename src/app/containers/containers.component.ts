import { Component, OnInit } from '@angular/core';
import {IImageModel} from '../images/image.model';
import {ContainerService} from '../services/container.service';
import {ImageService} from '../services/image.service';
import {IContainerCollection} from './container-collection.model';
import {IContainerModel} from './container.model';

@Component({
  selector: 'app-containers',
  styleUrls: ['./containers.component.css'],
  templateUrl: './containers.component.html',
})
export class ContainersComponent implements OnInit {

  public containerCollection: IContainerCollection[] = [];
  public searchTerm: string = '';
  private imageList: IImageModel[] = [];

  constructor(private containerService: ContainerService, private imageService: ImageService) {
    this.getContainersList();
  }

  public ngOnInit() {
    localStorage.setItem('sortedContainers', '');
  }

  public getImageTag(imageId: string): string {
    for (const image of this.imageList) {
      const id = imageId.substring(imageId.indexOf(':') + 1);
      if (id === image.id) {
        console.log('equals');
        console.log(image.tag);
        return image.tag;
      }
    }
    return 'latest';
  }

  public getContainersList() {
    this.containerService.getContainers().subscribe((resp) => {
      this.imageService.getImages().subscribe((response) => {
        this.imageList = (response as any).imagesList;
        this.containerCollection = [];
        console.log(resp);
        if ((resp as any).containers) {
          for (const container of (resp as any).containers) {
            const name = container.Image.toString().includes(':') ? container.Image : container.Image.concat(
              ':' + this.getImageTag(container.ImageID));
            let exists: boolean = false;
            for (const containerCol of this.containerCollection) {
              if (containerCol.imageName === name) {
                exists = true;
                containerCol.containers.push(
                  new IContainerModel(
                    container.Id, container.Names[0], container.Status, container.State, container.ImageID));
                break;
              }
            }
            if (!exists) {
              this.containerCollection.push(new IContainerCollection(name));
              this.containerCollection[this.containerCollection.length - 1].containers.push(
                new IContainerModel(
                  container.Id, container.Names[0], container.Status, container.State, container.ImageID));
            }
          }
        }
      });
    });
  }

  public startContainer(containerId: string) {
    this.containerService.startContainer(containerId).subscribe(() => {
        this.getContainersList();
        this.sort(true);
      },
    );
  }

  public stopContainer(containerId: string) {
    this.containerService.stopContainer(containerId).subscribe(() => {
        this.getContainersList();
        this.sort(true);
      },
    );
  }

  public removeContainer(containerId: string) {
    this.containerService.removeContainer(containerId).subscribe(() => {
        this.getContainersList();
        this.sort(true);
      },
    );
  }

  public sort(noSortChange?: boolean) {
    let previous: number = -1;
    let next: number = 1;
    const sorted: string = localStorage.getItem('sortedContainers');
    if (!noSortChange) {
      if (sorted === 'asc') {
        localStorage.setItem('sortedContainers', 'desc');
        previous = 1;
        next = -1;
      } else {
        localStorage.setItem('sortedContainers', 'asc');
      }
    } else {
      if (sorted === 'desc') {
        previous = 1;
        next = -1;
      }
    }
    this.containerCollection.sort((a, b) => (a.imageName > b.imageName)
      ? next : ((b.imageName > a.imageName) ? previous : 0) );
  }

  public filterContainers(imageName: string) {
    this.searchTerm = imageName;
  }

}
