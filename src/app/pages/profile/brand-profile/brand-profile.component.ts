import { Component, inject } from '@angular/core';
import { IBrandUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { BrandProfileService } from '../../../services/brand-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
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
  
}
