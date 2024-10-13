import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { OffertService } from '../../core/service/offert.service';



@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
// export class SearchComponent implements OnInit {
//   @Output() searchEvent: EventEmitter<string> = new EventEmitter();
//   searchValue: string | undefined = '';

//   constructor(private offertService: OffertService) {}

//   ngOnInit(): void {}

//   onSearch() {
//     const encodedSearch = btoa(this.searchValue ?? '');
//     this.searchEvent.emit(encodedSearch);
//   }
// }

export class SearchComponent implements OnInit {
  @Output() searchEvent: EventEmitter<string> = new EventEmitter();
  
  searchValue: string = '';
  suggestions: any[] = [];

  private searchTerms = new Subject<string>();

  constructor(private offertService: OffertService) {}

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.offertService.getSearchSuggestions(term))
    ).subscribe(suggestions => {
      this.suggestions = suggestions;
    });
  }

  onInput() {
    this.searchTerms.next(this.searchValue);
    this.searchEvent.emit(this.searchValue);
  }

  selectSuggestion(suggestion: string) {
    console.log('Selected suggestion:', suggestion);

    this.searchValue = suggestion;
    this.suggestions = [];
    this.searchEvent.emit(this.searchValue);
  }



}
