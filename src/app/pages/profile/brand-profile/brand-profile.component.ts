import { Component, inject } from '@angular/core';
import { IBrandUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { BrandProfileService } from '../../../services/brand-profile.service';
import { Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './brand-profile.component.html',
  styleUrl: './brand-profile.component.scss'
})
export class BrandProfileComponent {
  public user!: IBrandUser;
  public brandProfileService = inject(BrandProfileService);

  constructor() {
    this.brandProfileService.getUserProfileInfo();
  }

  handleFormAction() {
    const userProfileUpdate = {
      id: this.brandProfileService.user$().id,
      logoType: this.brandProfileService.user$().logoType,
      mainLocationAddress: this.brandProfileService.user$().mainLocationAddress,
      brandCategories: this.brandProfileService.user$().brandCategories,
      email: this.brandProfileService.user$().email,
      password: this.brandProfileService.user$().password
    }
    this.brandProfileService.updateUserProfileInfo(userProfileUpdate);
  }

}