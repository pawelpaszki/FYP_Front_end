export class IContainerModel {
  public id: string;
  public name: string;
  public status: string;
  public state: string;
  public constructor(id: string, name: string, status: string, state: string) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.state = state;
  }
}
