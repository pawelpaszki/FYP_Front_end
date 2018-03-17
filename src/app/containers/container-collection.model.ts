import {IContainerModel} from './container.model';

export class IContainerCollection {
  public imageName: string;
  public containers: IContainerModel[] = [];
  public srcExtracted: boolean;
  public vulnComponents: string[] = [];
  public updates: string[]= [];
  public testResults: string[]= [];
  public osDetails: string = '';
  public resultDisplayed: string = '';
  public constructor(imageName: string, srcExtracted: boolean) {
    this.imageName = imageName;
    this.srcExtracted = srcExtracted;
  }
}
