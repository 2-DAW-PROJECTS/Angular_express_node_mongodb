import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOffertsComponent } from '../shared/list-offerts/list-offerts.component';
import { FiltersComponent } from '../shared/filters/filters.component'; 
import { SearchComponent } from '../shared/search/search.component';
import { Filters } from '../core/models/filters.model';
import { encode } from 'punycode';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ListOffertsComponent, FiltersComponent, SearchComponent],  // Agrega FiltersComponent aquí
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'] 
})
export class ShopComponent {

    // Agrega la referencia al componente ListOfferts
    @ViewChild(ListOffertsComponent) listOfferts!: ListOffertsComponent;

    onFiltersChange(filters: { category?: string, company?: string }) {
        if (this.listOfferts) {
            this.listOfferts.selectedFilters = filters; // Actualiza los filtros
            this.listOfferts.loadOfferts(); // Carga ofertas filtradas
        }
    }
  }
