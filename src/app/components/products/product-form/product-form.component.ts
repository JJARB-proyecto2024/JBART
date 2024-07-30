import { Component, EventEmitter, Input, Output, effect, inject, OnInit, SimpleChanges } from '@angular/core';
import { IProduct, ICategory } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BrandProfileService } from '../../../services/brand-profile.service';
declare const cloudinary: any;
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  @Input() product: IProduct = {};
  @Input() action = '';
  @Output() callParentEvent: EventEmitter<IProduct> = new EventEmitter<IProduct>()
  public brandUserService: BrandProfileService = inject(BrandProfileService)
  @Input() categories: ICategory[] = []

  ngOnInit() {
    this.brandUserService.getUserProfileInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories']) {
      this.product.category = this.categories[0];
    }
  }
  callEvent() {
    this.product.status = 'Activo'
    this.product.userBrand = {
      id: this.brandUserService.user$().id,
      role: this.brandUserService.user$().role
    };
    this.callParentEvent.emit(this.product);
  }

  handleRemoveImg() {
    this.product.picture = '';
  }

  openCloudinaryWidget() {
    cloudinary.openUploadWidget({
      cloudName: 'drlznypvr',
      uploadPreset: 'ml_default'
    }, (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        console.log('File uploaded successfully to Cloudinary');
        this.product.picture = result.info.secure_url;
      }
    });
  }

}