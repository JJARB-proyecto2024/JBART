import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { IOrder } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { OrderBrandFormComponent } from '../brand-order-form/brand-order-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    OrderBrandFormComponent,
    ModalComponent
  ],
  templateUrl: './brand-order-list.component.html',
  styleUrls: ['./brand-order-list.component.scss'],
  providers: [DatePipe]
})
export class BrandOrderListComponent implements OnChanges {

  @Input() brandOrderList: IOrder[] = [];
  @Input() areActionsAvailable: boolean = true;
  public orderService: OrderService = inject(OrderService);
  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
    if (changes['brandOrderList']) {
      console.log('brandOrderList', this.brandOrderList);
    }
  }

  showOrderDetails(order: IOrder) {
    this.router.navigateByUrl('app/brand-order-details/' + order.id);
  }
  
  trackByFn(index: number, item: IOrder) {
    return item.id;
  }

  handleFormAction(item: IOrder, modal: any) {
    this.orderService.updateStat(item);
    this.updateItemList();
    this.hideModal(modal);
  }

  updateItemList() {
    this.orderService.getOrdersListForBrand();
  }

  hideModal(modal: any) {
    modal.hide();
  }

}
