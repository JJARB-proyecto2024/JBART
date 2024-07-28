import { Component, effect, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BrandUserService } from '../../../services/brand-user.service';
import { IBrandUser } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { BrandUserFormComponent } from '../brand-user-form/brand-user-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brand-user-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    BrandUserFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './brand-user-list.component.html',
  styleUrls: ['./brand-user-list.component.scss'],
  providers: [DatePipe]
})
export class BrandUserListComponent implements OnChanges{
  
  @Input() itemList: IBrandUser[] = [];
  @Input() areActionsAvailable: boolean = false;
  public brandUserService: BrandUserService = inject(BrandUserService);

  public selectedItem: IBrandUser = {
    legalId: 0,
    logoType: '',
    brandName: '',
    legalRepresentativeName: '',
    mainLocationAddress: '',
    legalDocuments: '',
    status: '',
    email: '',
    brandCategories: '',
    password: '',
    createdAt: '',
    updatedAt: ''
  };

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
    if (changes['itemList']) {
      console.log('itemList', this.itemList);
    }
  }
  
  showDetailModal(item: IBrandUser, modal: any) {
    this.selectedItem = {...item}
    modal.show();
  }

  hideModal(modal: any) {
    modal.hide();
  }

  updateItemList() {
    this.brandUserService.getNewRequests();
  }

  handleFormAction(item: IBrandUser, modal: any) {
    item.status = "Activo";
    console.log(item.status);

    // Usar SweetAlert para la confirmación
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de que desea aprobar esta solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.brandUserService.updateStat(item).subscribe({
          next: () => {
            // Actualizar la lista de elementos
            this.itemList = this.itemList.filter(u => u.id !== item.id);
            // Ocultar el modal
            this.hideModal(modal);
            this.updateItemList();
            // Mostrar mensaje de éxito
            Swal.fire(
              'Aprobado',
              'La solicitud ha sido aprobada.',
              'success'
            );
          },
          error: (error: any) => {
            // Manejar el error
            console.error('Error updating item status', error);
            Swal.fire(
              'Error',
              'Hubo un problema al aprobar la solicitud.',
              'error'
            );
          }
        });
      }
    });
  }

  deleteBrandUser(item: IBrandUser, modal: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de que desea rechazar esta solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.brandUserService.delete(item).subscribe({
          next: () => {
            // Actualizar la lista de elementos
            this.itemList = this.itemList.filter(u => u.id !== item.id);
            // Ocultar el modal
            this.hideModal(modal);
            // Mostrar mensaje de éxito
            Swal.fire(
              'Rechazado',
              'La solicitud ha sido rechazada.',
              'success'
            );
          },
          error: (error: any) => {
            // Manejar el error
            console.error('Error deleting item', error);
            Swal.fire(
              'Error',
              'Hubo un problema al rechazar la solicitud.',
              'error'
            );
          }
        });
      }
    });
  }
}