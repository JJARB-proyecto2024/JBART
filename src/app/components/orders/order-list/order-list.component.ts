import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { IOrder } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [DatePipe]
})
export class OrderListComponent implements OnChanges, OnInit {

  @Input() orderList: IOrder[] = [];
  @Input() areActionsAvailable: boolean = true;
  public orderService: OrderService = inject(OrderService);
  public Math = Math;

  // Propiedades para la paginación
  paginatedList: IOrder[] = [];
  filteredOrderList: IOrder[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;

  // Propiedad para el filtro
  searchTerm: string = '';

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.updateFilteredOrderList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderList']) {
      this.updateFilteredOrderList();
    }
  }

  updateFilteredOrderList() {
    // Aplica el filtro
    this.filteredOrderList = this.orderList.filter(order => {
      return (
        order.product?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userBuyer?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userBuyer?.lastname?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.filteredOrderList.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  trackByFn(index: number, item: IOrder) {
    return item.id;
  }

  applyFilter() {
    this.updateFilteredOrderList();
  }
}
