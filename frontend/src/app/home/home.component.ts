import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ListCategoryComponent } from '../shared/list-category/list-category.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, SharedModule, HttpClientModule, ListCategoryComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
