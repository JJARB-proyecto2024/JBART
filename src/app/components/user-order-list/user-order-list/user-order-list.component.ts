import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { IOrder } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './user-order-list.component.html',
  styleUrls: ['./user-order-list.component.scss'],
  providers: [DatePipe]
})
export class UserOrderListComponent implements OnChanges {

  @Input() userOrderList: IOrder[] = [];
  @Input() areActionsAvailable: boolean = true;
  public orderService: OrderService = inject(OrderService);
  public Math = Math;

  // Propiedades para la paginación
  paginatedList: IOrder[] = [];
  filteredOrderList: IOrder[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Propiedad para el filtro
  searchTerm: string = '';

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userOrderList']) {
      this.updateFilteredOrderList();
    }
  }

  // Filtra la lista de órdenes
  updateFilteredOrderList() {
    this.filteredOrderList = this.userOrderList.filter(order => {
      return (
        order.design?.product?.userBrand?.brandName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.design?.product?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userBuyer?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userBuyer?.lastname?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.updatePaginatedList();
  }

  // Actualiza la lista paginada
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.filteredOrderList.slice(startIndex, endIndex);
  }

  // Cambia de página
  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  // Muestra detalles de la orden
  showOrderDetails(order: IOrder) {
    this.router.navigateByUrl('app/buyer-order-details/' + order.id);
  }

  trackByFn(index: number, item: IOrder) {
    return item.id;
  }

  // Aplica el filtro al cambiar el término de búsqueda
  applyFilter() {
    this.updateFilteredOrderList();
  }
}
