import {Component} from '@angular/core';
import {SrcHandlingService} from '../services/src-handling.service';
import {IPaginationModel} from './pagination.model';

@Component({
  selector: 'app-logs',
  styleUrls: ['./logs.component.css'],
  templateUrl: './logs.component.html',
})
export class LogsComponent {

  public paginationElements: IPaginationModel[] = [];
  public pageItems: [number, number];
  public itemsPerPage: number = 50;
  public logItems: string[];
  public pageItemsButtonsToShow: number[] = [];

  constructor(private srcHandlingService: SrcHandlingService) {
    this.getLogs();
  }

  public getLogs() {
    this.srcHandlingService.getLogs().subscribe((resp) => {
      this.logItems = (resp as any).logs;
      this.setPaginationElements();
    });
  }

  public setItemsPerPage(value: number) {
    this.itemsPerPage = value;
    this.setPaginationElements();
  }

  public setPageItems(start: number, end: number, index: number) {
    this.pageItemsButtonsToShow = [];
    this.pageItems = [start, end];
    if (this.paginationElements.length < 6) {
      for (let i = 0; i < this.paginationElements.length; i++) {
        this.pageItemsButtonsToShow.push(i);
      }
    } else {
      this.pageItemsButtonsToShow.push(0);
      this.pageItemsButtonsToShow.push(index);
      this.pageItemsButtonsToShow.push(this.paginationElements.length - 1);
      if (index - 1 >= 0) {
        this.pageItemsButtonsToShow.push(index - 1);
      }
      if (index + 1 < this.paginationElements.length) {
        this.pageItemsButtonsToShow.push(index + 1);
      }
      const set = new Set(this.pageItemsButtonsToShow);
      const values = set.values();
      this.pageItemsButtonsToShow = Array.from(values).sort();
    }
  }

  public setPaginationElements() {
    this.paginationElements = [];
    for (let i = 0; i < this.logItems.length; i += this.itemsPerPage) {
      if (i + this.itemsPerPage >= this.logItems.length) {
        this.paginationElements.push(new IPaginationModel(i + 1, this.logItems.length));
      } else {
        this.paginationElements.push(new IPaginationModel(i + 1, i + this.itemsPerPage));
      }
    }
    this.setPageItems(this.paginationElements[0].startIndex, this.paginationElements[0].endIndex, 0);
  }

}
