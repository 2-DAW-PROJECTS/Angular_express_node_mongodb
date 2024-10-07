import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { ListOffertsComponent } from './shared/list-offerts/list-offerts.component';
import { DetailsComponent } from './details/details.component';
import { DetailsResolver } from './core/service/details.service';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';

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
    path: 'details/:slug',
    component: DetailsComponent,
    resolve: {
      offer: DetailsResolver
    }
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'register', 
    component: AuthComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
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
