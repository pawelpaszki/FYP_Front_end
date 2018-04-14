import {Location} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ImageService} from '../services/image.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit {

  // Chart settings:

  public lineChartData: any[] = [
    {data: [], label: 'Low Vulnerability'},
    {data: [], label: 'Medium Vulnerability'},
    {data: [], label: 'High Vulnerability'},
  ];
  // vuln check dates
  public lineChartLabels: any[] = [];
  public lineChartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
  };
  public vulnerabilityDetailsVisible: boolean = false;

  public vulnerabilityEntries: any[] = [];
  public lineChartColors: any[] = [
    { // yellow
      backgroundColor: 'rgba(255,255,0,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    { // orange
      backgroundColor: 'rgba(77255,140,0,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public visibleEntries: number[] = [];

  public imageName: string  = '';
  public minDate= {year: 2018, month: 2, day: 15};
  public today= new Date();
  public maxDate= {year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate()};
  public from;
  public to;
  public chartGenerated: boolean = false;
  constructor(private route: ActivatedRoute, private location: Location, private imageService: ImageService) { }

  public ngOnInit() {
    this.imageName = this.route.snapshot.params.name;
  }

  public goBack() {
    this.location.back();
  }

  public generateChart() {
    this.lineChartLabels = [];
    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];
    this.lineChartData[2].data = [];
    this.chartGenerated = true;
    const startDate: Date = new Date(this.from.year, this.from.month - 1, this.from.day);
    const endDate: Date = new Date(this.to.year, this.to.month - 1, this.to.day);
    endDate.setHours(23);
    this.imageService.getVulnerabilityCheckRecords(startDate, endDate, this.imageName).subscribe((resp) => {
      this.vulnerabilityEntries = resp;
      for (const entry of (resp as any)) {
          this.lineChartLabels.push(new Date(entry.date).toISOString().split('T')[0]);
          this.lineChartData[0].data.push(entry.lowSeverity.length);
          this.lineChartData[1].data.push(entry.mediumSeverity.length);
          this.lineChartData[2].data.push(entry.highSeverity.length);
        }
      this.lineChartData = this.lineChartData.slice();
      },
    );
  }

  public showVulnDetails() {
    this.vulnerabilityDetailsVisible = !this.vulnerabilityDetailsVisible;
  }

  public updateVisibleEntries(index: number) {
    if (this.visibleEntries.indexOf(index) !== -1) {
      const indexToRemove: number = this.visibleEntries.indexOf(index);
      this.visibleEntries.splice(indexToRemove, 1);
    } else {
      this.visibleEntries.push(index);
    }
  }

}
