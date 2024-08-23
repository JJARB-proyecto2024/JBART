import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IBuyerUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { BackgroundParticlesModule } from '../../../components/background-particles/background-particles.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-Buyer-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BackgroundParticlesModule],
  templateUrl: './buyer-signup.component.html',
  styleUrl: './buyer-signup.component.scss'
})
export class BuyerSignupComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  @ViewChild('name') name!: NgModel;
  @ViewChild('lastname') lastname!: NgModel;
  @ViewChild('email') email!: NgModel;
  @ViewChild('password') password!: NgModel;

  public userBuyer: IBuyerUser = {};

  constructor(private authService: AuthService, private router: Router) {}

  public handleSignup(event: Event) {
    event.preventDefault();

    if(!this.name.valid) {
      this.name.control.markAsTouched();
    }
    
    if(!this.lastname.valid) {
      this.lastname.control.markAsTouched();
    }

    if(!this.email.valid) {
      this.email.control.markAsTouched();
    }

    if(!this.password.valid) {
      this.password.control.markAsTouched();
    }

    if(this.email.valid && this.password.valid) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email.value)) {
        Swal.fire({
          title: '¡Error!',
          text: 'Por favor, ingresa un correo electrónico válido',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      } else {
        this.signupUserBuyer();
      }
    }
  }
 
  private signupUserBuyer() {
    this.authService.signupBuyer(this.userBuyer).subscribe({
      next: () => {
      Swal.fire(
        '¡Registro exitoso!',
        'Por favor, inicia sesión',
        'success'
      ).then(() => {
        this.router.navigateByUrl('login')
      });
    },
      error: (err: any) => {
        this.signUpError = err.description;
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un error al registrarte',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

}
