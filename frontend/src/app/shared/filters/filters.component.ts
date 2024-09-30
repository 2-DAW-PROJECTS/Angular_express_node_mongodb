import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/service/category.service';
import { EnterpriseService } from '../../core/service/enterprise.service';
import { OffertService } from '../../core/service/offert.service';
import { Category } from '../../core/models/category.model';
import { Enterprise } from '../../core/models/enterprise.model';
import { Offert } from '../../core/models/offert.model'; // Ensure the path is correct
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
  offerts: Offert[] = []; // Stores the obtained offers
  offerCount: number = 0;
  currentPage: number = 1; // Current page
  limit: number = 2; // Limit to 2 offers per page
  totalPages: number = 0; // Add this line to declare totalPages

  selectedFilters: { category?: string; company?: string; salaryMin?: number; salaryMax?: number; offset?: number; limit?: number } = {};

  salaryRangeMin: number = 0; 
  salaryRangeMax: number = 10000;
  isFiltersSidebarOpen: boolean = false;

  @Output() filtersChange = new EventEmitter<{ category?: string; company?: string; salaryMin?: number; salaryMax?: number, offset?: number }>();

  constructor(
    private categoryService: CategoryService,
    private enterpriseService: EnterpriseService,
    private offertService: OffertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadEnterprises();
    this.loadCurrentFiltersFromUrl();
    this.fetchOfferts(); // Load offers on init
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

  fetchOfferts() {
    // Calculate the offset for pagination based on the current page
    this.selectedFilters.offset = (this.currentPage - 1) * this.limit;
    this.selectedFilters.limit = this.limit; // Set the limit

    this.offertService.filterOfferts(this.selectedFilters).subscribe({
      next: (data) => {
        this.offerts = data.offerts;
        this.offerCount = data.count; // Total offers to calculate number of pages
        this.totalPages = Math.ceil(this.offerCount / this.limit); // Calculate total pages
      },
      error: (err) => {
        console.error('Error fetching offers', err);
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
        salaryMax: salaryMax !== undefined ? salaryMax : null,
        offset: 0, // Reset the offset when applying filters
        limit: this.limit // Add limit to filters
    };

    const encodedFilters = btoa(JSON.stringify(filtersToEncode));

    this.router.navigate([], {
      queryParams: {
        filters: encodedFilters
      },
      replaceUrl: true
    });

    this.selectedFilters.offset = 0; // Reset offset here
    this.selectedFilters.limit = this.limit; // Set the limit
    this.fetchOfferts(); // Ensure offers are fetched after applying filters
    this.filtersChange.emit(this.selectedFilters); // Emit the applied filters
  }
 

  removeFilters() {
    this.selectedFilters = {};
    this.salaryRangeMin = 0;  // Reset minimum salary
    this.salaryRangeMax = 10000;

    this.router.navigate([], {
      queryParams: { filters: null },
      replaceUrl: true
    });

    this.fetchOfferts(); // Fetch all offers
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
