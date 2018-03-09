import {Location} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-chart',
  styleUrls: ['./chart.component.css'],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit {

  public imageName: string  = '';
  public minDate= {year: 2018, month: 1, day: 14};
  public today= new Date();
  public maxDate= {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate()};
  public from;
  public to;
  public chartGenerated: boolean = false;
  constructor(private route: ActivatedRoute, private location: Location) { }

  public ngOnInit() {
    this.imageName = this.route.snapshot.params.name;
  }

  public goBack() {
    this.location.back();
  }

  public generateChart() {
    this.chartGenerated = true;
    console.log(this.from);
    console.log(this.to);
  }

}
