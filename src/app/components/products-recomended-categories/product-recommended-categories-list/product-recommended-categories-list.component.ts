import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';

defineComponents(IgcRatingComponent);

@Component({
  selector: 'app-product-recommended-categories-list',
  standalone: true,
 imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule
  ],
  templateUrl: './product-recommended-categories-list.component.html',
  styleUrl: './product-recommended-categories-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})
export class ProductRecommendedCategoriesListComponent implements OnInit{

  @Input() itemList: IProduct[] = [];
  @Input() areActionsAvailable: boolean = false;
  public productService: ProductService = inject(ProductService);
  public Math = Math;

  paginatedList: IProduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;

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

  trackById(index: number, item: IProduct) {
    
    console.log(item.rate);
    return item.id;
  }

  viewProducts(item: IProduct) {
    // Redirige a la página de productos
    //window.location.href = `/products/${item.id}`;
  }

}

