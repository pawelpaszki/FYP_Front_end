import { Component, OnInit } from '@angular/core';
import {IImageModel} from '../images/image.model';
import {ContainerService} from '../services/container.service';
import {ImageService} from '../services/image.service';
import {SrcHandlingService} from '../services/src-handling.service';
import {IContainerCollection} from './container-collection.model';
import {IContainerModel} from './container.model';
import {IVulnerabilityEntryModel} from './vulnerability-entry.model';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
})
export class ContainersComponent implements OnInit {

  public containerCollection: IContainerCollection[] = [];
  public searchTerm: string = '';
  public visibleResponseAreas: string[] = []; // show response area
  public hoveredImageNameDiv: string[] = [];
  public hoveredContainerDiv: string[] = [];
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

  public checkOS(imageName: string) {
    this.srcHandlingService.queriedContainers.push(imageName);
    this.srcHandlingService.osChecked.push(imageName);
    const that = this;
    async function extractIfNeeded(that) {
      await that.extractSourceCode(imageName);
      that.srcHandlingService.checkOS(imageName).subscribe((resp) => {
        const index = that.containerCollection.findIndex((x) => x.imageName === imageName);
        const osString: string = (resp as any).name + ':' + (resp as any).version +
          ' (latest: ' + (resp as any).latest + ')';
        that.containerCollection[index].osDetails = osString;
        const osKey: string = imageName + 'os';
        if (imageName.indexOf('latest') === -1) {
          localStorage.setItem(osKey, osString);
        }
        that.srcHandlingService.queriedContainers.splice(
          that.srcHandlingService.queriedContainers.indexOf(imageName), 1);
        that.srcHandlingService.osChecked.splice(that.srcHandlingService.osChecked.indexOf(imageName), 1);
      });
    }
    extractIfNeeded(that);
  }

  public checkPackages(imageName: string) {
    this.srcHandlingService.queriedContainers.push(imageName);
    this.srcHandlingService.packagesChecked.push(imageName);
    const that = this;
    async function extractIfNeeded(that) {
      await that.extractSourceCode(imageName);
      that.srcHandlingService.checkPackages(imageName).subscribe((resp) => {
        const index = that.containerCollection.findIndex((x) => x.imageName === imageName);
        console.log(resp);
        that.containerCollection[index].packages = (resp as any).packages;
        const packagesKey: string = imageName + 'packages';
        let packagesString: string = '';
        for (const pack of (resp as any).packages) {
          packagesString += pack + ',';
        }
        packagesString = packagesString.substring(0, packagesString.length - 1);
        if (imageName.indexOf('latest') === -1) {
          localStorage.setItem(packagesKey, packagesString);
        }
        that.srcHandlingService.queriedContainers.splice(
          that.srcHandlingService.queriedContainers.indexOf(imageName), 1);
        that.srcHandlingService.packagesChecked.splice(that.srcHandlingService.packagesChecked.indexOf(imageName), 1);
      });
    }
    extractIfNeeded(that);
  }

  public runTests(imageName: string) {
    this.srcHandlingService.queriedContainers.push(imageName);
    this.srcHandlingService.testsRun.push(imageName);
    const that = this;
    async function extractIfNeeded(that) {
      await that.extractSourceCode(imageName);
      that.srcHandlingService.runNpmTests(imageName).subscribe((resp) => {
        const index = that.containerCollection.findIndex((x) => x.imageName === imageName);
        that.containerCollection[index].testResults = (resp as any).testResults;
        const testKey: string = imageName + 'tests';
        let testString: string = '';
        for (const test of (resp as any).testResults) {
          testString += test + ',';
        }
        testString = testString.substring(0, testString.length - 1);
        if (imageName.indexOf('latest') === -1) {
          localStorage.setItem(testKey, testString);
        }
        that.srcHandlingService.queriedContainers.splice(
          that.srcHandlingService.queriedContainers.indexOf(imageName), 1);
        that.srcHandlingService.testsRun.splice(that.srcHandlingService.testsRun.indexOf(imageName), 1);
      });
    }
    extractIfNeeded(that);
  }

