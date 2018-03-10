import { Component, OnInit } from '@angular/core';
import {ContainerService} from '../services/container.service';
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

  constructor(private containerService: ContainerService) {
    this.getContainersList();
  }

  public ngOnInit() {
    localStorage.setItem('sortedContainers', '');
  }

  public getContainersList() {
    this.containerService.getContainers().subscribe((resp) => {
      this.containerCollection = [];
      console.log(resp);
      if ((resp as any).containers) {
        for (const container of (resp as any).containers) {
          let exists: boolean = false;
          for (const containerCol of this.containerCollection) {
            if (containerCol.imageName === container.Image) {
              exists = true;
              containerCol.containers.push(
                new IContainerModel(container.Id, container.Names[0], container.Status, container.State));
              break;
            }
          }
          if (!exists) {
            this.containerCollection.push(new IContainerCollection(container.Image));
            this.containerCollection[this.containerCollection.length - 1].containers.push(
              new IContainerModel(container.Id, container.Names[0], container.Status, container.State));
          }
        }
      }
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
