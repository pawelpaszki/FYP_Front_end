import {IContainerModel} from './container.model';
import {IVulnerabilityEntryModel} from './vulnerability-entry.model';

export class IContainerCollection {
  public imageName: string;
  public containers: IContainerModel[] = [];
  public srcExtracted: boolean;
  public vulnComponents: IVulnerabilityEntryModel[] = [];
  public updates: string[]= [];
  public packages: string[]= [];
  public testResults: string[]= [];
  public osDetails: string = '';
  public resultDisplayed: string = '';
  public constructor(imageName: string, srcExtracted: boolean) {
    this.imageName = imageName;
    this.srcExtracted = srcExtracted;
  }
}
