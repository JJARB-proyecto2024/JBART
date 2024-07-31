import { Component, effect, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ICategory } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { CategoryFormComponent } from '../category-from/category-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    CategoryFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  providers: [DatePipe]
})
export class CategoryListComponent implements OnChanges{
  @Input() itemList: ICategory[] = [];
  @Input() areActionsAvailable: boolean = false;
  public categoryService: CategoryService = inject(CategoryService);

  public selectedItem: ICategory = {
    name: '',
    description:'',
    image:''
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
  
  showDetailModal(item: ICategory, modal: any) {
    this.selectedItem = {...item}
    modal.show();
  }

  hideModal(modal: any) {
    modal.hide();
  }

  handleFormAction(item: ICategory, modal: any) {
    this.categoryService.update(item).subscribe({
      next: (response: any) => {
        // Mostrar mensaje de éxito
        Swal.fire(
          'Éxito',
          'La categoría ha sido actualizada exitosamente.',
          'success'
        ).then(() => {
          // Ocultar el modal después de mostrar el mensaje de éxito
          this.hideModal(modal);
        });
      },
      error: (error: any) => {
        // Manejar el error
        console.error('Error updating category', error);
        Swal.fire(
          'Error',
          'Hubo un problema al actualizar la categoría.',
          'error'
        ).then(() => {
          // Ocultar el modal después de mostrar el mensaje de error
          this.hideModal(modal);
        });
      }
    });
  }

  deleteCategory(item: ICategory, modal: any) {
    // Mostrar mensaje de confirmación
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de que desea eliminar la categoría?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, proceder con la eliminación
        this.categoryService.delete(item).subscribe({
          next: (response: any) => {
            // Mostrar mensaje de éxito
            Swal.fire(
              'Eliminado',
              'La categoría ha sido eliminada exitosamente.',
              'success'
            ).then(() => {
              // Ocultar el modal después de mostrar el mensaje de éxito
              this.hideModal(modal);
            });
          },
          error: (error: any) => {
            // Manejar el error
            console.error('Error deleting category', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la categoría.',
              'error'
            ).then(() => {
              // Ocultar el modal después de mostrar el mensaje de error
              this.hideModal(modal);
            });
          }
        });
      }
    });
  }
}