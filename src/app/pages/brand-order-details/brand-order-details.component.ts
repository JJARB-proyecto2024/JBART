import { Component, inject, Input, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../interfaces';
import { FormsModule } from '@angular/forms';
import { OrderMapComponent } from '../../components/order-map/order-map.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderMapComponent],
  templateUrl: './brand-order-details.component.html',
  styleUrl: './brand-order-details.component.scss'
})
export class BrandOrderDetailsComponent implements OnInit {
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
  }
}
