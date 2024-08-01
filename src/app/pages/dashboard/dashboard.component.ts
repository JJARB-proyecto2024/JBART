import { Component, inject, OnInit } from '@angular/core';
import { ProductRecommendedListComponent } from '../../components/products-recomended/product-recommended-list/product-recommended-list.component';
import { ProductService } from '../../services/product.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LoaderComponent,
    ProductRecommendedListComponent,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  public productService: ProductService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getAll();
  }
}
