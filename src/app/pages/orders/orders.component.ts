import { Component, inject, OnInit } from '@angular/core';
import { OrderListComponent } from '../../components/orders/order-list/order-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IOrder } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { AvatarCreateComponent } from '../../components/avatar/avatar-create.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    OrderListComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent,
    AvatarCreateComponent
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
    this.orderService.getAll();
    this.orders = this.orderService.orders;
    //this.loadOrders();
    this.route.data.subscribe(data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  private loadOrders() {
    this.orderService.getAll();
    this.orders = this.orderService.orders;
    this.isLoading = false;
  }
}
