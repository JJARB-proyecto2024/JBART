import { Component, inject } from '@angular/core';
import { CartListComponent } from "../../components/cart-list/cart-list.component";
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartListComponent, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  public cartService: CartService = inject(CartService);
  public authService: AuthService = inject(AuthService);

  public user?: IUser = {};
  ngOnInit() {
    this.user = this.authService.getUser();
    this.cartService.getAllByUserId(this.user?.id || 0) || [];
  }
}
