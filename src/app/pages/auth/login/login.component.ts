import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { BackgroundParticlesModule } from '../../../components/background-particles/background-particles.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    BackgroundParticlesModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginError!: string;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  public handleLogin(event: Event) {
    event.preventDefault();
    
    // Mark fields as touched
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }

    // Validate fields
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => {
          Swal.fire({
            title: 'Éxito',
            text: 'Iniciaste sesión correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigateByUrl('/app/dashboard');
          });
        },
        error: (err: any) => {
          if (err.error.errorMessage) {
            Swal.fire({
              title: 'Error',
              text: err.error.errorMessage,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al iniciar sesión.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        },
      });
    } else {
      if (!this.emailModel.valid) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, ingresa un correo electrónico válido.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
      if (!this.passwordModel.valid) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, ingresa una contraseña válida.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  }
}
