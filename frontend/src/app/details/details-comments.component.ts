import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';    
import { CommentService } from '../core/service/comment.service';
import { Comment } from '../core/models/comments.model';
import { UserService } from '../core/service/user.service'; 
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-comments',
  standalone: true,  
  imports: [CommonModule, FormsModule, RouterModule],  
  templateUrl: './details-comments.component.html',
  styleUrls: ['./details-comments.component.css']
})
export class DetailsCommentsComponent implements OnInit {
    @Input() offerSlug!: string;  
    comments: Comment[] = [];
    isLoggedIn: boolean = false;  
    currentUsername: string = ''; 
  
    newComment: string = '';
  
    constructor(
      private commentService: CommentService,
      private userService: UserService
    ) {}
  
    ngOnInit() {
      this.loadComments();
      this.userService.isAuthenticated.subscribe(
        (authenticated) => {
          this.isLoggedIn = authenticated;
          if (authenticated) {
            const currentUser = this.userService.getCurrentUser();
            this.currentUsername = currentUser ? currentUser.username : ''; 
          }
        //   console.log('isLoggedIn:', this.isLoggedIn);
        }
      );
    }

    loadComments() {
        this.commentService.getAll(this.offerSlug).subscribe((comments) => {
            this.comments = comments;
            // console.log('Loaded comments:', this.comments);
        }, error => {
            console.error('Error loading comments:', error);
        });
    }

    addComment() {
        if (this.newComment.trim()) {
            this.commentService.add(this.offerSlug, this.newComment).subscribe((comment) => {
                this.comments.push(comment);
                this.newComment = '';
            });
        }
    }

    deleteComment(commentId: string) {
        this.commentService.delete(commentId, this.offerSlug).subscribe({
            next: () => {
                this.comments = this.comments.filter(c => c.id !== commentId);
            },
            error: (err) => {
                console.error('Error eliminando el comentario:', err);
                alert(err.error.message || 'No tienes permiso para eliminar este comentario.');
            }
        });
    }
}
