// import { Component, ChangeDetectorRef } from '@angular/core';
// import { UserService } from '../../../core/service/user.service';
// import { User } from '../../../core/models/user.model';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [],
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css'],
// })
// export class HeaderComponent{
//   isMenuOpen = false;

//   toggleMenu() {
//     this.isMenuOpen = !this.isMenuOpen;
//   }
  
//   constructor(
//     private userService: UserService,
//     private cd: ChangeDetectorRef
//   ) {}

//   currentUser: User | null = null;

//   ngOnInit() {
//     this.userService.currentUser.subscribe(
//       (userData) => {
//         this.currentUser = userData;
//         this.cd.markForCheck();
//       }
//     );
//   }
  
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/service/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  currentUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.userService.purgeAuth();
  }
}
