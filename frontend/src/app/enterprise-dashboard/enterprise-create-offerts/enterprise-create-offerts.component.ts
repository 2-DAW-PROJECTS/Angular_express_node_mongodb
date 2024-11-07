import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../core/service_prisma/offerts.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Offert } from '../../core/models_prisma/offertEnterprise.model';
import { CategoryService } from '../../core/service/category.service';
import { CommonModule } from '@angular/common';
import { UserEnterpriseService } from '../../core/service_prisma/userEnterprise.service';
import { DatePipe } from '@angular/common'; // Asegúrate de importar DatePipe

@Component({
  selector: 'app-enterprise-create-offerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enterprise-create-offerts.component.html',
  styleUrls: ['./enterprise-create-offerts.component.css'],
  providers: [DatePipe] // Asegura DatePipe como proveedor
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
  requirementsString: string = '';
  formattedPostedDate: string = '';

  constructor(
    private offerService: OfferService,
    private categoryService: CategoryService,
    private router: Router,
    private userEnterpriseService: UserEnterpriseService,
    private datePipe: DatePipe // Inyección de DatePipe
  ) {}

  ngOnInit(): void {
    this.userEnterpriseService.isAuthenticated.subscribe((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return;
      }
      this.loadCategories();
    });

    this.setFormattedPostedDate(); // Inicializa la fecha al cargar
  }


  loadCategories(): void {
    this.categoryService.all_categories({}).subscribe(
      (response) => {
        this.categories = response.categorys;
      },
      (error) => {
        console.error('Error al cargar categorías', error);
      }
    );
  }

  setFormattedPostedDate(): void {
    this.formattedPostedDate = this.datePipe.transform(this.offer.postedDate, 'dd/MM/yyyy HH:mm') || '';
  }

  onSubmit() {
    this.offer.slug = this.offer.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    this.offer.postedDate = new Date().toISOString();
    this.offer.requirements = this.requirementsString.split(',').map(req => req.trim());
    this.offer.postedDate = new Date().toISOString();
    this.setFormattedPostedDate();
    const selectedCategory = this.categories.find(category => category.slug === this.offer.categorySlug);
    this.offer.category = selectedCategory ? selectedCategory.name : '';

    this.offerService.createOffer(this.offer).subscribe(
      (response) => {
        // console.log('Oferta creada:', response);
        this.router.navigate(['/enterprise-dashboard']);
      },
      (error) => {
        console.error('Error al crear la oferta', error);
      }
    );
  }
}
