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
  @Input() brand: IBrandUser = {
    logoType: '',
    mainLocationAddress: '',
    brandCategories: '',
    email: '',
    password: '',
    status: ''
  };
  public brandProfileService = inject(BrandProfileService);

  constructor() {
    this.brandProfileService.getUserProfileInfo();
  }

}
