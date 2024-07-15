import { Component, inject } from '@angular/core';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { BuyerProfileService } from '../../../services/buyer-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
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
  
}
