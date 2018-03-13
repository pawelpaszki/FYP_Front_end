export class IContainerModel {
  public id: string;
  public name: string;
  public status: string;
  public state: string;
  public imageId: string
  public constructor(id: string, name: string, status: string, state: string, imageId: string) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.state = state;
    this.imageId = imageId;
  }
}
