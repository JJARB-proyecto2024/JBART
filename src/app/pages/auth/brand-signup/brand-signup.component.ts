import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IBrandUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { BackgroundParticlesModule } from '../../../components/background-particles/background-particles.module';
import { BrandUserListComponent } from '../../../components/brand-user/brand-user-list/brand-user-list.component';
declare const cloudinary: any; 

@Component({
  selector: 'app-brand-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BrandUserListComponent, BackgroundParticlesModule],
  templateUrl: './brand-signup.component.html',
  styleUrls: ['./brand-signup.component.scss']
})
export class BrandSignupComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  @ViewChild('legalId') legalId!: NgModel;
  @ViewChild('logoType') logoType!: NgModel;
  @ViewChild('brandName') brandName!: NgModel;
  @ViewChild('legalRepresentativeName') legalRepresentativeName!: NgModel;
  @ViewChild('mainLocationAddress') mainLocationAddress!: NgModel;
  @ViewChild('legalDocuments') legalDocuments!: NgModel;
  @ViewChild('brandCategory') brandCategories!: NgModel;
  @ViewChild('email') email!: NgModel;
  @ViewChild('password') password!: NgModel;

  public userBrand: IBrandUser = {};

  constructor(private authService: AuthService, private router: Router) {}

  public handleSignup(event: Event) {
    event.preventDefault();

    if(!this.legalId.valid) {
      this.legalId.control.markAsTouched();
    }
    
    if(!this.logoType.valid) {
      this.logoType.control.markAsTouched();
    }

    if(!this.brandName.valid) {
      this.brandName.control.markAsTouched();
    }

    if(!this.legalRepresentativeName.valid) {
      this.legalRepresentativeName.control.markAsTouched();
    }

    if(!this.mainLocationAddress.valid) {
      this.mainLocationAddress.control.markAsTouched();
    }

    if(!this.brandCategories.valid) {
      this.brandCategories.control.markAsTouched();
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
        this.signupUserBrand();
      }
    }
  }

  public openCloudinaryWidget() {
    cloudinary.openUploadWidget({
      cloudName: 'drlznypvr',
      uploadPreset: 'ml_default'
    }, (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        console.log('File uploaded successfully to Cloudinary');
        this.userBrand.logoType = result.info.secure_url;
      }
    });
  }

  public openCloudinaryWidgetLegalDocuments() {
    cloudinary.openUploadWidget({
      cloudName: 'drlznypvr',
      uploadPreset: 'ml_default'
    }, (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        console.log('File uploaded successfully to Cloudinary');
        this.userBrand.legalDocuments = result.info.secure_url;
      }
    });
  }

  private signupUserBrand() {
    this.authService.signupBrand(this.userBrand).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'Tu registro ha sido exitoso. Un administrador revisará tu solicitud y te notificará por correo electrónico cuando tu cuenta esté activa.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['/login']); 
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
      }
    });
  }
}
