import { Component, inject } from '@angular/core';
import { IBrandUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { BrandProfileService } from '../../../services/brand-profile.service';
import { FormsModule } from '@angular/forms';
declare const cloudinary: any; 
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

  handleRemoveImg() {
    this.brandProfileService.user$().logoType = '';
  }

  openCloudinaryWidget() {
    cloudinary.openUploadWidget({ 
      cloudName: 'drlznypvr', 
      uploadPreset: 'ml_default'
    }, (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        console.log('File uploaded successfully to Cloudinary');
        this.brandProfileService.user$().logoType = result.info.secure_url;
      }
    });
  }
}