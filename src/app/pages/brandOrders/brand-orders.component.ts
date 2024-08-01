import { Component, inject, OnInit } from '@angular/core';
import { BrandOrderListComponent } from '../../components/brand-order-list/brand-order-list/brand-order-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IOrder } from '../../interfaces';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brand-orders',
  standalone: true,
  imports: [
    BrandOrderListComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './brand-orders.component.html',
  styleUrls: ['./brand-orders.component.scss']
})
export class BrandOrdersComponent implements OnInit {
  public orderService = inject(OrderService);
  public route = inject(ActivatedRoute);
  public authService = inject(AuthService);
  public areActionsAvailable = false;
  public routeAuthorities: string[] = [];
  public orders: IOrder[] = [];
  public isLoading = true;

  ngOnInit(): void {
    this.loadOrders();
    this.route.data.subscribe(data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  private loadOrders() {
    this.orderService.getOrdersListForBrand().subscribe({
      next: (orders: IOrder[]) => {
        this.orders = orders;
        this.isLoading = false;
        if (orders.length > 0) {
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Sin órdenes',
            text: 'No hay órdenes para mostrar.'
          });
        }
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al cargar las órdenes.'
        });
      }
    });
  }
}
