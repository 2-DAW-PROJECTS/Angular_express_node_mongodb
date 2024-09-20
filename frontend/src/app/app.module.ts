import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module'; // Importa SharedModule para el uso compartido de componentes
import { AppRoutingModule } from './app-routing.module'; // Asegúrate de importar el módulo de enrutamiento

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule // Importa el módulo de enrutamiento aquí
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
