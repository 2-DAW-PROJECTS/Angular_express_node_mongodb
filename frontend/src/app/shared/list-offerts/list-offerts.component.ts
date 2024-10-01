import { Component, OnInit, HostListener, inject } from '@angular/core';
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { ViewportScroller, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { Subject, Observable } from 'rxjs';

// Define the Filter interface to include all necessary properties
interface Filter {
  category?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  offset?: number; // Optional offset
  limit?: number;  // Optional limit
}

@Component({
  selector: 'app-list-offerts',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './list-offerts.component.html',
  styleUrls: ['./list-offerts.component.css']
})
export class ListOffertsComponent implements OnInit {
  offerts: Offert[] = [];

  // Initialize selectedFilters with offset and limit
  selectedFilters: Filter = { 
    offset: 0, 
    limit: 2 
  }; 

  currentPage: number = 1; // Current page
  totalPages: number[] = []; // Total pages
  limit: number = 2; // Limit to 2 offers per page

  // Update the type definition to include offset and limit in filtersChangeSubject
  private filtersChangeSubject: Subject<Filter> = new Subject();
  filtersChange: Observable<Filter> = this.filtersChangeSubject.asObservable();

  constructor(
    private offertService: OffertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const encodedFilters = params['filters'];
      if (encodedFilters) {
        const decodedFilters = JSON.parse(atob(encodedFilters));
        this.selectedFilters = {
          category: decodedFilters.category || undefined,
          company: decodedFilters.company || undefined,
          salaryMin: decodedFilters.salaryMin ? Number(decodedFilters.salaryMin) : undefined,
          salaryMax: decodedFilters.salaryMax ? Number(decodedFilters.salaryMax) : undefined,
          offset: decodedFilters.offset || 0,
          limit: decodedFilters.limit || this.limit 
        };
        this.currentPage = 1; // Start on page 1
        this.loadOfferts(); // Load filtered offers on init
      } else {
        this.currentPage = 1; // Start on page 1
        this.loadAllOfferts(); // Load all offers if no filters
      }
    });

    this.filtersChange.subscribe((newFilters: Filter) => {
      this.selectedFilters = { 
        ...newFilters, 
        offset: 0,  // Always initialize the offset to 0 when filters change
        limit: this.limit // Ensure to include the limit
      };
      this.currentPage = 1; // Reset to page 1
      this.loadOfferts(); // Reload offers
    });
  }

  loadOfferts() {
    // Ensure offset has a default value
    const offset = this.selectedFilters.offset || 0;
  
    // Apply the offset calculation correctly
    this.selectedFilters.offset = (this.currentPage - 1) * this.limit;
  
    // Check if any filters are applied
    if (this.selectedFilters.category || this.selectedFilters.company || this.selectedFilters.salaryMin || this.selectedFilters.salaryMax) {
      this.loadOffertsByFilters(); // Load filtered offers
    } else {
      this.loadAllOfferts(); // Load all offers if no filters
    }
  }
  
  loadOffertsByFilters() {
    this.offertService.filterOfferts(this.selectedFilters).subscribe({
      next: (data) => {
        if (data && data.offerts && data.count) {
          // Ensure offset has a default value
          const offset = this.selectedFilters.offset ?? 0; // Use nullish coalescing to provide a default value
          this.offerts = data.offerts.slice(offset, offset + this.limit); // Paginate locally
          this.totalPages = Array(Math.ceil(data.count / this.limit)).fill(0).map((x, i) => i + 1); // Calculate total pages
        } else {
          console.error('Unexpected server response:', data);
        }
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
        this.offerts = [];
        this.totalPages = [];
      }
    });
}


  loadAllOfferts() {
    // Set the limit
    this.selectedFilters.limit = this.limit; 
    // Ensure offset is calculated before loading all offers
    this.selectedFilters.offset = (this.currentPage - 1) * this.limit;

    this.offertService.all_offerts({ offset: this.selectedFilters.offset, limit: this.limit }).subscribe({
        next: (data) => {
            this.offerts = data.offerts;
            this.totalPages = Array(Math.ceil(data.count / this.limit)).fill(0).map((x, i) => i + 1); // Calculate total pages
        },
        error: (err) => {
            console.error('Error fetching all offers', err);
        }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page; // Update current page
    this.selectedFilters.offset = (this.currentPage - 1) * this.limit; // Calculate new offset
    this.loadOfferts(); // Reload offers with applied filters
  }

  updateFilters(newFilters: { category?: string; company?: string; salaryMin?: number; salaryMax?: number }) {
    this.filtersChangeSubject.next({
      ...newFilters,
      offset: this.selectedFilters.offset || 0,  // Ensure there's always an offset
      limit: this.selectedFilters.limit || this.limit // Ensure there's always a limit
    });
  }

  onSearch(encodedSearch: string) {
    this.offertService.find_product_name(encodedSearch).subscribe({
      next: (data) => {
        this.offerts = data.offerts;
        console.log('Ofertas encontradas:', this.offerts);
        // If a search is performed, you can reset or adapt pagination
        this.totalPages = Array(Math.ceil(data.count / this.limit)).fill(0).map((x, i) => i + 1); // Calculate total pages
      },
      error: (err) => {
        console.error('Error fetching offers by search', err);
        this.offerts = [];
        this.totalPages = []; // Reset pages in case of error
      }
    });
  }

  onCategoryChange(categorySlug: string | null) {
    this.selectedFilters.category = categorySlug || undefined;
    this.updateFilters(this.selectedFilters);
  }

  onCompanyChange(companySlug: string | null) {
    this.selectedFilters.company = companySlug || undefined;
    this.updateFilters(this.selectedFilters);
  }

  private viewportScroller = inject(ViewportScroller);
  showScrollButton = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollButton = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
