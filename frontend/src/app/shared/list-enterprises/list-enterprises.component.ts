
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
  limit = 4;
  enterprises: Enterprise[] = [];
  //
  loading = false;
  allLoaded = false;
  //


  constructor(private EnterpriseService: EnterpriseService) { }//constructor


  //Iniciar

  ngOnInit(): void {
    this.getEnterprises();
  }//ngOnInit

  
  getEnterprises() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    const params = this.getRequestedParams(this.offset, this.limit);
  
    this.EnterpriseService.findAllEnterprises({params}).subscribe(
      (data: any) => {
        if (data.enterprises.length === 0) {
          this.allLoaded = true;
        } else {
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


  getRequestedParams(offset: number, limit: number): any{
    let params:any  = {};
      params[`offset`] = offset;
      params[`limit`] = limit;
    
    return params;
  }//getRequestedParams


  // scroll(){
  //   this.getEnterprises();
  // }//scroll

}//ListEnterprisesComponent
