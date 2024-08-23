import { Component, inject, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule, DatePipe } from '@angular/common';
import { IOrder, IProduct, IRateProduct, IResponse } from '../../interfaces';
import { OrderMapComponent } from '../../components/order-map/order-map.component';
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { RateProductService } from '../../services/rate_product.service';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

defineComponents(IgcRatingComponent);
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule,
    StarRatingComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './buyer-order-details.component.html',
  styleUrl: './buyer-order-details.component.scss',
  providers: [DatePipe]
})
export class BuyerOrderDetails implements OnInit {
  public orderService: OrderService = inject(OrderService);
  public order: IOrder = {};
  public orderId: number = 0;


  @Input() itemList: IProduct[] = [];
  @Input() areActionsAvailable: boolean = false;
  public productService: ProductService = inject(ProductService);
  public rateProductService: RateProductService = inject(RateProductService);
  public Math = Math;

  paginatedList: IProduct[] = [];
  ratingValue: number = 0; // Valor inicial de la calificación

  public selectedItem: IOrder = {
    id: 0,
    product: {
      id: 0,
      name: ""
    }
  };

  constructor(private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
    });
    this.orderService.getOrderByID(this.orderId);
    console.log(this.orderService.order)
  }

  updateItemList() {
    this.orderService.getOrderByID(this.orderId);
  }

  showDetailModal(item: IOrder, modal: any) {

    if (this.selectedItem.product && item.product) {
      this.selectedItem.product.id = item.product.id;
      console.log("ID:" + this.selectedItem.product.id)
      this.selectedItem.product.name = item.product.name;
      console.log("Name:" + this.selectedItem.product.name)
    }
    
    this.orderService.getOrderByStatus(this.selectedItem.product?.id).subscribe({
      next: (response: IOrder[]) => {
        if (response && response.length > 0) {
          console.log("SI", response);
          this.createScore(item, modal);
          
        } else {
          Swal.fire({
            title: 'Rating Error',
            text: 'El producto aún no ha sido entregado.',
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: '#FF5733'
          });
          console.log("NO");
        }
      },
      error: (error: any) => {
        console.error('Error handling rating check:', error);
      }
    });    
  }

  createScore(item: IOrder, modal: any){
    this.rateProductService.getHasRatedProduct(this.selectedItem.product?.id).subscribe({
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
      product: { id: this.selectedItem.product?.id },
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
