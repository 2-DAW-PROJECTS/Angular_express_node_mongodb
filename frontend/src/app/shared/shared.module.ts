import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from '../home/home.component'; // Importa el componente

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent
    
  ],
  imports: [
    HomeComponent,
    CommonModule
  ],
  exports: [
    FooterComponent,
    HomeComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
