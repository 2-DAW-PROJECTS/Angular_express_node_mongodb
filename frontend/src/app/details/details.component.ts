import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Offert } from '../core/models_prisma/offertEnterprise.model';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { isPlatformBrowser } from '@angular/common'; 
import { DetailsCommentsComponent } from './details-comments.component'; 

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [CommonModule, CarouselModule, DetailsCommentsComponent]
})
export class DetailsComponent implements OnInit {
  offer!: Offert;
  responsiveOptions: any[];
  showScrollButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    this.responsiveOptions = [
      { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
      { breakpoint: '768px', numVisible: 2, numScroll: 1 },
      { breakpoint: '560px', numVisible: 1, numScroll: 1 }
    ];
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
        if (data['offer']) {
            this.offer = data['offer'];
            console.log("Offer loaded:", this.offer);
            console.log("Offer ID:", this.offer._id);
        } else {
            console.error('No offer found or there was an error fetching the data.');
            this.router.navigate(['/shop']);
        }
    });

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.toggleScrollButton);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.toggleScrollButton);
    }
  }

  toggleScrollButton = () => {
    this.showScrollButton = window.scrollY > 300;
  };

  applyForJob() {
    console.log(`Aplicando a la oferta: ${this.offer.title}`);
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
