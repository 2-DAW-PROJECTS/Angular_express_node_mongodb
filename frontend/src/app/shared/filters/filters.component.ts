import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/service/category.service';
import { EnterpriseService } from '../../core/service/enterprise.service';
import { Category } from '../../core/models/category.model';
import { Enterprise } from '../../core/models/enterprise.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  categories: Category[] = [];
  enterprises: Enterprise[] = [];

  selectedFilters: { category?: string; company?: string; salaryMin?: number; salaryMax?: number } = {};
  
  salaryRangeMin: number = 0;
  salaryRangeMax: number = 10000;

  @Output() filtersChange = new EventEmitter<{ category?: string; company?: string; salaryMin?: number; salaryMax?: number }>();

  constructor(
    private categoryService: CategoryService,
    private enterpriseService: EnterpriseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadEnterprises();
    this.loadCurrentFiltersFromUrl();
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

  loadCurrentFiltersFromUrl() {
    this.route.queryParams.subscribe(params => {
      const encodedFilters = params['filters'];
  
      if (encodedFilters) {
        // Decodificar los filtros usando atob y parsearlos a un objeto
        const decodedFilters = JSON.parse(atob(encodedFilters));
  
        this.selectedFilters.category = decodedFilters.category || undefined;
        this.selectedFilters.company = decodedFilters.company || undefined;
        this.selectedFilters.salaryMin = decodedFilters.salaryMin !== null ? Number(decodedFilters.salaryMin) : undefined;
        this.selectedFilters.salaryMax = decodedFilters.salaryMax !== null ? Number(decodedFilters.salaryMax) : this.salaryRangeMax;
  
        // Sincronizar el slider con el valor de salarioMax
        if (this.selectedFilters.salaryMax) {
          this.salaryRangeMax = this.selectedFilters.salaryMax;
        }
      }
    });
  }
  

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedFilters.category = selectedValue || undefined;
    this.applyFilters();
  }

  onCompanyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedFilters.company = selectedValue || undefined;
    this.applyFilters();
  }

  onSalaryChange() {
    this.selectedFilters.salaryMax = this.salaryRangeMax;
    this.applyFilters();
  }

  applyFilters() {
    const { category, company, salaryMin, salaryMax } = this.selectedFilters;
  
    // Crear un objeto con los filtros
    const filtersToEncode = {
      category: category || null,
      company: company || null,
      salaryMin: salaryMin !== undefined ? salaryMin : null,
      salaryMax: salaryMax !== undefined ? salaryMax : null
    };
  
    // Codificar los filtros en Base64 usando btoa
    const encodedFilters = btoa(JSON.stringify(filtersToEncode));
  
    // Navegar con los filtros codificados en la URL
    this.router.navigate([], {
      queryParams: {
        filters: encodedFilters // Pasa los filtros codificados en Base64
      },
      replaceUrl: true
    });
  
    // Emitir el evento de cambio de filtros
    this.filtersChange.emit(this.selectedFilters);
  }
  

  removeFilters() {
    this.selectedFilters = {};
    this.salaryRangeMin = 0;
    this.salaryRangeMax = 10000;
  
    // Navegar eliminando los filtros de la URL
    this.router.navigate([], {
      queryParams: { filters: null },
      replaceUrl: true
    });
  
    this.filtersChange.emit(this.selectedFilters);
  }
  
}
