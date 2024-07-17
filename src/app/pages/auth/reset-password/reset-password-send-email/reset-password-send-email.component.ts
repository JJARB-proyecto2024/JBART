import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OtpService } from '../../../../services/otp.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password-send-email',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password-send-email.component.html',
  styleUrls: ['./reset-password-send-email.component.scss']
})
export class ResetPasswordSendEmailComponent {
  @ViewChild('email') emailModel!: NgModel;
  public email: string = ''; // Asegúrate de inicializar correctamente la variable email
  public signUpError!: String;

  constructor(private otpService: OtpService, private snackBar: MatSnackBar, private router: Router) {}

  generateOtp(event: Event): void {
    event.preventDefault();
    this.email = this.emailModel.value;
  
    if (this.emailModel.valid) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        Swal.fire({
          title: '¡Error!',
          text: 'Por favor, ingresa un correo electrónico válido',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      } else {
        // Llamada al servicio para generar OTP
        this.otpService.generateOtp(this.email).subscribe({
          next: (response: any) => {
            console.log('Respuesta del servidor:', response);
            // Navegación a la ruta reset/validate antes de mostrar el mensaje de éxito
            this.router.navigateByUrl('reset/validate');
  
            // Mostrar mensaje de éxito después de navegar
            this.snackBar.open(response, 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error: any) => {
            console.error('Error generando OTP:', error);
            let errorMessage = 'Error generando OTP';
            if (error && error.status === 403) {
              errorMessage = 'Acceso denegado. No tienes permisos para generar OTP.';
            } else if (error && error.error && error.error.description) {
              errorMessage = error.error.description;
            }
            this.snackBar.open(errorMessage, 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    } else {
      this.emailModel.control.markAsTouched();
    }
  }
  
}