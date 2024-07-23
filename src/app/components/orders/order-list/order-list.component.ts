import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { IOrder } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  providers: [DatePipe]
})
export class OrderListComponent implements OnChanges {

  @Input() orderList: IOrder[] = [];
  @Input() areActionsAvailable: boolean = true;
  public orderService: OrderService = inject(OrderService);

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderList']) {
      console.log('orderList', this.orderList);
    }
  }

  trackByFn(index: number, item: IOrder) {
    return item.id;
  }
}
