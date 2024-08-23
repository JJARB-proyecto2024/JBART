import { Component, inject, OnInit } from '@angular/core';
import { ProductRecommendedCategoriesListComponent } from '../../components/products-recomended-categories/product-recommended-categories-list/product-recommended-categories-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interfaces';
import { CategoryCardsComponent } from '../../components/category/category-cards/category-cards.component';

@Component({
  selector: 'app-products-recommended-categories',
  standalone: true,
  imports: [
    ProductRecommendedCategoriesListComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent,
    CategoryCardsComponent
  ],
  templateUrl: './productsRecommendedCategories.component.html',
  styleUrl: './productsRecommendedCategories.component.scss'
})
export class ProductsRecommendedCategoriesComponent implements OnInit{
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
    this.productService.getByCategory(this.itemId);
  }
}
