import { Component, inject, Input } from '@angular/core';
import { ICart } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss'
})
export class CartListComponent {
  @Input() carts: ICart[] = [];
  public router: Router = inject(Router);
  public cartService: CartService = inject(CartService);

  handleViewCart(cart: ICart) {
    this.router.navigateByUrl('app/cart-details/' + cart.id);
  }


  handleDelete(cart: ICart) {
    this.cartService.delete(cart);
  }
}
