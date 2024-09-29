import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  searchValue: string | undefined = '';

  constructor(private offertService: OffertService) {}

  ngOnInit(): void {}

  onSearch() {
    const encodedSearch = btoa(this.searchValue ?? '');
    this.searchEvent.emit(encodedSearch);
  }
}