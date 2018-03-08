import {IContainerModel} from './container.model';

export class IContainerCollection {
  public imageName: string;
  public containers: IContainerModel[] = [];
  public constructor(imageName: string) {
    this.imageName = imageName;
  }
}
