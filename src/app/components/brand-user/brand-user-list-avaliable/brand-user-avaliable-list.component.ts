import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, Input, NgModule, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BrandUserService } from '../../../services/brand-user.service';
import { IBrandUser, IRateBrand, IResponse } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';
import { RateBrandService } from '../../../services/rate_brand-user.service';
import Swal from 'sweetalert2';
import { StarRatingComponent } from '../../star-rating/star-rating.component';

defineComponents(IgcRatingComponent);
@Component({
  selector: 'app-brand-user-avaliable-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule,
    StarRatingComponent
  ],
  templateUrl:'./brand-user-avaliable-list.component.html',
  styleUrls: ['./brand-user-avaliable-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})

export class BrandUserAvaliableListComponent implements OnInit, OnChanges {
  
  @Input() itemList: IBrandUser[] = [];
  @Input() areActionsAvailable: boolean = false;
  public brandUserService: BrandUserService = inject(BrandUserService);
  public rateBrandService: RateBrandService = inject(RateBrandService);
  public Math = Math;

  public selectedItem: IBrandUser = {
    id: 0,
    brandName: '',
    brandCategories: '',
    rate: 0
  };

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  paginatedList: IBrandUser[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  ratingValue: number = 0; // Valor inicial de la calificación

  ngOnInit() {
    this.updatePaginatedList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['itemList']) {
      this.updatePaginatedList();
    }
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.itemList.slice(startIndex, endIndex);
  }

  updateItemList() {
    this.brandUserService.getActive();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  trackById(index: number, item: IBrandUser) {
    return item.id;
  }

  viewProducts(item: IBrandUser) {
    // Redirige a la página de productos
    //window.location.href = `/products/${item.id}`;
    console.log(item.id);
    this.router.navigate(['/ratesBrand', item.id]);
  }

  showDetailModal(item: IBrandUser, modal: any) {
    this.selectedItem = {...item}
    this.rateBrandService.getHasRatedBrand(this.selectedItem.id).subscribe({
      next: (response: IResponse<IRateBrand>) => {
        if (response) {
          Swal.fire({
            title: 'Rating Error',
            text: 'Usted ya cuenta con una calificación registrada.',
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: '#FF5733'
          }).then(() => {
            this.hideModal(modal);
          });
        } else {
          modal.show();
        }
      },
      error: (error: any) => {
        console.error('Error handling rating check:', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al revisar la calificación.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#FF5733'
        });
      }
    });
  }

  hideModal(modal: any) {
    modal.hide();
  }

  // Método para manejar el cambio de calificación
  handleRatingChange(event: number) {
    this.ratingValue = event;
  }

  handleFormAction(event: any, modal: any) {
    // Crea un objeto rateData con la estructura requerida por la interfaz IRateBrand
    const rateData: IRateBrand = {
      userBrand: { id: this.selectedItem.id }, // Asigna el id del userBrand seleccionado
      rate: this.ratingValue // Asigna la calificación proporcionada por el usuario
    };
  
    // Llama al método save del servicio rateBrandService para enviar rateData al backend
    this.rateBrandService.save(rateData).subscribe({
      next: (response: IResponse<IRateBrand>) => {
        // Muestra un mensaje de éxito usando SweetAlert
        Swal.fire({
          title: 'Éxito',
          text: 'La calificación se ha guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          // Cierra el modal si el usuario hace clic en el botón 'Cerrar'
          this.hideModal(modal);
          this.updateItemList();
        });
      },
      error: (error: any) => {
        // Muestra un mensaje de error usando SweetAlert
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar la calificación. Por favor, inténtelo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

}