import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICart, IDesign, IProduct } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from "../store/payment/payment.component";

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule, PaymentComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.scss'
})
export class CartDetailsComponent implements OnInit {
  public cartService: CartService = inject(CartService);
  public router: Router = inject(Router);
  constructor(private route: ActivatedRoute) {

  }
  buyDesign(product: IProduct) {
    this.router.navigate(['/app/payment'], { state: { product: product } });
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cartService.getById(params['id']);
    });
  }
}
