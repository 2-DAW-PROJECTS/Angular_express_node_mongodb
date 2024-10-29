import { Component } from '@angular/core';
import { OfferService } from '../../core/service_prisma/offerts.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Offert } from '../../core/models_prisma/offertEnterprise.model'; 

@Component({
  selector: 'app-enterprise-create-offerts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './enterprise-create-offerts.component.html',
  styleUrls: ['./enterprise-create-offerts.component.css']
})
export class EnterpriseCreateOffertsComponent {
  offer: Offert = {
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


  constructor(private offerService: OfferService, private router: Router) {}

  requirementsString: string = '';

  onSubmit() {
      this.offer.slug = this.offer.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      this.offer.postedDate = new Date().toISOString();
      
      this.offer.requirements = this.requirementsString.split(',').map(req => req.trim());

      this.offerService.createOffer(this.offer).subscribe(
          (response) => {
              console.log('Oferta creada:', response);
              this.router.navigate(['/enterprise-dashboard']);
          },
          (error) => {
              console.error('Error al crear la oferta', error);
          }
      );
  }
}
