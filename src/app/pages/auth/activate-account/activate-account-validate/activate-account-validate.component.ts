import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
// import { Background } from '@tsparticles/engine';
import { BackgroundParticlesModule } from '../../../../components/background-particles/background-particles.module';
import { Router } from '@angular/router';
import { OtpService } from '../../../../services/otp.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activate-account-validate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BackgroundParticlesModule
  ],
  templateUrl: './activate-account-validate.component.html',
  styleUrl: './activate-account-validate.component.scss'
})
export class ActivateAccountValidateComponent {
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('otpCode') otpCodeModel!: NgModel;
  private otpService: OtpService = inject(OtpService);
  private router: Router = inject(Router);

  public email: string = " ";
  public otpCode: string = " ";

  public loginForm: { email: string; otpCode: string; } = {
    email: '',
    otpCode: '',
  };

  resetStatus(event: Event): void {
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

    this.email = this.emailModel.value;
    this.otpCode = this.otpCodeModel.value;

    this.otpService.activateAccount(this.email, this.otpCode).subscribe({
      next: (response: any) => {
        if(response === false) {
          Swal.fire({
            title: '¡Error!',
            text: 'El código OTP es incorrecto',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.otpCodeModel.control.markAsTouched();
            }
          });
        }else {
          Swal.fire({
            title: 'Éxito!',
            text: 'Cuenta activada con éxito',
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
        console.error('Error activando cuenta:', error);
        let errorMessage = 'Error activando cuenta';
        if (error && error.status === 403) {
          errorMessage = 'Acceso denegado. No tienes permisos para activar la cuenta.';
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
