import { Injectable } from '@angular/core';
import { UserService } from '../service/user.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private userService: UserService) {}

  getUserProfile(): Observable<User | null> {
    return this.userService.currentUser;
  }
}
