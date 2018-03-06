import { Component, OnInit } from '@angular/core';
import {ToasterConfig} from 'angular2-toaster';

@Component({
  selector: 'app-images',
  styleUrls: ['./images.component.css'],
  templateUrl: './images.component.html',
})
export class ImagesComponent implements OnInit {

  constructor() { }

  public ngOnInit() {
    console.log(localStorage.getItem('token'));
  }
}
