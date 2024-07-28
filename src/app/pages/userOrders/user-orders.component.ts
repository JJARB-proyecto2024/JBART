import { Component, inject, OnInit } from '@angular/core';
import { UserOrderListComponent } from '../../components/user-order-list/user-order-list/user-order-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IOrder } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [
    UserOrderListComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {
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
    this.orderService.getOrdersListForUser().subscribe({
      next: (orders: IOrder[]) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
