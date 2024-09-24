// AppRoutingModule.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { ListOffertsComponent } from './shared/list-offerts/list-offerts.component';
import { DetailsComponent } from './details/details.component';
import { DetailsResolver } from './core/service/details.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'shop',
    component: ShopComponent
  },
  {
    path: 'shop/:slug',
    component: ListOffertsComponent
  },
  {
    path: 'details/:slug', // Nueva ruta para detalles de una oferta
    component: DetailsComponent,
    resolve: {
      offer: DetailsResolver // Asociamos el resolver
    }
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
