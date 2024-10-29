import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module'; 
import { UserService } from './core/service/user.service';
import { UserEnterpriseService } from './core/service_prisma/userEnterprise.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    private userService: UserService, 
    private userEnterpriseService: UserEnterpriseService
  ) {}

  ngOnInit() {
    this.userService.populate();  
    this.userEnterpriseService.populate(); 
  }
}
