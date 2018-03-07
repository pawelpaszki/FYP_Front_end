export class IImageModel {
  public freshnessGrade: string;
  public id: string;
  public name: string;
  public size: string;
  public tag: string;
  public constructor(freshnessGrade: string, id: string, name: string, size: string, tag: string) {
    this.freshnessGrade = freshnessGrade;
    this.id = id;
    this.name = name;
    this.size = size;
    this.tag = tag;
  }
}
