import { CommonModule } from '@angular/common';
import { Component, viewChild, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IBrandUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-brand-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './brand-signup.component.html',
  styleUrl: './brand-signup.component.scss'
})
export class BrandSignupComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  @ViewChild('legalId') legalId!: NgModel;
  @ViewChild('logoType') logoType!: NgModel;
  @ViewChild('brandName') brandName!: NgModel;
  @ViewChild('legalRepresentativeName') legalRepresentativeName!: NgModel;
  @ViewChild('mainLocationAddress') mainLocationAddress!: NgModel;
  @ViewChild('legalDocument') legalDocument!: NgModel;
  @ViewChild('brandCategory') brandCategory!: NgModel;
  @ViewChild('email') email!: NgModel;
  @ViewChild('password') password!: NgModel;

  public userBrand: IBrandUser = {};

  constructor(private router: Router, private authService: AuthService) {}

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

    if(!this.legalDocument.valid) {
      this.legalDocument.control.markAsTouched();
    }

    if(!this.brandCategory.valid) {
      this.brandCategory.control.markAsTouched();
    }

    if(this.email.valid && this.password.valid) {
      this.authService.signupBrand(this.userBrand).subscribe({
        next: () => this.validSignup = true,
        error: (err: any) => (this.signUpError = err.description)
      })
    }
  }

}
