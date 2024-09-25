
import { Component, OnInit } from '@angular/core';
import { EnterpriseService } from '../../core/service/enterprise.service'
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CardEnterprisesComponent } from '../card-enterprises/card-enterprises.component';
import { Enterprise } from '../../core/models/enterprise.model';


@Component({
  selector: 'app-list-enterprises',
  standalone: true,
  imports: [CommonModule, InfiniteScrollModule, CardEnterprisesComponent],
  templateUrl: './list-enterprises.component.html',
  styleUrl: './list-enterprises.component.css'
})//Component

export class ListEnterprisesComponent implements OnInit {
  offset = 0;
  limit = 3; // Establecemos el límite de 3 empresas por llamada
  enterprises: Enterprise[] = [];
  loading = false;
  allLoaded = false;

  constructor(private enterpriseService: EnterpriseService) {}

  ngOnInit(): void {
    this.getEnterprises();
  }

  getEnterprises() {
    // Evitar nuevas solicitudes si ya se está cargando o si todas las empresas ya han sido cargadas
    if (this.loading || this.allLoaded) return;
    
    this.loading = true;
    
    const params = this.getRequestedParams(this.offset, this.limit);
    
    this.enterpriseService.findAllEnterprises(params).subscribe(
      (data: any) => {
        // Si no hay más empresas que cargar, marcar como "allLoaded"
        if (data.enterprises.length === 0) {
          this.allLoaded = true;
        } else {
          // Agregar las empresas obtenidas a la lista de empresas existente
          this.enterprises = [...this.enterprises, ...data.enterprises];
          this.offset += this.limit;
        }
        this.loading = false;
      },
      error => {
        console.error('Error fetching enterprises:', error);
        this.loading = false;
      }
    );
  }

  getRequestedParams(offset: number, limit: number): any {
    return { offset, limit };
  }
}

//ListEnterprisesComponent
