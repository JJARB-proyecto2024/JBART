import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, NgModule, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { StarRatingComponent } from "../../components/star-rating/star-rating.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { TridimentionalDesignComponent } from '../../components/tridimentional-design/tridimentional-design.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IBrandUser, IProduct } from '../../interfaces';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [StarRatingComponent, ColorPickerModule, TridimentionalDesignComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  public productService: ProductService = inject(ProductService)
  public productModelURL: string = '';
  public router: Router = inject(Router);
  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productService.getById(params['id']);
      this.productModelURL = this.productService.item$().model || '';
    });
  }

  public viewBrandProducts() {
    this.router.navigateByUrl('app/products-recommended-brands/' + this.productService.item$().userBrand?.id);
  }
}
