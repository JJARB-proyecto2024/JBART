import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserBuyerService } from '../../../services/user-buyer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { IBuyerUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-disable-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disable-account.component.html',
  styleUrls: ['./disable-account.component.scss']
})
export class DisableAccountComponent implements OnInit {
  password: string = '';

  constructor(
    private userBuyerService: UserBuyerService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Puedes implementar lógica aquí para obtener detalles adicionales del usuario si es necesario
  }

  handleFormSubmit(event: Event): void {
    event.preventDefault();

    if (confirm('¿Está seguro de que desea desactivar esta cuenta?')) {
      const userId = this.authService.getUser()?.id; // Obtiene el id del usuario desde el servicio de autenticación

      if (userId) {
        const user: IBuyerUser = {
          id: +userId,
          password: this.password
        };

        // Llamada al servicio para desactivar la cuenta
        this.userBuyerService.disableAcct(user).subscribe({
          next: (response: any) => {
            this.snackBar.open(response, 'Cerrar', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            // Aquí podrías redirigir a una página de confirmación o actualizar la vista según tu flujo
          },
          error: (error: any) => {
            this.snackBar.open(error.error, 'Cerrar', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      } else {
        console.error('User id is missing');
        this.snackBar.open('User id is missing', 'Cerrar', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    }
  }
}
