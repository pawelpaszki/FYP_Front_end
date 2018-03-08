import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-freshness-indicator',
  styleUrls: ['./freshness-indicator.component.css'],
  templateUrl: './freshness-indicator.component.html',
})
export class FreshnessIndicatorComponent implements OnInit {

  @Input() public grade: string;
  @Input() public tag: string;
  constructor() { }

  public ngOnInit() {
  }

}
