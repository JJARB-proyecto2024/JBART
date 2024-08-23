import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OtpService } from '../../../../services/otp.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BackgroundParticlesModule } from '../../../../components/background-particles/background-particles.module';

@Component({
  selector: 'app-reset-password-validate',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    BackgroundParticlesModule],
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

  public loginForm: { email: string; otpCode: string; newPassword: string;} = {
    email: '',
    otpCode: '',
    newPassword: '',
  };

  constructor(private otpService: OtpService, private snackBar: MatSnackBar, private router: Router) {}

  resetPassword(event: Event): void {
    event.preventDefault();
  if (!this.emailModel.valid) {
    this.emailModel.control.markAsTouched();
    Swal.fire({
      title: '¡Error!',
      text: 'Por favor, ingresa un correo electrónico válido',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  if (!this.otpCodeModel.valid) {
    this.otpCodeModel.control.markAsTouched();
    Swal.fire({
      title: '¡Error!',
      text: 'Por favor, ingresa un código OTP válido',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  if (!this.newPasswordModel.valid) {
    this.newPasswordModel.control.markAsTouched();
    Swal.fire({
      title: '¡Error!',
      text: 'Por favor, ingresa una nueva contraseña válida',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }
    
    this.email = this.emailModel.value;
    this.otpCode = this.otpCodeModel.value;
    this.newPassword = this.newPasswordModel.value;
  this.otpService.resetPassword(this.email, this.otpCode, this.newPassword).subscribe({
    next: (response: any) => {
      if (response === false) {
        Swal.fire({
          title: '¡Error!',
          text: 'No se pudo restablecer la contraseña. Verifica el OTP y el correo electrónico.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.otpCodeModel.control.markAsUntouched();
          }
        });
      } else {
        Swal.fire({
          title: 'Éxito!',
          text: 'Contraseña restablecida exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/login');
          }
        });
      }
    },
    error: (error: any) => {
      console.error('Error restableciendo contraseña:', error);
      let errorMessage = 'Error restableciendo contraseña';
      if (error && error.status === 403) {
        errorMessage = 'Acceso denegado. No tienes permisos para restablecer la contraseña.';
      } else if (error && error.error && error.error.description) {
        errorMessage = error.error.description;
      }
      Swal.fire({
        title: '¡Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  });
  }
}