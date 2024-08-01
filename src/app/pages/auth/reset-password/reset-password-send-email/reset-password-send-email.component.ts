import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OtpService } from '../../../../services/otp.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { BackgroundParticlesModule } from '../../../../components/background-particles/background-particles.module';

@Component({
  selector: 'app-reset-password-send-email',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    BackgroundParticlesModule
  ],
  templateUrl: './reset-password-send-email.component.html',
  styleUrls: ['./reset-password-send-email.component.scss']
})
export class ResetPasswordSendEmailComponent {
  @ViewChild('email') emailModel!: NgModel;
  public email: string = ''; // Asegúrate de inicializar correctamente la variable email
  public signUpError!: String;

  public loginForm: { email: string;} = {
    email: '',
  };

  constructor(private otpService: OtpService, private snackBar: MatSnackBar, private router: Router) {}

  generateOtp(event: Event): void {
    event.preventDefault();
    this.email = this.emailModel.value +"";
  
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
            // Mostrar mensaje de éxito
          Swal.fire({
            title: 'Éxito!',
            text: 'OTP generado con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirigir a la ruta reset/validate después de que el usuario confirme
              this.router.navigateByUrl('reset/validate');
            }
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
          Swal.fire({
            title: '¡Error!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      });
    }
  } else {
    this.emailModel.control.markAsTouched();
  }
  }
  
}