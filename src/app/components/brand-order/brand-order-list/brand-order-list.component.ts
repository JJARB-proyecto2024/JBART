import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { IOrder } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { OrderBrandFormComponent } from '../brand-order-form/brand-order-form.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    if (changes['brandOrderList']) {
      this.updateFilteredOrderList();
    }
    if (changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
    console.log('brandOrderList', this.brandOrderList);
  }

  // Filtra la lista de órdenes
  updateFilteredOrderList() {
    this.filteredOrderList = this.brandOrderList.filter(order => {
      return (
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

  showSuccessAlert() {
    Swal.fire({
      title: 'Éxito',
      text: 'La orden se ha actualizado con éxito',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  // Aplica el filtro al cambiar el término de búsqueda
  applyFilter() {
    this.updateFilteredOrderList();
  }
}
