import { Component, OnInit, HostListener, inject } from '@angular/core';
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { ViewportScroller, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router'; // Asegúrate de importar Router
import { PaginationComponent } from '../pagination/pagination.component';
import { Subject, Observable } from 'rxjs';

interface Filter {
  category?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  searchTerm?: string;
  offset?: number;
  limit?: number;  
}

@Component({
  selector: 'app-list-offerts',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './list-offerts.component.html',
  styleUrls: ['./list-offerts.component.css']
})
export class ListOffertsComponent implements OnInit {
  // offerts: Offert[] = [];
  // selectedFilters: Filter = { offset: 0, limit: 2 }; 
  // currentPage: number = 1;
  // totalPages: number[] = [];
  // limit: number = 2;
  // private filtersChangeSubject: Subject<Filter> = new Subject();
  // filtersChange: Observable<Filter> = this.filtersChangeSubject.asObservable();
  offerts: Offert[] = [];
  selectedFilters: Filter = {};
  currentPage: number = 1;
  totalPages: number[] = [];
  limit: number = 2;
  private filtersChangeSubject: Subject<Filter> = new Subject();
  filtersChange: Observable<Filter> = this.filtersChangeSubject.asObservable();
  
  private favoriteSlugs: string[] = [];
  
  constructor(
    private offertService: OffertService, 
    private route: ActivatedRoute, 
    private router: Router // Inyectar Router aquí
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
          searchTerm: decodedFilters.searchTerm || undefined,
          offset: decodedFilters.offset || 0,
          limit: decodedFilters.limit || this.limit
        };
        this.currentPage = 1;
        this.loadOfferts(); 
      } else {
        this.currentPage = 1; 
        this.loadAllOfferts(); 
      }
    });
  
    if (this.isUserAuthenticated()) {
      this.loadUserFavorites();
    }
  
    this.filtersChange.subscribe((newFilters: Filter) => {
      this.selectedFilters = { 
        ...newFilters, 
        offset: 0, 
        limit: this.limit 
      };
      this.currentPage = 1;
      this.loadOfferts();
    });
  }


  toggleFavorite(offert: Offert) {
    if (!this.isUserAuthenticated()) {
      alert('User is not authenticated. Please log in to add favorites.');
      this.router.navigate(['/login']); // Redirigir al login
      return; // Salir de la función si no está autenticado
    }

    if (offert.isFavorited) {
      this.offertService.unfavoriteOffert(offert.slug).subscribe({
        next: (response) => {
          // console.log('Removed from favorites:', response);
          offert.isFavorited = false; // Update the state
          this.favoriteSlugs = this.favoriteSlugs.filter(slug => slug !== offert.slug);
        },
        error: (err) => {
          console.error('Error removing from favorites:', err);
        }
      });
    } else {
      this.offertService.favoriteOffert(offert.slug).subscribe({
        next: (response) => {
          // console.log('Added to favorites:', response);
          offert.isFavorited = true; // Update the state
          this.favoriteSlugs.push(offert.slug);
        },
        error: (err) => {
          console.error('Error adding to favorites:', err);
        }
      });
    }
  }

  loadUserFavorites() {
    this.offertService.getUserFavorites().subscribe({
      next: (response: { offerts: Offert[] }) => { 
        const favorites = response.offerts; 
        // console.log('User favorites loaded:', favorites);

        if (Array.isArray(favorites)) {
          this.favoriteSlugs = favorites.map(fav => fav.slug);
          // console.log('Favorite slugs:', this.favoriteSlugs);
          
          this.offerts.forEach(offert => {
            offert.isFavorited = this.favoriteSlugs.includes(offert.slug);
          });
        } else {
          console.error('Favorites is not an array:', favorites);
        }
      },
      error: (err) => {
        console.error('Error loading user favorites:', err);
      }
    });
  }

  isUserAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('access_token');
      return !!token;
    }
    return false;
  }

  // loadOfferts() {
  //   const offset = this.selectedFilters.offset || 0; 
  //   this.selectedFilters.offset = (this.currentPage - 1) * this.limit;

  //   if (this.selectedFilters.category || this.selectedFilters.company || this.selectedFilters.salaryMin || this.selectedFilters.salaryMax) {
  //     this.loadOffertsByFilters();
  //   } else {
  //     this.loadAllOfferts();
  //   }
  // }
  loadOfferts() {
    this.selectedFilters.offset = (this.currentPage - 1) * this.limit;
    this.selectedFilters.limit = this.limit;

    this.offertService.filterAndSearchOfferts(this.selectedFilters).subscribe({
      next: (data) => {
        this.offerts = data.offerts.map(offert => ({
          ...offert,
          isFavorited: this.favoriteSlugs.includes(offert.slug)
        }));
        this.totalPages = Array(Math.ceil(data.count / this.limit)).fill(0).map((x, i) => i + 1);
      },
      error: (err) => console.error('Error loading offers', err)
    });
  }


  loadOffertsByFilters() {
    this.offertService.filterAndSearchOfferts(this.selectedFilters).subscribe({
      next: (data) => {
        if (data && data.offerts && data.count) {
          const currentFavoriteSlugs = this.offerts
            .filter(offert => offert.isFavorited)
            .map(offert => offert.slug);
  
          this.offerts = data.offerts.map(offert => ({
            ...offert,
            isFavorited: currentFavoriteSlugs.includes(offert.slug) 
          })).slice(
            this.selectedFilters.offset || 0,  
            (this.selectedFilters.offset || 0) + this.limit 
          ); // Paginate locally
  
          // Actualiza totalPages
          this.totalPages = Array(Math.ceil(data.count / this.limit)).fill(0).map((x, i) => i + 1);
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
    this.selectedFilters.limit = this.limit; 
    this.selectedFilters.offset = (this.currentPage - 1) * this.limit;

    this.offertService.all_offerts({ offset: this.selectedFilters.offset, limit: this.limit }).subscribe({
      next: (data) => {
        this.offerts = data.offerts.map(offert => ({
          ...offert,
          isFavorited: this.favoriteSlugs.includes(offert.slug) 
        }));        
        this.totalPages = Array(Math.ceil(data.count / this.limit)).fill(0).map((x, i) => i + 1);
      },
      error: (err) => {
        console.error('Error fetching all offers', err);
      }
    });
  }


  onPageChange(page: number) {
    this.currentPage = page; 
    this.selectedFilters.offset = (this.currentPage - 1) * this.limit;
    this.loadOfferts(); 
  }

  // updateFilters(newFilters: { category?: string; company?: string; salaryMin?: number; salaryMax?: number }) {
  //   this.filtersChangeSubject.next({
  //     ...newFilters,
  //     offset: this.selectedFilters.offset || 0, 
  //     limit: this.selectedFilters.limit || this.limit 
  //   });
  // }
  updateFilters(filters: Filter) {
    this.selectedFilters = { ...this.selectedFilters, ...filters };
    this.loadOfferts();
  }

  onSearch(encodedSearch: string) {
    const encodedSearchenco = btoa(encodedSearch);
    this.offertService.find_product_name(encodedSearchenco).subscribe({
      next: (data) => {
        this.offerts = data.offerts;
        // console.log('Ofertas encontradas:', this.offerts);
        this.totalPages = Array(Math.ceil(data.count / this.limit)).fill(0).map((x, i) => i + 1); 
      },
      error: (err) => {
        console.error('Error fetching offers by search', err);
        this.offerts = [];
        this.totalPages = []; 
      }
    });
  }
  

  onSearchChange(searchTerm: string) {
    this.selectedFilters.searchTerm = searchTerm;
    this.updateFilters(this.selectedFilters);
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
