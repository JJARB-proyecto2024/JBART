import { Component, inject, OnInit } from '@angular/core';
import { OrderListComponent } from '../../components/orders/order-list/order-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IOrder } from '../../interfaces';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    OrderListComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public orderService: OrderService = inject(OrderService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public routeAuthorities: string[] = [];
  public orders: IOrder[] = [];
  public isLoading: boolean = true;

  ngOnInit(): void {
    this.loadOrders();
    this.route.data.subscribe(data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  private loadOrders() {
    this.orderService.getAll().subscribe({
      next: (orders: IOrder[]) => {
        this.orders = orders;
        this.isLoading = false;
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
