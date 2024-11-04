import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';    
import { CommentService } from '../core/service/comment.service';
import { Comment } from '../core/models/comments.model';
import { UserService } from '../core/service/user.service'; 
import { RouterModule } from '@angular/router'; 
import { OfferService } from '../core/service_prisma/offerts.service'; 

@Component({
  selector: 'app-comments',
  standalone: true,  
  imports: [CommonModule, FormsModule, RouterModule],  
  templateUrl: './details-comments.component.html',
  styleUrls: ['./details-comments.component.css']
})
export class DetailsCommentsComponent implements OnInit {
  @Input() offerSlug!: string;  
  @Input() offerId!: string; 
  comments: Comment[] = [];
  isLoggedIn: boolean = false;  
  currentUsername: string = ''; 
  newComment: string = '';
  
  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private offerService: OfferService
  ) {}
  
  ngOnInit() {
    console.log("Offer ID received in comments component:", this.offerId); 
    this.loadComments();
    this.userService.isAuthenticated.subscribe(
        (authenticated) => {
            this.isLoggedIn = authenticated;
            if (authenticated) {
                const currentUser = this.userService.getCurrentUser();
                this.currentUsername = currentUser ? currentUser.username : ''; 
            }
        }
    );
  }

  loadComments() {
    this.commentService.getAll(this.offerSlug).subscribe((comments) => {
      this.comments = comments;
      if (!Array.isArray(this.comments)) {
        this.comments = [];
      }
    }, error => {
      console.error('Error loading comments:', error);
      this.comments = [];
    });
  }

addComment() {
  if (this.newComment.trim()) {
      console.log("Adding comment:", this.newComment);

      this.commentService.add(this.offerSlug, this.newComment).subscribe((comment: Comment | undefined) => {
          if (comment) {
              console.log('Comment added:', comment);
              
              const commentId = comment.id; 

              console.log("Updating comments in offer with Offer ID:", this.offerId, "and Comment ID:", commentId);

              this.offerService.updateCommentsInOffer(this.offerId, commentId).subscribe({
                  next: () => {
                      console.log(`Comment ID ${commentId} added to offer ${this.offerId} in Prisma.`);
                  },
                  error: (err) => {
                      console.error('Error updating comments in Prisma:', err);
                      alert('Error al actualizar el comentario en la oferta.');
                  }
              });

              this.comments.push(comment);
              this.newComment = ''; 
          } else {
              console.error('Comment not added: No data returned from server.');
          }
      }, error => {
          console.error('Error adding comment:', error);
          alert('Error al agregar comentario: ' + (error.error.message || 'Por favor, intenta nuevamente.'));
      });
  } else {
      alert('El comentario no puede estar vacío.');
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
