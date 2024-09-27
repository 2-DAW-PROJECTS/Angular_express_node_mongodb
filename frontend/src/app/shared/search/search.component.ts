/*Angular Core*/
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
/*App imports*/
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { Filters } from '../../core/models/filters.model';




/*Copmponent de la aplicacion*/
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})




export class SearchComponent implements OnInit {

  @Output() searchEvent: EventEmitter<Filters> = new EventEmitter();

  searchValue: string | undefined = " ";
  offerts: Offert[] = [];
  filters: Filters = new Filters();


  constructor(private OffertService: OffertService, private router: Router) {}//constructor


  ngOnInit(): void {}//ngOnInit

  onSearch() {
    // console.log('Search value:', this.searchValue);

    const encodedSearch = btoa(this.searchValue ?? '');
    // this.router.navigate(['/shop', encodedSearch]);
    // console.log('Encoded search value:', encodedSearch );
    console.log("___________________________");

    this.searchEvent.emit(encodedSearch);
  }




  // loadSerch() {
  //   this.OffertService.find_product_name({}).subscribe({
  //     next: (data) => {
  //       this.Offerts = data.Offert;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching categories', err);
  //     }
  //   });
  // }//loadSerch

  // onsearchEvent(event: Event) {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const filters: Filters = { searchTerm: selectElement.value };
  //   this.searchValue = filters;
  //   this.searchEvent.emit(this.searchValue);
  // }

}//SearchComponent
