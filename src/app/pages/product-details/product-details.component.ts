import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, NgModule, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StarRatingComponent } from "../../components/star-rating/star-rating.component";
import { ColorPickerModule } from 'ngx-color-picker';
import { TridimentionalDesignComponent } from '../../components/tridimentional-design/tridimentional-design.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../interfaces';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [StarRatingComponent, ColorPickerModule, TridimentionalDesignComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  color: string = '#2889e9';
  public productService: ProductService = inject(ProductService)
  public productModelURL: string = '';
  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productService.getById(params['id']);
      this.productModelURL = this.productService.item$().model || '';
    });
  }
}
