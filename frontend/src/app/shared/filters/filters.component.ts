import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { CategoryService } from '../../core/service/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],  // Asegúrate de agregar esto
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: string | null = null;

  @Output() categoryChange = new EventEmitter<string | null>();

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.all_categories({}).subscribe({
      next: (data) => {
        this.categories = data.categorys;
      },
      error: (err) => {
        console.error('Error fetching categories', err);
      }
    });
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.value;
    this.categoryChange.emit(this.selectedCategory);
  }
}
