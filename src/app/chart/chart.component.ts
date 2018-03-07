import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-chart',
  styleUrls: ['./chart.component.css'],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit {

  public imageName: string  = '';
  constructor(private route: ActivatedRoute) { }

  public ngOnInit() {
    this.imageName = this.route.snapshot.params.name;
  }

}
