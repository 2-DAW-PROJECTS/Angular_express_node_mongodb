import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOffertsComponent } from '../shared/list-offerts/list-offerts.component';
import { FiltersComponent } from '../shared/filters/filters.component';  // Agrega esta línea

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ListOffertsComponent, FiltersComponent],  // Agrega FiltersComponent aquí
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'] 
})
export class ShopComponent {}
