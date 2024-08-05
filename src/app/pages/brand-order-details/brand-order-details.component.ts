import { Component, inject, Input, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../interfaces';
import { OrderMapComponent } from '../../components/order-map/order-map.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, OrderMapComponent, FormsModule],
  templateUrl: './brand-order-details.component.html',
  styleUrl: './brand-order-details.component.scss'
})
export class BrandOrderDetailsComponent implements OnInit {
  public orderService: OrderService = inject(OrderService);
  public order: IOrder = {};
  public orderId: number = 0;
  public statusOptions = [
    'Pendiente',
    'En Proceso',
    'Completada',
    'Cancelada'
  ];

  constructor(private route: ActivatedRoute) {

  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      if (this.orderId) {
        this.orderService.getOrderByID(this.orderId).subscribe(order => {
          this.order = order;
        });
      }
    });
  }
  

  updateOrderStatus() {
    if (this.order && this.order.id && this.order.status) {
      this.orderService.updateStat(this.order).subscribe({
        next: (response: any) => {
          console.log('Estado de la orden actualizado', response);
        },
        error: (error: any) => {
          console.error('Error al actualizar el estado de la orden', error);
        }
      });
    } else {
      console.error('Order id or status is undefined', this.order);
    }
  }
  
}
