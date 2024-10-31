import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfferService } from '../../core/service_prisma/offerts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Offert } from '../../core/models_prisma/offertEnterprise.model'; 

@Component({
  selector: 'app-enterprise-edit-offerts',
  templateUrl: './enterprise-edit-offerts.component.html',
  styleUrls: ['./enterprise-edit-offerts.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class EnterpriseEditOffertsComponent implements OnInit {
  offer: Offert = {
    id: '',
    _id: '',
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [],
    salary: 0,
    slug: '',
    category: '',
    categorySlug: '',
    company_slug: '',
    postedDate: '',
    image: '',
    images: [],
    contractType: '',
    experience: '',
    __v: 0
  };

  requirementsString: string = '';

  constructor(
    private offerService: OfferService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const offerId = this.route.snapshot.paramMap.get('id');
    if (offerId) {
      this.loadOffer(offerId);
    }
  }

  loadOffer(id: string) {
    this.offerService.getOfferById(id).subscribe(
      (offer) => {
        this.offer = offer;
        this.requirementsString = this.offer.requirements.join(', ');
      },
      (error) => {
        console.error('Error loading offer:', error);
      }
    );
  }

  onSubmit() {
    this.offer.slug = this.offer.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    this.offer.postedDate = new Date().toISOString();
    this.offer.requirements = this.requirementsString.split(',').map(req => req.trim());

    this.offerService.updateOffer(this.offer).subscribe(
      (response) => {
        console.log('Oferta actualizada:', response);
        this.router.navigate(['/enterprise-dashboard']);
      },
      (error) => {
        console.error('Error al actualizar la oferta', error);
      }
    );
  }
}
