import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/service/category.service';
import { EnterpriseService } from '../../core/service/enterprise.service';
import { Category } from '../../core/models/category.model';
import { Enterprise } from '../../core/models/enterprise.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OffertService } from '../../core/service/offert.service';

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
  offerCount: number = 0;  // Variable para almacenar el conteo de ofertas filtradas

  selectedFilters: { category?: string; company?: string; salaryMin?: number; salaryMax?: number } = {};

  salaryRangeMin: number = 0; 
  salaryRangeMax: number = 10000;

  isFiltersSidebarOpen: boolean = false;

  @Output() filtersChange = new EventEmitter<{ category?: string; company?: string; salaryMin?: number; salaryMax?: number }>();

  constructor(
    private categoryService: CategoryService,
    private enterpriseService: EnterpriseService,
    private offertService: OffertService,  // Añadir el servicio de ofertas
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
        const decodedFilters = JSON.parse(atob(encodedFilters));
        
        this.selectedFilters.category = decodedFilters.category || undefined;
        this.selectedFilters.company = decodedFilters.company || undefined;
        this.selectedFilters.salaryMin = decodedFilters.salaryMin !== null ? Number(decodedFilters.salaryMin) : undefined;
        this.selectedFilters.salaryMax = decodedFilters.salaryMax !== null ? Number(decodedFilters.salaryMax) : this.salaryRangeMax;

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
    this.selectedFilters.salaryMin = this.salaryRangeMin;  
    this.applyFilters();
  }

  applyFilters() {
    const { category, company, salaryMin, salaryMax } = this.selectedFilters;

    const filtersToEncode = {
      category: category || null,
      company: company || null,
      salaryMin: salaryMin !== undefined ? salaryMin : null,
      salaryMax: salaryMax !== undefined ? salaryMax : null
    };

    const encodedFilters = btoa(JSON.stringify(filtersToEncode));

    // Actualizar la URL con los filtros aplicados
    this.router.navigate([], {
      queryParams: {
        filters: encodedFilters
      },
      replaceUrl: true
    });

    this.filtersChange.emit(this.selectedFilters);

    // Llamada al servicio para obtener el conteo de ofertas
    this.offertService.filterOfferts(this.selectedFilters).subscribe({
      next: (response) => {
        this.offerCount = response.count; // Actualizar el contador con el número de ofertas filtradas
      },
      error: (error) => {
        console.error('Error fetching filtered offers:', error);
      }
    });
  }

  removeFilters() {
    this.selectedFilters = {};
    this.salaryRangeMin = 0;  // Reiniciar salario mínimo
    this.salaryRangeMax = 10000;

    this.router.navigate([], {
      queryParams: { filters: null },
      replaceUrl: true
    });

    this.filtersChange.emit(this.selectedFilters);
  }

  toggleFiltersSidebar() {
    this.isFiltersSidebarOpen = !this.isFiltersSidebarOpen;
  }

  closeFiltersSidebar() {
    this.isFiltersSidebarOpen = false;
  }

  openFiltersSidebar() {
    this.isFiltersSidebarOpen = true;
  }
}
