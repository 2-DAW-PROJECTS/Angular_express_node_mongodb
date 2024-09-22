import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../app/core/models/category.model';

@Component({
  selector: 'app-card-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-category.component.html',
  styleUrls: ['./card-category.component.css']
})
export class CardCategoryComponent {
  @Input() category: Category = {} as Category;
  
  constructor() {}
}