  public checkVulnComp(imageName: string) {
    this.srcHandlingService.queriedContainers.push(imageName);
    this.srcHandlingService.vulnCompsChecked.push(imageName);
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
        const vulnEntries: IVulnerabilityEntryModel[] = [];
        vulnEntries.push(...(resp as any).vulnerabilityCheckRecord.lowSeverity);
        vulnEntries.push(...(resp as any).vulnerabilityCheckRecord.mediumSeverity);
        vulnEntries.push(...(resp as any).vulnerabilityCheckRecord.highSeverity);
        if (vulnEntries.length === 0) {
          vulnEntries.push(new IVulnerabilityEntryModel('', '', '', ''));
        }
        that.containerCollection[index].vulnComponents = vulnEntries;
        if (imageName.indexOf('latest') === -1) {
          localStorage.setItem(updateKey, updateString);
          localStorage.setItem(vulnKey, JSON.stringify(vulnEntries));
        }
        that.srcHandlingService.queriedContainers.splice(
          that.srcHandlingService.queriedContainers.indexOf(imageName), 1);
        that.srcHandlingService.vulnCompsChecked.splice(that.srcHandlingService.vulnCompsChecked.indexOf(imageName), 1);
      });
    }
    extractIfNeeded(that);
  }

  public extractSourceCode(imageName: string): Promise<any>  {
    const p: Promise<any> = new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.containerCollection.findIndex((x) => x.imageName === imageName);
        if (!this.containerCollection[index].srcExtracted) {
          this.srcHandlingService.extractedSrcContainers.push(imageName);
          let runningContainerIndex: number = -1;
          for (let i = 0; i < this.containerCollection[index].containers.length; i++) {
            if (this.containerCollection[index].containers[i].state === 'running') {
              runningContainerIndex = i;
              break;
            }
          }
          if (runningContainerIndex === -1) {
            this.containerService.startContainer(this.containerCollection[index].containers[0].id).subscribe(() => {
                this.containerService.startedContainerInProgress.splice(
                  this.containerService.startedContainerInProgress.indexOf(
                    this.containerCollection[index].containers[0].id, 1));
                this.containerCollection[index].containers[0].state = 'running';
                this.containerCollection[index].containers[0].status = 'Up Less than a second';
                this.srcHandlingService.extractSourceCode(
                  imageName, this.containerCollection[index].containers[0].id).subscribe(() => {
                  this.srcHandlingService.extractedSrcContainers.splice(
                    this.srcHandlingService.extractedSrcContainers.indexOf(imageName), 1);
                  this.containerCollection[index].srcExtracted = true;
                  resolve('');
                });
              },
            );
          } else {
            this.srcHandlingService.extractSourceCode(
              imageName, this.containerCollection[index].containers[runningContainerIndex].id).subscribe(() => {
              this.srcHandlingService.extractedSrcContainers.splice(
                this.srcHandlingService.extractedSrcContainers.indexOf(imageName), 1);
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
              let dirName: string = '';
              if (imageNameTokens.length === 2) {
                dirName = imageNameTokens[0].toUpperCase() + imageNameTokens[1].toLowerCase();
              } else {
                dirName = imageNameTokens[0];
              }
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
                  let vulnComponents: IVulnerabilityEntryModel[] = JSON.parse(localStorage.getItem(vulnCompsKey));
                  vulnComponents = Array.from(new Set(vulnComponents)).sort();
                  this.containerCollection[this.containerCollection.length - 1].vulnComponents = vulnComponents;
                }
                const updateKey: string = name + 'updates';
                if (localStorage.getItem(updateKey) !== null) {
                  this.containerCollection[this.containerCollection.length - 1].updates =
                    localStorage.getItem(updateKey).split(',');
                }
                const packageKey: string = name + 'packages';
                if (localStorage.getItem(packageKey) !== null) {
                  this.containerCollection[this.containerCollection.length - 1].packages =
                    localStorage.getItem(packageKey).split(',');
                }
                const testKey: string = name + 'tests';
                if (localStorage.getItem(testKey) !== null) {
                  this.containerCollection[this.containerCollection.length - 1].testResults =
                    localStorage.getItem(testKey).split(',');
                }
                const osKey: string = name + 'os';
                if (localStorage.getItem(osKey) !== null) {
                  this.containerCollection[this.containerCollection.length - 1].osDetails =
                    localStorage.getItem(osKey);
                }
              }
            }
          }
        });
      });
    });
  }

  public startContainer(containerId: string) {
    this.hoveredContainerDiv = [];
    this.containerService.startContainer(containerId).subscribe(() => {
        this.containerService.startedContainerInProgress.splice(
          this.containerService.startedContainerInProgress.indexOf(containerId, 1));
        this.getContainersList();
        this.sort(true);
      },
    );
  }

  public stopContainer(containerId: string) {
    this.hoveredContainerDiv = [];
    this.containerService.stopContainer(containerId).subscribe(() => {
        this.containerService.stoppedContainerInProgress.splice(
          this.containerService.stoppedContainerInProgress.indexOf(containerId, 1));
        this.getContainersList();
        this.sort(true);
      },
    );
  }

  public removeContainer(containerId: string) {
    this.hoveredContainerDiv = [];
    this.containerService.removeContainer(containerId).subscribe(() => {
        this.containerService.removedContainerInProgress.splice(
          this.containerService.removedContainerInProgress.indexOf(containerId, 1));
        let collectionIndex = 0;
        let containersIndex = 0;
        for (let i = 0; i < this.containerCollection.length; i++) {
          for (let j = 0; j < this.containerCollection[i].containers.length; j++) {
            if (this.containerCollection[i].containers[j].id === containerId) {
              collectionIndex = i;
              containersIndex = j;
              break;
            }
          }
        }
        this.containerCollection[collectionIndex].containers.splice(containersIndex, 1);
        if (this.containerCollection[collectionIndex].containers.length === 0) {
          this.containerCollection.splice(collectionIndex, 1);
        }
      },
    );
  }

  public mouseEnterContainerDiv(id: string) {
    this.hoveredContainerDiv.push(id);
  }

  public mouseLeaveContainerDiv() {
    this.hoveredContainerDiv = [];
  }

  public mouseEnterImageNameDiv(imageName: string) {
    this.hoveredImageNameDiv.push(imageName);
  }

  public mouseLeaveImageNameDiv() {
    this.hoveredImageNameDiv = [];
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
