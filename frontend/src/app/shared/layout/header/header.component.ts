import { Component, OnInit } from '@angular/core';  
import { UserService } from '../../../core/service/user.service';  
import { ChangeDetectorRef } from '@angular/core'; 
import { User } from '../../../core/models/user.model'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    this.userService.populate();
    this.userService.currentUser.subscribe(userData => {
      this.currentUser = userData;
    });
}

  logout() {
    this.userService.purgeAuth();
  }
}
