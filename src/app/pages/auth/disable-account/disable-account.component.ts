import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserBuyerService } from '../../../services/user-buyer.service';
import { FormsModule } from '@angular/forms';
import { IBuyerUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-disable-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './disable-account.component.html',
  styleUrls: ['./disable-account.component.scss']
})
export class DisableAccountComponent implements OnInit {
  password: string = '';

  constructor(
    private userBuyerService: UserBuyerService,
    private authService: AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
  }

  handleFormSubmit(event: Event): void {
    event.preventDefault();
  
    Swal.fire({
      title: '¿Está seguro de que desea desactivar esta cuenta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = this.authService.getUser()?.id; 
  
        if (userId) {
          const user: IBuyerUser = {
            id: +userId,
            password: this.password
          };
          this.userBuyerService.disableAcct(user).subscribe({
            next: (response: any) => {
              Swal.fire({
                title: 'Cuenta desactivada',
                text: response,
                icon: 'success',
                confirmButtonText: 'Cerrar'
              }).then(() => {
                this.authService.logout();
                this.router.navigateByUrl('/login');
              });
            },
            error: (error: any) => {
              Swal.fire({
                title: 'Error',
                text: error.error,
                icon: 'error',
                confirmButtonText: 'Cerrar'
              });
            }
          });
        } else {
          console.error('User id is missing');
          Swal.fire({
            title: 'Error',
            text: 'User id is missing',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        }
      }
    });
  }
}