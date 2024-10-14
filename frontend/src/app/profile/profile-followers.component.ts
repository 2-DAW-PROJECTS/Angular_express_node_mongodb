import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../core/service/profile.service'; 
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-profile-followers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-followers.component.html', 
  styleUrls: ['./profile-followers.component.css']
})
export class ProfileFollowersComponent implements OnInit {
  @Input() followers: User[] = []; 
  allUsers: User[] = []; 
  currentUser: User | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.getFollowers(); 
  }

  getFollowers(): void {
    this.profileService.getFollowers().subscribe({
      next: (data: User[]) => {
        this.followers = data || []; 
      },
      error: (error) => {
        console.error('Error fetching followers:', error);
        this.followers = [];
      }
    });
  }

  deleteFollow(followerId: string): void {
    this.profileService.deleteFollower(followerId).subscribe({
      next: () => {
        // Actualizar la lista de seguidores eliminando el que se eliminó
        this.followers = this.followers.filter(follower => follower._id !== followerId);
      },
      error: (error) => {
        console.error('Error deleting follower:', error);
      }
    });
  }
  

}
