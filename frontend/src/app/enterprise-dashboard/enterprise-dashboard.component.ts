import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { OfferService } from '../core/service_prisma/offerts.service';
import { Router } from '@angular/router';
import { UserEnterpriseService } from '../core/service_prisma/userEnterprise.service';

@Component({
  selector: 'app-enterprise-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enterprise-dashboard.component.html',
  styleUrls: ['./enterprise-dashboard.component.css'],
  providers: [OfferService]
})
export class EnterpriseDashboardComponent implements OnInit {
  offers: any[] = [];
  isAuthenticated: boolean = false;

  constructor(
    private offerService: OfferService,
    private router: Router,
    private userEnterpriseService: UserEnterpriseService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.userEnterpriseService.getCurrentUser() !== null;
    if (this.isAuthenticated) {
      this.loadOffers();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadOffers() {
    this.offerService.getOffers().subscribe(
      (data: any) => {
        this.offers = data;
      },
      error => {
        console.error('Error al cargar las ofertas', error);
      }
    );
  }

  redirectToCreateOffer() {
    this.router.navigate(['/enterprise-create-offerts']);
  }

  createOffer(offerData: any) {
    const userId = this.userEnterpriseService.getCurrentUser();
    offerData.userId = userId;

    this.offerService.createOffer(offerData).subscribe(
      (response) => {
        console.log('Oferta creada:', response);
        this.loadOffers();
      },
      (error) => {
        console.error('Error al crear la oferta', error);
      }
    );
  }
}
