import { Component, OnInit, HostListener, inject } from '@angular/core';
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { ViewportScroller, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-list-offerts',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent],
  templateUrl: './list-offerts.component.html',
  styleUrls: ['./list-offerts.component.css']
})
export class ListOffertsComponent implements OnInit {
  offerts: Offert[] = [];
  selectedFilters: { category?: string; company?: string; salaryMin?: number; salaryMax?: number } = {};

  constructor(
    private offertService: OffertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const encodedFilters = params['filters'];
      if (encodedFilters) {
        const decodedFilters = JSON.parse(atob(encodedFilters));
        this.selectedFilters.category = decodedFilters.category || undefined;
        this.selectedFilters.company = decodedFilters.company || undefined;
        this.selectedFilters.salaryMin = decodedFilters.salaryMin ? Number(decodedFilters.salaryMin) : undefined;
        this.selectedFilters.salaryMax = decodedFilters.salaryMax ? Number(decodedFilters.salaryMax) : undefined;

        console.log('Cargando ofertas con filtros:', this.selectedFilters);
        this.loadOfferts();
      } else {
        this.loadAllOfferts();
      }
    });
  }


  loadOfferts() {
    if (this.selectedFilters.category || this.selectedFilters.company || this.selectedFilters.salaryMin || this.selectedFilters.salaryMax) {
      this.loadOffertsByFilters();
    } else {
      this.loadAllOfferts();
    }
  }

  loadOffertsByFilters() {
    this.offertService.filterOfferts({
      category: this.selectedFilters.category,
      company: this.selectedFilters.company,
      salaryMin: this.selectedFilters.salaryMin,
      salaryMax: this.selectedFilters.salaryMax
    }).subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        if (data.offerts && Array.isArray(data.offerts)) {
          this.offerts = data.offerts;
          console.log('Ofertas filtradas:', this.offerts);
        } else {
          console.warn('Se esperaban ofertas, pero no se encontraron.');
          this.offerts = [];
        }
      },
      error: (err) => {
        console.error('Error fetching offers by filters', err);
        this.offerts = [];
      }
    });
  }

  onSearch(encodedSearch: string) {
    this.offertService.find_product_name(encodedSearch).subscribe({
      next: (data) => {
        this.offerts = data.offerts;
        console.log('Ofertas encontradas:', this.offerts);
      },
      error: (err) => {
        console.error('Error fetching offers by search', err);
        this.offerts = [];
      }
    });
  }

  loadAllOfferts() {
    console.log('Llamando al servicio para cargar todas las ofertas...');
    this.offertService.all_offerts({}).subscribe({
      next: (data) => {
        this.offerts = data.offerts;
      },
      error: (err) => {
        console.error('Error fetching all offers', err);
      }
    });
  }

  // Método que permite cargar ofertas nuevamente
  onCategoryChange(categorySlug: string | null) {
    console.log('Cambio de categoría a:', categorySlug);
    this.selectedFilters.category = categorySlug || undefined; 
    this.loadOfferts();
  }

  onCompanyChange(companySlug: string | null) {
    console.log('Cambio de empresa a:', companySlug);
    this.selectedFilters.company = companySlug || undefined;
    this.loadOfferts();
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
