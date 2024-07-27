import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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

    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'Por favor agregue un correo electrónico válido',
      });
      return;
    }

    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'Por favor agregue una contraseña válida',
      });
      return;
    }

    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => this.router.navigateByUrl('/app/dashboard'),
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error de Autenticación',
            text: 'Ingresa una contraseña o correo electronico valido'
          });
        }
      });
    }
  }
}
