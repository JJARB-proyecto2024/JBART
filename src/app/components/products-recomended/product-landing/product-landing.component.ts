import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';

defineComponents(IgcRatingComponent);

@Component({
  selector: 'app-product-landing',
  standalone: true,
 imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule
  ],
  templateUrl: './product-landing.component.html',
  styleUrl: './product-landing.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})
export class ProductlandingComponent implements OnInit{

  @Input() itemList: IProduct[] = [];
  @Input() areActionsAvailable: boolean = false;
  public productService: ProductService = inject(ProductService);
  public Math = Math;

  paginatedList: IProduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;

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

}

