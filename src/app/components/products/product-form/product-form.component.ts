import { Component, EventEmitter, Input, Output, effect, inject } from '@angular/core';
import { IFeedBackMessage, IProduct, ICategory, IFeedbackStatus } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { BrandUserService } from '../../../services/brand-user.service';
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
export class ProductFormComponent {
  @Input() product: IProduct = {};
  @Input() action = '';
  @Output() callParentEvent: EventEmitter<IProduct> = new EventEmitter<IProduct>()
  public categoryService: CategoryService = inject(CategoryService)
  public brandUserService: BrandProfileService = inject(BrandProfileService)
  public categories: ICategory[] = []

  callEvent() {
    this.product.status = 'Activo'
    this.product.userBrand = {
      id: this.brandUserService.user$().id,
      role: this.brandUserService.user$().role
    };
    this.callParentEvent.emit(this.product);
  }
  ngOnInit() {
    this.brandUserService.getUserProfileInfo()
    this.categoryService.getAll()
    this.categories = this.categoryService.items$()
    console.log("categories", this.categories)
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