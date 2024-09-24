import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../app/core/service/category.service';
import { Category } from '../../../app/core/models/category.model';
import { CommonModule } from '@angular/common';
import { CardCategoryComponent } from '../card-category/card-category.component';
import { CarouselModule } from 'primeng/carousel';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list-category',
  standalone: true,
  imports: [CommonModule, CardCategoryComponent, CarouselModule],
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {
  categories: Category[] = [];
  
  // Define responsiveOptions aquí
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.all_categories({}).pipe(
      map(data => data.categorys)
    ).subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories', error);
      }
    );
  }
}
