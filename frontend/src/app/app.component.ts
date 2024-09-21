import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule], // Importa RouterOutlet para el enrutamiento
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
