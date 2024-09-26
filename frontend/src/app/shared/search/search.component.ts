/*Angular Core*/
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

/*App imports*/
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { Filters } from '../../core/models/filters.model';

/*Copmponent de la aplicacion*/
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() searchEvent: EventEmitter<Filters> = new EventEmitter();

  searchValue: string | undefined = '';
  listOfferts: Offert[] = [];
  filters: Filters = new Filters();
  routeFilters!: string | null;
  search: any;

  constructor(
    private OffertService: OffertService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location
  ) {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
  }//constructor


  ngOnInit(): void {
    if (this.routeFilters) {
      //
        console.log(" dentro del if routeFilters || ngOnInit search.component");
      //
      this.filters = JSON.parse(atob(this.routeFilters));
    }
    this.searchValue = this.filters.name || undefined;
    //
      console.log("searchValue || ", this.searchValue);
    //
  }//ngOnInit


  public type_event(writtingValue: any): void {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    this.search = writtingValue;
    this.filters.name = writtingValue;

      setTimeout(() => {

          this.searchEvent.emit(this.filters);
          this.Location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));

        if (this.search.length != 0){  
          this.getListOfferts();
      }
    }, 150);
    this.filters.name = this.search;
    this.filters.offset = 0;
  }//type_event


  getListOfferts() {
    this.OffertService.find_product_name(this.search).subscribe(
      (data: any) => {
        this.listOfferts = data.products;
        console.log(this.listOfferts);
        if(data === null ){
          console.log('error')
        }
      });
  }//getListOfferts

  public search_event(data: any): void {
    if (typeof data.search_value === 'string') {
      this.filters.name = data.search_value;
      this.filters.offset = 0;
      this.Router.navigate(['/shop/' + btoa(JSON.stringify(this.filters))]);
      //  
        console.log(this.filters);
      //
    }
  }//search_event


}//SearchComponent
