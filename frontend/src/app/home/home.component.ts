import { Component } from '@angular/core';
<<<<<<< Updated upstream
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true, // Define el componente como independiente
  imports: [CommonModule], // Importa CommonModule para funcionalidades comunes
=======
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ListCategoryComponent } from '../shared/list-category/list-category.component';
import { ListEnterprisesComponent } from '../shared/list-enterprises/list-enterprises.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, SharedModule, HttpClientModule, ListCategoryComponent, ListEnterprisesComponent],
>>>>>>> Stashed changes
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
