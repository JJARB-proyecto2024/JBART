import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { IOrder } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './user-order-list.component.html',
  styleUrls: ['./user-order-list.component.scss'],
  providers: [DatePipe]
})
export class UserOrderListComponent implements OnChanges {

  @Input() userOrderList: IOrder[] = [];
  @Input() areActionsAvailable: boolean = true;
  public orderService: OrderService = inject(OrderService);

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userOrderList']) {
      console.log('userOrderList', this.userOrderList);
    }
  }

  showOrderDetails(order: IOrder) {
    this.router.navigateByUrl('app/buyer-order-details/' + order.id);
  }

  trackByFn(index: number, item: IOrder) {
    return item.id;
  }
}
