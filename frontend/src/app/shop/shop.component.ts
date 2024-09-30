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

  // Maneja los cambios en los filtros
  onFiltersChange(filters: { category?: string, company?: string, salaryMin?: number, salaryMax?: number }) {
    if (this.listOfferts) {
        this.listOfferts.selectedFilters = {
            ...filters,  // Include the provided filters
            offset: 0,   // Always reset offset to 0 when filters change
            limit: this.listOfferts.limit  // Maintain the current limit
        }; 
        this.listOfferts.currentPage = 1;  // Reset to page 1 on filter change
        this.listOfferts.loadOfferts();    // Load offers with the new filters
    }
}


  

  // Maneja el evento de búsqueda
  onSearch(searchTerm: string) {
    if (this.listOfferts) {
      this.listOfferts.onSearch(searchTerm); // Llama al método onSearch del ListOffertsComponent
    }
  }
}
