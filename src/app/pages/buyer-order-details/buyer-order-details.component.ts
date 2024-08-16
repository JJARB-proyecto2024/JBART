import { Component, inject, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../interfaces';
import { OrderMapComponent } from '../../components/order-map/order-map.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, OrderMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './buyer-order-details.component.html',
  styleUrl: './buyer-order-details.component.scss'
})
export class BuyerOrderDetails implements OnInit {
  public orderService: OrderService = inject(OrderService);
  public order: IOrder = {};
  public orderId: number = 0;

  constructor(private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
    });
    this.orderService.getOrderByID(this.orderId);
    console.log(this.orderService.order)
  }
}
