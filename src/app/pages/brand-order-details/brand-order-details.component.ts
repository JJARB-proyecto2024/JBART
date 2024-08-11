import { Component, inject, Input, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../interfaces';
import { OrderMapComponent } from '../../components/order-map/order-map.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Define el tipo OrderStatus
type OrderStatus = 'Pendiente' | 'En Proceso' | 'Enviado' | 'Entregado';

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
  public statusOptions: OrderStatus[] = [
    'Pendiente',
    'En Proceso',
    'Enviado',
    'Entregado'
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
      // Obtener el nuevo estado del select
      const newStatus = this.order.status as OrderStatus;
      const currentStatus = this.orderService.order.status as OrderStatus;
  
      // Validar las transiciones de estado permitidas
      const allowedTransitions: { [key in OrderStatus]: OrderStatus[] } = {
        'Pendiente': ['En Proceso'],
        'En Proceso': ['Enviado'],
        'Enviado': ['Entregado'],
        'Entregado': []
      };
  
      // Verifica si el estado actual permite la transición al nuevo estado
      if (allowedTransitions[currentStatus]?.includes(newStatus) || newStatus === currentStatus) {
        this.order.status = newStatus;
        this.orderService.updateStat(this.order).subscribe({
          next: (response: any) => {
            Swal.fire({
              title: 'Éxito',
              text: 'Estado de la orden actualizado',
              icon: 'success',
              confirmButtonText: 'Aceptar'
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
          text: `No puedes cambiar el estado de "${currentStatus}" a "${newStatus}"`,
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
        // Revertir el cambio en el select
        this.order.status = currentStatus;
      }
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
