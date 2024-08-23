import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ICart } from '../../interfaces';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carts.component.html',
  styleUrl: './carts.component.scss'
})
export class CartsComponent {
  @Input() carts: ICart[] = [];
  public router: Router = inject(Router);
  public cartService: CartService = inject(CartService);

  handleViewCart(cart: ICart) {
    this.router.navigateByUrl('app/cart-details/' + cart.id);
  }

  handleDeleteCart(cart: ICart) {
    this.cartService.delete(cart);
  }
}
