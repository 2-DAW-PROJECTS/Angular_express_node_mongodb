import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOffertsComponent } from '../shared/list-offerts/list-offerts.component';
import { FiltersComponent } from '../shared/filters/filters.component';
import { SearchComponent } from '../shared/search/search.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ListOffertsComponent, FiltersComponent, SearchComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  @ViewChild(ListOffertsComponent) listOfferts!: ListOffertsComponent;

  onFiltersChange(filters: { category?: string, company?: string, salaryMin?: number, salaryMax?: number }) {
    if (this.listOfferts) {
        this.listOfferts.selectedFilters = {
            ...filters, 
            offset: 0,   
            limit: this.listOfferts.limit  
        }; 
        this.listOfferts.currentPage = 1;  
        this.listOfferts.loadOfferts();   
    }
}


  onSearch(searchTerm: string) {
    if (this.listOfferts) {
      this.listOfferts.onSearch(searchTerm);
    }
  }
}
