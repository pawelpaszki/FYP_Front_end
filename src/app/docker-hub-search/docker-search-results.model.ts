export class DockerSearchResultsModel {
  public name: string;
  public description: string;
  public official: boolean;
  public stars: number;
  public constructor(name: string, description: string, official: boolean, stars: number) {
    this.name = name;
    this.description = description;
    this.official = official;
    this.stars = stars;
  }
}
