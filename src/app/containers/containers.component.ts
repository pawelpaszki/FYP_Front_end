import { Component, OnInit } from '@angular/core';
import {IImageModel} from '../images/image.model';
import {ContainerService} from '../services/container.service';
import {ImageService} from '../services/image.service';
import {SrcHandlingService} from '../services/src-handling.service';
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
  public queriedContainers: string[] = []; // disable ui actions
  public visibleResponseAreas: string[] = []; // show response area
  public extractedSrcContainers: string[] = []; // show extract progress
  public vulnCompsChecked: string[] = []; // show vuln comp check progress
  public testsRun: string[] = []; // show test run progress
  public osChecked: string[] = []; // show os check progress
  public packagesChecked: string[] = [];
  private imageList: IImageModel[] = [];


  constructor(private containerService: ContainerService, private imageService: ImageService,
              private srcHandlingService: SrcHandlingService) {
    this.getContainersList();
  }

  public ngOnInit() {
    localStorage.setItem('sortedContainers', '');
  }

  public showResultArea(imageName: string, option: string) {

    const index = this.containerCollection.findIndex((x) => x.imageName === imageName);
    if (this.containerCollection[index].resultDisplayed === option) {
      this.containerCollection[index].resultDisplayed = '';
      this.visibleResponseAreas.splice(this.visibleResponseAreas.indexOf(imageName), 1);
    } else {
      this.containerCollection[index].resultDisplayed = option;
      this.visibleResponseAreas.push(imageName);
    }
  }

  public checkVulnComp(imageName: string) {
    this.queriedContainers.push(imageName);
    this.vulnCompsChecked.push(imageName);
    const that = this;
    async function extractIfNeeded(that) {
      await that.extractSourceCode(imageName);
      that.srcHandlingService.checkVulnerableComponents(imageName).subscribe((resp) => {
        const index = that.containerCollection.findIndex((x) => x.imageName === imageName);
        that.containerCollection[index].updates = (resp as any).updates;
        const updateKey: string = imageName + 'updates';
        const vulnKey: string = imageName + 'vulnerable';
        let updateString: string = '';
        for (const update of (resp as any).updates) {
          updateString += update + ',';
        }
        updateString = updateString.substring(0, updateString.length - 1);
        let vulnerableString: string = '';
        let vulnerableComponents: string[] = [];
        for (const lowVuln of (resp as any).vulnerabilityCheckRecord.lowSeverity) {
          vulnerableComponents.push(lowVuln.name);
          vulnerableString += lowVuln.name + ',';
        }
        for (const mediumVuln of (resp as any).vulnerabilityCheckRecord.mediumSeverity) {
          vulnerableComponents.push(mediumVuln.name);
          vulnerableString += mediumVuln.name + ',';
        }
        for (const highVuln of (resp as any).vulnerabilityCheckRecord.highSeverity) {
          vulnerableComponents.push(highVuln.name);
          vulnerableString += highVuln.name + ',';
        }
        vulnerableString = vulnerableString.substring(0, vulnerableString.length - 1);
        if (vulnerableString.length === 0) {
          vulnerableString = 'No vulnerable components found';
        }
        vulnerableComponents = Array.from(new Set(vulnerableComponents)).sort();
        that.containerCollection[index].vulnComponents = vulnerableComponents;
        localStorage.setItem(updateKey, updateString);
        localStorage.setItem(vulnKey, vulnerableString);
        that.queriedContainers.splice(that.queriedContainers.indexOf(imageName), 1);
        that.vulnCompsChecked.splice(that.vulnCompsChecked.indexOf(imageName), 1);
      });
    }
    extractIfNeeded(that);
  }

  public extractSourceCode(imageName: string): Promise<any>  {
    const p: Promise<any> = new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.containerCollection.findIndex((x) => x.imageName === imageName);
        if (!this.containerCollection[index].srcExtracted) {
          this.extractedSrcContainers.push(imageName);
          let runningContainerIndex: number = -1;
          for (let i = 0; i < this.containerCollection[index].containers.length; i++) {
            if (this.containerCollection[index].containers[i].state === 'running') {
              runningContainerIndex = i;
              break;
            }
          }
          if (runningContainerIndex === -1) {
            this.containerService.startContainer(this.containerCollection[index].containers[0].id).subscribe(() => {
                this.containerCollection[index].containers[0].state = 'running';
                this.containerCollection[index].containers[0].status = 'Up Less than a second';
                this.srcHandlingService.extractSourceCode(
                  imageName, this.containerCollection[index].containers[0].id).subscribe(() => {
                  this.extractedSrcContainers.splice(this.extractedSrcContainers.indexOf(imageName), 1);
                  this.containerCollection[index].srcExtracted = true;
                  resolve('done');
                });
              },
            );
          } else {
            this.srcHandlingService.extractSourceCode(
              imageName, this.containerCollection[index].containers[runningContainerIndex].id).subscribe(() => {
              this.extractedSrcContainers.splice(this.extractedSrcContainers.indexOf(imageName), 1);
              this.containerCollection[index].srcExtracted = true;
              resolve('done');
            });
          }
        } else {
          resolve('');
        }
      }, 200);
    });
    return p;
  }

  public getImageTag(imageId: string): string {
    for (const image of this.imageList) {
      const id = imageId.substring(imageId.indexOf(':') + 1);
      if (id === image.id) {
        return image.tag;
      }
    }
    return 'latest';
  }

  public getContainersList() {
    this.containerService.getContainers().subscribe((resp) => {
      this.imageService.getImages().subscribe((response) => {
        this.srcHandlingService.getExtractedDirectories().subscribe((res) => {
          const extractedDirList: string[] = (res as any).directoryArray;
          this.imageList = (response as any).imagesList;
          this.containerCollection = [];
          if ((resp as any).containers) {
            for (const container of (resp as any).containers) {
              const name = container.Image.toString().includes(':') ? container.Image : container.Image.concat(
                ':' + this.getImageTag(container.ImageID));
              const imageNameTokens: string[] = name.split('/');
              const dirName = imageNameTokens[0].toUpperCase() + imageNameTokens[1].toLowerCase();
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
                this.containerCollection.push(new IContainerCollection(name, extractedDirList.indexOf(dirName) !== -1));
                this.containerCollection[this.containerCollection.length - 1].containers.push(
                  new IContainerModel(
                    container.Id, container.Names[0], container.Status, container.State, container.ImageID));
                const vulnCompsKey: string = name + 'vulnerable';
                if (localStorage.getItem(vulnCompsKey) !== null) {
                  let vulnComponents: string[] = localStorage.getItem(vulnCompsKey).split(',');
                  vulnComponents = Array.from(new Set(vulnComponents)).sort();
                  this.containerCollection[this.containerCollection.length - 1].vulnComponents = vulnComponents;
                }
                const updateKey: string = name + 'updates';
                if (localStorage.getItem(updateKey) !== null) {
                  this.containerCollection[this.containerCollection.length - 1].updates =
                    localStorage.getItem(updateKey).split(',');
                }
              }
            }
          }
        });
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
