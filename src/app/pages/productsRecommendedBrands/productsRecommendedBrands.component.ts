import { Component, inject, OnInit } from '@angular/core';
import { ProductRecommendedBrandsListComponent } from '../../components/products-recomended-brands/product-recommended-brands-list/product-recommended-brands-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interfaces';
import { BrandUserAvaliableListComponent } from '../../components/brand-user/brand-user-list-avaliable/brand-user-avaliable-list.component';

@Component({
  selector: 'app-products-recommended-brands',
  standalone: true,
  imports: [
    ProductRecommendedBrandsListComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent,
    BrandUserAvaliableListComponent
  ],
  templateUrl: './productsRecommendedBrands.component.html',
  styleUrl: './productsRecommendedBrands.component.scss'
})
export class ProductsRecommendedBrandsComponent implements OnInit{
  public productService: ProductService = inject(ProductService);
  public itemId: number | undefined = 0;
  public item: IProduct = {};

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.itemId = params['id'];
      console.log(this.itemId)
    });
    this.productService.getByBrand(this.itemId);
  }
}
