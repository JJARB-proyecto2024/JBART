import { Component, inject, ViewChild } from '@angular/core';
import { BackgroundParticlesModule } from '../../../../components/background-particles/background-particles.module';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OtpService } from '../../../../services/otp.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activate-account-send-email',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    BackgroundParticlesModule
  ],
  templateUrl: './activate-account-send-email.component.html',
  styleUrl: './activate-account-send-email.component.scss'
})
export class ActivateAccountSendEmailComponent {
  @ViewChild('email') emailModel!: NgModel;
  public email: string = '';
  public signUpError!: String;
  private otpService: OtpService = inject(OtpService);
  private router: Router = inject(Router);

  public loginForm: { email: string;} = {
    email: '',
  };

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
              this.router.navigateByUrl('reset/status/validate');
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
