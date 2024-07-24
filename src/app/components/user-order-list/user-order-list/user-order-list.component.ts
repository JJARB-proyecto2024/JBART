import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { IOrder } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userOrderList']) {
      console.log('userOrderList', this.userOrderList);
    }
  }

  trackByFn(index: number, item: IOrder) {
    return item.id;
  }
}
