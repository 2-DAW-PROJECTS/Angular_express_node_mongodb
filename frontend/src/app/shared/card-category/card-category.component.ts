import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../app/core/models/category.model';

@Component({
  selector: 'app-card-category',
  standalone: true,
  imports: [CommonModule, RouterModule],  
  templateUrl: './card-category.component.html',
  styleUrls: ['./card-category.component.css']
})
export class CardCategoryComponent {
  @Input() category: Category = {} as Category;

  constructor() {}
}
