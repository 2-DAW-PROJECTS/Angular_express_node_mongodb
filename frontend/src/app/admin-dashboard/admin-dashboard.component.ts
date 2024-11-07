import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEnterpriseService } from '../core/service_TypeORM/userEnterprise.service';
import { UserEnterprise } from '../core/models_TypeORM/userEnterprise.model';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, NgIf, NgForOf],
})
export class AdminDashboardComponent implements OnInit {
  users: UserEnterprise[] = [];
  totalUsuarios: number = 0;
  totalUsuariosActivos: number = 0;
  totalUsuariosInactivos: number = 0;

  constructor(private userEnterpriseService: UserEnterpriseService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userEnterpriseService.getUsers().subscribe(
      (data: UserEnterprise[]) => {
        this.users = data;

        this.totalUsuarios = this.users.length;
        this.totalUsuariosActivos = this.users.filter(user => user.isActive).length;
        this.totalUsuariosInactivos = this.totalUsuarios - this.totalUsuariosActivos;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }
  toggleUserStatus(user: UserEnterprise): void {
    const newStatus = !user.isActive;
    this.userEnterpriseService.updateUserStatus(user._id, newStatus).subscribe(
      (updatedUser) => {
        user.isActive = newStatus;

        if (newStatus) {
          this.totalUsuariosActivos++;
          this.totalUsuariosInactivos--;
        } else {
          this.totalUsuariosActivos--;
          this.totalUsuariosInactivos++;
        }
      },
      (error) => {
        console.error('Error al actualizar el estado del usuario:', error);
      }
    );
  }

  deleteUser(userId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userEnterpriseService.deleteUser(userId).subscribe(
        () => {
          const deletedUser = this.users.find(user => user._id === userId);
          if (deletedUser) {
            this.users = this.users.filter(user => user._id !== userId);
            this.totalUsuarios--;

            if (deletedUser.isActive) {
              this.totalUsuariosActivos--;
            } else {
              this.totalUsuariosInactivos--;
            }
          }
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
  }
}