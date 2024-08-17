import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { RateProductService } from '../../../services/rate_product.service';
import { IProduct, IRateProduct, IResponse } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';
import Swal from 'sweetalert2';
import { StarRatingComponent } from '../../star-rating/star-rating.component';

defineComponents(IgcRatingComponent);

@Component({
  selector: 'app-product-recommended-list',
  standalone: true,
 imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule,
    StarRatingComponent
  ],
  templateUrl: './product-recommended-list.component.html',
  styleUrl: './product-recommended-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})
export class ProductRecommendedListComponent implements OnInit{

  @Input() itemList: IProduct[] = [];
  @Input() areActionsAvailable: boolean = false;
  public productService: ProductService = inject(ProductService);
  public rateProductService: RateProductService = inject(RateProductService);
  public Math = Math;
  public router: Router = inject(Router);

  paginatedList: IProduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  ratingValue: number = 0; // Valor inicial de la calificación

  public selectedItem: IProduct = {
    id: 0,
    name: '',
    rate: 0
  };

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
    this.productService.getAll();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  trackById(index: number, item: IProduct) {
    
    // console.log(item.rate);
    return item.id;
  }

  viewProducts(item: IProduct) {
    // Redirige a la página de productos
    //window.location.href = `/products/${item.id}`;
  }
  buyProduct(item: IProduct) {
    this.router.navigate(['/app/payment'], { state: { product: item } });
  }

  showDetailModal(item: IProduct, modal: any) {
    this.selectedItem = {...item}
    this.rateProductService.getHasRatedProduct(this.selectedItem.id).subscribe({
      next: (response: IResponse<IRateProduct>) => {
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
    const rateData: IRateProduct = {
      product: { id: this.selectedItem.id },
      rate: this.ratingValue
    };
  
    this.rateProductService.save(rateData).subscribe({
      next: (response: IResponse<IRateProduct>) => {
        Swal.fire({
          title: 'Éxito',
          text: 'La calificación se ha guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.hideModal(modal);
          this.updateItemList();
        });
      },
      error: (error: any) => {
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

