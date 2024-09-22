import { Component, OnInit } from '@angular/core';
import { OffertService } from '../../core/service/offert.service';
import { Offert } from '../../core/models/offert.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-offerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-offerts.component.html',
  styleUrls: ['./list-offerts.component.css']
})
export class ListOffertsComponent implements OnInit {
  offerts: Offert[] = [];

  constructor(private offertService: OffertService) {}

  ngOnInit() {
    this.loadOfferts();
  }

  loadOfferts() {
    this.offertService.all_offerts({}).subscribe({
      next: (data) => {
        console.log(data.offerts.length);
        this.offerts = data.offerts;
      },
      error: (err) => {
        console.error('Error fetching offers', err);
      }
    });
  }
  
  
}
