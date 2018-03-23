import { Component, OnInit } from '@angular/core';
import {ImageService} from '../services/image.service';
import {DockerSearchResultsModel} from './docker-search-results.model';

@Component({
  selector: 'app-docker-hub-search',
  templateUrl: './docker-hub-search.component.html',
})
export class DockerHubSearchComponent implements OnInit {

  public searchPressed: boolean = false;
  public searchTerm: string = '';
  public searchResults: DockerSearchResultsModel[] = [];
  public emptyResponse: string = 'No images found with provided search term';
  public emptyResponseReceived: boolean = false;

  constructor(public imageService: ImageService) { }

  public ngOnInit() {
  }

  public updateSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  public searchDockerHub() {
    this.searchResults = [];
    this.imageService.searchDockerHub(this.searchTerm).subscribe((resp) => {
      for (const result of (resp as any).results) {
        this.searchResults.push(new DockerSearchResultsModel(
          result.name, result. description, result.is_official, result.star_count));
      }
      this.searchPressed = true;
      this.emptyResponseReceived = this.searchResults.length === 0;
    });
  }

  public pullImage(imageName: string) {
    this.imageService.pullImage(imageName).subscribe(() => {
        this.imageService.pulledImageInProgress.splice(this.imageService.pulledImageInProgress.indexOf(imageName), 1);
      },
    );
  }

}
