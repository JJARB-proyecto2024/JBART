import { Component, inject, OnInit } from '@angular/core';
import { ProductRecommendedListComponent } from '../../components/products-recomended/product-recommended-list/product-recommended-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-recommended',
  standalone: true,
  imports: [
    ProductRecommendedListComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './productsRecommended.component.html',
  styleUrl: './productsRecommended.component.scss'
})
export class ProductsRecommendedComponent implements OnInit{
  public productService: ProductService = inject(ProductService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public routeAuthorities: string[] = [];

  ngOnInit(): void {
    this.productService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }
}
