import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Offert } from '../core/models/offert.model';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
// Esta importación proporciona la función isPlatformBrowser, que se utiliza para verificar si la plataforma actual es un navegador.
// Se usa comúnmente para lógica específica de plataforma, especialmente en escenarios donde el código necesita comportarse de manera diferente
// cuando se ejecuta en un entorno de navegador versus renderizado del lado del servidor.
import { isPlatformBrowser } from '@angular/common'; 

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [CommonModule, CarouselModule]
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
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['offer']) {
        this.offer = data['offer'];
      } else {
        console.error('No offer found or there was an error fetching the data.');
        this.router.navigate(['/shop']);
      }
    });

    // Verificar si estamos en el entorno del navegador antes de acceder a `window`
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.toggleScrollButton);
    }
  }

  ngOnDestroy() {
    // Verificar si estamos en el entorno del navegador antes de acceder a `window`
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
