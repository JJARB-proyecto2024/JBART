import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICart } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss'
})
export class CartListComponent {
  @Input() carts: ICart[] = [];
  public cartService: CartService = inject(CartService);
  handleDelete(cart: ICart) {
    this.cartService.delete(cart);
  }
}
