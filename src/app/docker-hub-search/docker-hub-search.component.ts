import { Component, OnInit } from '@angular/core';
import {ImageService} from '../services/image.service';

@Component({
  selector: 'app-docker-hub-search',
  styleUrls: ['./docker-hub-search.component.css'],
  templateUrl: './docker-hub-search.component.html',
})
export class DockerHubSearchComponent implements OnInit {

  public searchPressed: boolean = false;
  public searchTerm: string = '';
  public searchResults: string[] = [];
  public emptyResponse: string = 'No images found with provided search term';
  public emptyResponseReceived: boolean = false;

  constructor(private imageService: ImageService) { }

  public ngOnInit() {
  }

  public updateSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  public searchDockerHub() {
    this.imageService.searchDockerHub(this.searchTerm).subscribe((resp) => {
      this.searchResults = (resp as any).images.sort();
      this.searchPressed = true;
      this.emptyResponseReceived = this.searchResults.length === 0;
    });
  }

}
