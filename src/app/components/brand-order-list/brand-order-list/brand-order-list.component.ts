import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { IOrder } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-brand-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './brand-order-list.component.html',
  styleUrl: './brand-order-list.component.scss',
  providers: [DatePipe]
})
export class BrandOrderListComponent implements OnChanges {

  @Input() brandOrderList: IOrder[] = [];
  @Input() areActionsAvailable: boolean = true;
  public orderService: OrderService = inject(OrderService);

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brandOrderList']) {
      console.log('brandOrderList', this.brandOrderList);
    }
  }

  trackByFn(index: number, item: IOrder) {
    return item.id;
  }
}
