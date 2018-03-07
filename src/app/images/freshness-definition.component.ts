import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-freshness-definition',
  styleUrls: ['./freshness-definition.component.css'],
  templateUrl: './freshness-definition.component.html',
})
export class FreshnessDefinitionComponent implements OnInit {

  @Input() public grade: string;
  constructor() { }

  public ngOnInit() {
  }

}
