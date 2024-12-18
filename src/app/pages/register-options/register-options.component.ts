import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AppLayoutLandingComponent } from '../../components/app-layout-landing/app-layout.component';

@Component({
  selector: 'app-register-options',
  standalone: true,
  imports: [CommonModule, MatButtonModule, AppLayoutLandingComponent],
  templateUrl: './register-options.component.html',
  styleUrls: ['./register-options.component.scss']
})
export class RegisterOptionsComponent {
  constructor(private router: Router) {}

  navigateToBuyerSignup() {
    this.router.navigate(['/signup/buyer']);
  }

  navigateToBrandSignup() {
    this.router.navigate(['/signup/brand']);
  }


}
