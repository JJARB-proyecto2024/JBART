import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { IOrder } from '../../interfaces';
import { OrderMapComponent } from '../../components/order-map/order-map.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

type OrderStatus = 'Pendiente' | 'En Proceso' | 'Enviado' | 'Entregado';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, OrderMapComponent, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  
  updateOrderStatus() {
    this.order = this.orderService.order;

    if (!this.order || !this.order.id || !this.order.status) {
      Swal.fire({
        title: 'Advertencia',
        text: 'El id o el estado de la orden están indefinidos',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const currentStatus = this.order.status as OrderStatus;
    console.log('Estado actual de la orden:', currentStatus);

    const statusTransitions: { [key in OrderStatus]: OrderStatus | null } = {
      'Pendiente': 'En Proceso',
      'En Proceso': 'Enviado',
      'Enviado': 'Entregado',
      'Entregado': null
    };

    const newStatus = statusTransitions[currentStatus];

    if (newStatus) {
      this.order.status = newStatus;
      this.orderService.updateStat(this.order).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Éxito',
            text: `Estado de la orden actualizado a "${newStatus}"`,
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
        text: 'No se puede actualizar el estado, la orden ya está en "Entregado"',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  
  
}
