import { Component, OnInit, HostListener, inject } from '@angular/core';
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-offerts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-offerts.component.html',
  styleUrls: ['./list-offerts.component.css']
})
export class ListOffertsComponent implements OnInit {
  offerts: Offert[] = [];
  categorySlug: string | null = null;

  constructor(
    private offertService: OffertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categorySlug = params['slug'];  
      this.loadOfferts(this.categorySlug);
    });
  }

  loadOfferts(categorySlug: string | null) {
    if (categorySlug) {
      this.loadOffertsByCategory(categorySlug);
    } else {
      this.loadAllOfferts();
    }
  }

  loadAllOfferts() {
    this.offertService.all_offerts({}).subscribe({
      next: (data) => {
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
