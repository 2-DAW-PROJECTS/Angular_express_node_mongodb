import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMobileMenuOpen = false;  // Variable para controlar la apertura del menú móvil

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;  // Cambiar el estado del menú
  }
}
