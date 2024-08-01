import { Component, inject, ViewChild } from '@angular/core';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { BuyerProfileService } from '../../../services/buyer-profile.service';
import { Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
declare const cloudinary: any; 
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './buyer-profile.component.html',
  styleUrl: './buyer-profile.component.scss'
})
export class BuyerProfileComponent {
  public user!: IUser;
 
  public buyerProfileService = inject(BuyerProfileService);
  constructor() {
    this.buyerProfileService.getUserProfileInfo();
  }

  handleFormAction() {
    const userProfileUpdate = {
      id: this.buyerProfileService.user$().id,
      name: this.buyerProfileService.user$().name,
      lastname: this.buyerProfileService.user$().lastname,
      picture: this.buyerProfileService.user$().picture,
      genre: this.buyerProfileService.user$().genre,
      deliveryLocation: this.buyerProfileService.user$().deliveryLocation,
      phoneNumber: this.buyerProfileService.user$().phoneNumber
    }
    this.buyerProfileService.updateUserProfileInfo(userProfileUpdate);
  }

  handleRemoveImg() {
    this.buyerProfileService.user$().picture = '';
  }
  openCloudinaryWidget() {
    cloudinary.openUploadWidget({ 
      cloudName: 'drlznypvr', 
      uploadPreset: 'ml_default'
    }, (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        console.log('File uploaded successfully to Cloudinary');
        this.buyerProfileService.user$().picture = result.info.secure_url;
      }
    });
  }
}