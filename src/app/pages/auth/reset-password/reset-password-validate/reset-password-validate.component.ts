import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OtpService } from '../../../../services/otp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-validate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password-validate.component.html',
  styleUrls: ['./reset-password-validate.component.scss']
})
export class ResetPasswordValidateComponent {
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('otpCode') otpCodeModel!: NgModel;
  @ViewChild('newPassword') newPasswordModel!: NgModel;

  public email: string = " ";
  public otpCode: string = " ";
  public newPassword: string = " ";

  constructor(private otpService: OtpService, private snackBar: MatSnackBar, private router: Router) {}

  resetPassword(event: Event): void {
    event.preventDefault();

    // Validar que todos los campos estén llenos y válidos
    if (!this.emailModel.valid || !this.otpCodeModel.valid || !this.newPasswordModel.valid) {
      this.emailModel.control.markAsTouched();
      this.otpCodeModel.control.markAsTouched();
      this.newPasswordModel.control.markAsTouched();

      return;
    }
    
    this.email = this.emailModel.value;
    this.otpCode = this.otpCodeModel.value;
    this.newPassword = this.newPasswordModel.value;

    // Llamar al servicio para restablecer la contraseña
    this.otpService.resetPassword(this.email, this.otpCode, this.newPassword).subscribe({
      next: (response: any) => {
        console.log('Contraseña restablecida exitosamente:');
        this.snackBar.open('Contraseña restablecida exitosamente', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        }).afterDismissed().subscribe(() => {
          // Redirigir al usuario al componente de login después de cerrar el mensaje
          this.router.navigateByUrl('/login');
        });
      },
      error: (error: any) => {
        console.error('Error restableciendo contraseña:', error);
        let errorMessage = 'Error restableciendo contraseña';
        if (error && error.status === 403) {
          errorMessage = 'Acceso denegado. No tienes permisos para restablecer la contraseña.';
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
}