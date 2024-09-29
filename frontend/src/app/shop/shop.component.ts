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
  onFiltersChange(filters: { category?: string, company?: string }) {
    if (this.listOfferts) {
      this.listOfferts.selectedFilters = filters; // Actualiza los filtros
      this.listOfferts.loadOfferts(); // Carga ofertas filtradas
    }
  }

  // Maneja el evento de búsqueda
  onSearch(searchTerm: string) {
    if (this.listOfferts) {
      this.listOfferts.onSearch(searchTerm); // Llama al método onSearch del ListOffertsComponent
    }
  }
}
