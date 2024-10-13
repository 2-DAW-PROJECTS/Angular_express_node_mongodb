import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { OffertService } from '../../core/service/offert.service';



@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent implements OnInit {
  @Output() searchEvent: EventEmitter<string> = new EventEmitter();
  @Input() selectedLocation: string = '';
  
  searchValue: string = '';
  suggestions: any[] = [];
  isHome: boolean = false;

  private searchTerms = new Subject<string>();

  constructor(private offertService: OffertService, private route: ActivatedRoute) {}



  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.isHome = url.length === 0 || url[0].path === 'home';
    });
    
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.offertService.getSearchSuggestions(term, this.selectedLocation))
    ).subscribe(suggestions => {
      this.suggestions = suggestions;
    });
  }

  onInput() {
    this.searchTerms.next(this.searchValue);
    this.searchEvent.emit(this.searchValue);
  }

  selectSuggestion(suggestion: any) {
    console.log('Selected suggestion:', suggestion);

    this.searchValue = suggestion.title;
    this.suggestions = [];
    this.searchEvent.emit(suggestion);
  }
  

}
