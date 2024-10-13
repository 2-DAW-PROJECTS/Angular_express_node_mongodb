import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from '../search/search.component';
import { OffertService } from '../../core/service/offert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-list-presentation',
  standalone: true,
  imports: [CommonModule, SearchComponent, FormsModule],
  templateUrl: './list-presentation.component.html',
  styleUrls: ['./list-presentation.component.css']
})
export class ListPresentationComponent implements OnInit, OnDestroy {
  @ViewChild(SearchComponent) searchComponent!: SearchComponent;
  
  images: string[] = [
    '/carousel_presentation/Presentation1.png',
    '/carousel_presentation/Presentation6.png',
    '/carousel_presentation/Presentation1.webp',
    '/carousel_presentation/Presentation7.png',
    '/carousel_presentation/Presentation10.png',
    '/carousel_presentation/Presentation5.png'
  ];
  currentImageIndex: number = 0;
  private carouselInterval: any;
  searchResults: string[] = [];
  locations: string[] = [];
  selectedLocation: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone, 
    private offertService: OffertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    this.startImageCarousel();
  }

  ngOnDestroy(): void {
    this.stopImageCarousel();
  }

  startImageCarousel() {
    this.ngZone.runOutsideAngular(() => {
      this.carouselInterval = setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.cdr.detectChanges();
      }, 5000);
    });
  }

  stopImageCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

/**////////////////////////////SEARCH COMPONENT//////////////////////////////// */

  onSearch(searchValue: any) {
    if (typeof searchValue === 'string') {
      const encodedSearch = btoa(encodeURIComponent(searchValue));
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: encodedSearch, location: this.selectedLocation },
        queryParamsHandling: 'merge'
      });
      this.offertService.getSearchSuggestions(searchValue, this.selectedLocation).subscribe(
        (results) => {
          this.searchResults = results;

          // console.log('Search results:', results);

        }
      );
    } else {
      this.navigateToOffer(searchValue.slug);
    }
  }
  
  loadLocations() {
    this.offertService.getUniqueLocations().subscribe(
        locations => this.locations = locations
    );
  }


  onLocationChange() {
    this.searchComponent.selectedLocation = this.selectedLocation;
    this.offertService.getOffertsByLocation(this.selectedLocation).subscribe(
      offerts => {
        console.log('Filtered offerts:', offerts);
      }
    );
  }
  
  
  navigateToOffer(slug: string) {
    console.log('Slug:', slug);
    // this.router.navigate(['/offert', slug]);
    this.router.navigate(['/details', slug]);
  }
  

//////  
}
