/*IMPORTACIONES DE ANGULAR*/
import { Component, OnInit, HostListener, inject } from '@angular/core';
import { ViewportScroller, CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

/*iMPORTACIONES DE LOS USUARIOS*/
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { SearchComponent } from '../search/search.component';
import { FiltersComponent } from '../filters/filters.component';
import { Filters } from '../../core/models/filters.model';



@Component({
  selector: 'app-list-offerts',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, FiltersComponent],
  templateUrl: './list-offerts.component.html',
  styleUrls: ['./list-offerts.component.css']
})

export class ListOffertsComponent implements OnInit {
  offerts: Offert[] = [];
  selectedFilters: { category?: string; company?: string } = {};
  categorySlug: string | null = null;
  searchValue: string = '';
  count: number = 0;

  constructor(
    private offertService: OffertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        this.selectedFilters.category = params['categorySlug'] || undefined;
        this.selectedFilters.company = params['companySlug'] || undefined;
        console.log('Cargando ofertas con filtros:', this.selectedFilters);
        this.loadOfferts();

    });
  }
 

  onSearch(searchValue: string) {
    // console.log('Search value:', searchValue);
    console.log("________________________");
    console.log(this.categorySlug);
    this.categorySlug = null;
  
    this.offertService.find_product_name(searchValue).subscribe({
      next: (data) => {

        console.log(data);

        this.offerts = data.offerts;
        this.count = data.count;
      },
      error: (err) => {
        console.error('Error fetching filtered offers', err);
      }
    });
  }//OnSearch


  //  // Método para recargar la página
  //   reloadPage(): void {
  //     setTimeout(() => {
  //       window.location.reload(); 
  //     }, 3000);
  //   }
  


  loadOfferts() {
    if (this.selectedFilters.category || this.selectedFilters.company) {
      this.loadOffertsByFilters();
    // console.log('loadOfferts called with categorySlug:', categorySlug);
    if (this.searchValue) {
      console.log('Search value:', this.searchValue);
      this.onSearch(this.searchValue);
    } else if (categorySlug) {
      console.log('categorySlug value:', this.categorySlug);
      this.loadOffertsByCategory(categorySlug);
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
            // console.log('Datos recibidos del backend:', data); 
            if (Array.isArray(data)) {
                this.offerts = data;
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

  loadAllOfferts() {
    console.log('Llamando al servicio para cargar todas las ofertas...');
    this.offertService.all_offerts({}).subscribe({
      next: (data) => {
        // console.log(data);
        this.offerts = data.offerts;
        // console.log('Ofertas cargadas:', this.offerts);
      },
      error: (err) => {
        console.error('Error fetching all offers', err);
      }
    });
  }

  

  get_list_filtered (filters: Filters) {
    //
    console.log("Filters.name   ",filters.name);
    // const encodedName = btoa(filters.name || '');
    // console.log("encodedName:", encodedName);
    console.log("________________________");

    this.offertService.find_product_name(filters.name).subscribe({
      next: (data) => {
        this.offerts = data.offerts;
      },
      error: (err) => {
        console.error('Error fetching filtered offers', err);
      }
    });
  }//get_list_filtered
  


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
