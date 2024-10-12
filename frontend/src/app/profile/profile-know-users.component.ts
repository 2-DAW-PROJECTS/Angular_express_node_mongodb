import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../core/service/profile.service'; 
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-profile-know-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-know-users.component.html', 
  styleUrls: ['./profile-know-users.component.css']
})
export class ProfileKnowUsersComponent implements OnInit {
  @Input() allUsers: User[] = []; 

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.profileService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.allUsers = data || []; 
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.allUsers = []; 
      }
    });
  }

  followUser(username: string): void {
    this.profileService.followUser(username).subscribe({
      next: () => {
        // Actualizamos el estado del usuario a "isFollowing = true"
        this.allUsers = this.allUsers.map(user =>
          user.username === username ? { ...user, isFollowing: true } : user
        );
      },
      error: (error) => {
        console.error('Error following user:', error);
      }
    });
  }

  unfollowUser(username: string): void {
    this.profileService.unfollowUser(username).subscribe({
      next: () => {
        // Actualizamos el estado del usuario a "isFollowing = false"
        this.allUsers = this.allUsers.map(user =>
          user.username === username ? { ...user, isFollowing: false } : user
        );
      },
      error: (error) => {
        console.error('Error unfollowing user:', error);
      }
    });
  }
}
