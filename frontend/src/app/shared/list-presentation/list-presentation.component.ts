import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';



@Component({
  selector: 'app-list-presentation',
  standalone: true,
  imports: [CommonModule, SearchComponent],
  templateUrl: './list-presentation.component.html',
  styleUrls: ['./list-presentation.component.css']
})
export class ListPresentationComponent implements OnInit, OnDestroy {
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

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {
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
  onSearch(searchValue: string) {
    // Handle the search event
    console.log('Search value:', searchValue);
    // Implement your search logic here
  }
//////  
}
