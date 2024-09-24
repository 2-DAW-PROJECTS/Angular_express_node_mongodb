import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Enterprise } from '../../core/models/enterprise.model';



@Component({
  selector: 'app-card-enterprises',
  standalone: true,
  imports: [],
  templateUrl: './card-enterprises.component.html',
  styleUrl: './card-enterprises.component.css'
})
export class CardEnterprisesComponent {
  @Input() enterprise: Enterprise = {} as Enterprise;

    constructor() {}

    ngOnInit(): void {  
    }
}