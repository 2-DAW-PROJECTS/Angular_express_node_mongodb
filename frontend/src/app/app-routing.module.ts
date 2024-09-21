import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent // COMPONENTE STANDALONE
  },
  {
    path: 'shop',
    component: ShopComponent// COMPONENTE STANDALONE???
  },
  // {
  //   path: 'shop',
  //   loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  // },
  // {
  //   path: 'shop/:id',
  //   loadChildren: () => import('./shop/product-details/product-details.module').then(m => m.ProductDetailsModule)
  // },
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
