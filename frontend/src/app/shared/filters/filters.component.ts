import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/service/category.service';
import { EnterpriseService } from '../../core/service/enterprise.service';
import { Category } from '../../core/models/category.model';
import { Enterprise } from '../../core/models/enterprise.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  categories: Category[] = [];
  enterprises: Enterprise[] = [];
  
  selectedFilters: { category?: string; company?: string } = {};

  @Output() filtersChange = new EventEmitter<{ category?: string; company?: string }>();

  constructor(
    private categoryService: CategoryService,
    private enterpriseService: EnterpriseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadEnterprises();
    this.loadCurrentFilters();
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

  loadEnterprises() {
    this.enterpriseService.findAllEnterprises({}).subscribe({
        next: (data) => {
            this.enterprises = data.enterprises;
        },
        error: (err) => {
            console.error('Error fetching enterprises', err);
        }
    });
}


  loadCurrentFilters() {
    const filters = this.route.snapshot.paramMap.get('filters');
    if (filters) {
      this.selectedFilters = JSON.parse(atob(filters));
    }
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (selectedValue) {
      this.selectedFilters.category = selectedValue;
    } else {
      delete this.selectedFilters.category;
    }
    this.applyFilters();
  }

  onCompanyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    // Asignar o eliminar el filtro de empresa
    if (selectedValue) {
        this.selectedFilters.company = selectedValue;
    } else {
        delete this.selectedFilters.company;
    }

    this.applyFilters(); // Aplicar los filtros al cambiar
}


  applyFilters() {
    console.log('Filtros aplicados:', this.selectedFilters);
    const { category, company } = this.selectedFilters;
    
    this.router.navigate([], {
        queryParams: {
            categorySlug: category || null,
            companySlug: company || null
        },
        replaceUrl: true
    });
    this.filtersChange.emit(this.selectedFilters); // Emitir cambios de filtros
  }

  removeFilters() {
    this.selectedFilters = {};
    this.router.navigate([], {
      queryParams: { filters: null },
      replaceUrl: true
    });
    this.filtersChange.emit(this.selectedFilters); // Emitir cambios de filtros
  }
}
