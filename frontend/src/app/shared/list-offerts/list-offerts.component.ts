import { Component, OnInit, HostListener, inject } from '@angular/core';
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { ViewportScroller, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-list-offerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-offerts.component.html',
  styleUrls: ['./list-offerts.component.css']
})
export class ListOffertsComponent implements OnInit {
  offerts: Offert[] = [];
  selectedFilters: { category?: string; company?: string } = {};

  constructor(
    private offertService: OffertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.selectedFilters.category = params['categorySlug'] || undefined;
        this.selectedFilters.company = params['companySlug'] || undefined;
        console.log('Cargando ofertas con filtros:', this.selectedFilters);
        this.loadOfferts(); // Cargar ofertas al iniciar
    });
  }

  loadOfferts() {
    if (this.selectedFilters.category || this.selectedFilters.company) {
      this.loadOffertsByFilters();
    } else {
      this.loadAllOfferts();
    }
  }

  loadOffertsByFilters() {
    this.offertService.filterOfferts({
        category: this.selectedFilters.category,
        company: this.selectedFilters.company
    }).subscribe({
        next: (data) => {
            console.log('Datos recibidos del backend:', data); 
            if (Array.isArray(data)) {
                this.offerts = data; // Asigna el array directamente
                console.log('Ofertas filtradas:', this.offerts);
            } else {
                console.warn('Se esperaban ofertas, pero no se encontraron.');
                this.offerts = []; // Asegúrate de que esté vacío
            }
        },
        error: (err) => {
            console.error('Error fetching offers by filters', err);
            this.offerts = []; // Asegúrate de que esté vacío en caso de error
        }
    });
}



  loadAllOfferts() {
    console.log('Llamando al servicio para cargar todas las ofertas...');
    this.offertService.all_offerts({}).subscribe({
      next: (data) => {
        this.offerts = data.offerts;
        // console.log('Ofertas cargadas:', this.offerts);
      },
      error: (err) => {
        console.error('Error fetching all offers', err);
      }
    });
  }

  // Método que permite cargar ofertas nuevamente
  onCategoryChange(categorySlug: string | null) {
    console.log('Cambio de categoría a:', categorySlug);
    this.selectedFilters.category = categorySlug || undefined; // Convierte null a undefined
    this.loadOfferts();
  }

  onCompanyChange(companySlug: string | null) {
    console.log('Cambio de empresa a:', companySlug);
    this.selectedFilters.company = companySlug || undefined; // Convierte null a undefined
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
