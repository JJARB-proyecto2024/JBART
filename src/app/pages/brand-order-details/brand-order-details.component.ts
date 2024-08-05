import { Component, inject, Input, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../interfaces';
import { OrderMapComponent } from '../../components/order-map/order-map.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


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
          Swal.fire({
            title: 'Éxito',
            text: 'Estado de la orden actualizado',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Opcional: Realiza alguna acción después de cerrar el alert
            // Por ejemplo, redirigir a otra página o actualizar la vista
          });
          console.log('Estado de la orden actualizado', response);
        },
        error: (error: any) => {
          Swal.fire({
            title: 'Error',
            text: 'Error al actualizar el estado de la orden',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          console.error('Error al actualizar el estado de la orden', error);
        }
      });
    } else {
      Swal.fire({
        title: 'Advertencia',
        text: 'El id o el estado de la orden están indefinidos',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  
  
}
