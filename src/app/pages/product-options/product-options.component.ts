import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-options',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './product-options.component.html',
  styleUrls: ['./product-options.component.scss']
})
export class ViewOptionsComponent {
  constructor(private router: Router) {}

  navigateToProducts() {
    this.router.navigate(['app/products-recommended']);
  }

  navigateToCategories() {
    this.router.navigate(['app/product-types']);
  }

  navigateToBrands() {
    this.router.navigate(['app/brands-avaliable']);
  }
}
