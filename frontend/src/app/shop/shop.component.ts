import { Component, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOffertsComponent } from '../shared/list-offerts/list-offerts.component';
import { FiltersComponent } from '../shared/filters/filters.component';  // Agrega esta línea
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
  @ViewChild('listOfferts') listOfferts!: ListOffertsComponent;

  /*CREO QUE NO HACE FALTA_________________________________________________________*/
  
}
