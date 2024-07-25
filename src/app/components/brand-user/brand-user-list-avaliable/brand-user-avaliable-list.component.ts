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
    this.rateBrandService.hasRatedBrand(this.selectedItem.id).subscribe({
      next: (response: IResponse<IRateBrand>) => {
        if (response) {
          Swal.fire({
            title: 'Rating Error',
            text: 'You have already rated this brand.',
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
          text: 'An error occurred while checking the rating.',
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

  // Método para verificar si el usuario ya ha calificado la marca
  private checkIfUserHasRatedBrand(brandId: number | undefined): void {
    if (brandId === undefined) {
      console.error('Brand ID is undefined');
      //return 1;
    }


    console.log(JSON.stringify (this.rateBrandService.hasRatedBrand(brandId)))

    const val = this.rateBrandService.hasRatedBrand(brandId);

    console.log("Respuesta: "+val)

    

    /*this.rateBrandService.getHasRatedBrand(brandId).subscribe({
      next: (hasRated: boolean) => {
        this.hasRated = hasRated;
      },
      error: (error: any) => {
        console.error('You have already rated this brand.', error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while checking the rating.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#FF5733'
        }).then(() => {
          this.hideModal(this.selectedItem); // Ocultar el modal si ya se ha calificado
        });
      }
    });*/

  }

  // Método para manejar el cambio de calificación
  handleRatingChange(event: number) {
    console.log('Rating changed to:', event);
    this.ratingValue = event;
  }

  handleFormAction(event: any, modal: any) {
    /*if (this.hasRated) {
      Swal.fire({
        title: 'Rating Error',
        text: 'You have already rated this brand.',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#FF5733'
      });
      return; // No permite enviar la calificación si ya ha calificado
    }*/
    // Crea un objeto rateData con la estructura requerida por la interfaz IRateBrand
    const rateData: IRateBrand = {
      // Asigna el id del userBrand seleccionado a la propiedad userBrand del objeto rateData
      userBrand: { id: this.selectedItem.id },
      // Asigna la calificación proporcionada por el usuario a la propiedad rate del objeto rateData
      rate: this.ratingValue
    };

    
    console.log("User Brand:"+ rateData.userBrand);
    console.log("Rate:"+ rateData.rate);
  
    // Llama al método save del servicio rateBrandService para enviar rateData al backend
    // Este método realiza una solicitud HTTP POST a la URL configurada para agregar la calificación
    this.rateBrandService.save(rateData);
  
    // Muestra una alerta de éxito usando SweetAlert
    Swal.fire({
      title: 'Calificación Enviada',
      text: 'La calificación se ha registrado correctamente.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      modal.hide();
    });
  }

}