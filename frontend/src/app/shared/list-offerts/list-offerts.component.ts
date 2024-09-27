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
  categorySlug: string | null = null;
  searchValue: string = '';
  count: number = 0;

  constructor(
    private offertService: OffertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // console.log(this.searchValue);
      // console.log(params['slug']);
      this.categorySlug = params['slug'];  
      this.loadOfferts(this.categorySlug);
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
  

  loadOfferts(categorySlug: string | null) {
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
  

  loadAllOfferts() {
    this.offertService.all_offerts({}).subscribe({
      next: (data) => {
        // console.log(data);
        this.offerts = data.offerts;
      },
      error: (err) => {
        console.error('Error fetching offers', err);
      }
    });
  }

  loadOffertsByCategory(slug: string) {
    this.offertService.get_offerts_by_category(slug).subscribe({
      next: (data) => {
        this.offerts = data.offerts;
      },
      error: (err) => {
        console.error('Error fetching offers', err);
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
    this.loadOfferts(categorySlug);
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
