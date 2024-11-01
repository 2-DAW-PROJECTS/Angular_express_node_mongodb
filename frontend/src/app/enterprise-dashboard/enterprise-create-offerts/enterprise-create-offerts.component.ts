import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../core/service_prisma/offerts.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Offert } from '../../core/models_prisma/offertEnterprise.model'; 
import { CategoryService } from '../../core/service_prisma/categorys.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enterprise-create-offerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enterprise-create-offerts.component.html',
  styleUrls: ['./enterprise-create-offerts.component.css']
})
export class EnterpriseCreateOffertsComponent implements OnInit {
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

  categories: any[] = []; 

  constructor(private offerService: OfferService, private categoryService: CategoryService, private router: Router) {}

  requirementsString: string = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error al cargar categorías', error);
      }
    );
  }

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
