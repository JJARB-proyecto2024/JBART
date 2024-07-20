import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BrandUserService } from '../../../services/brand-user.service';
import { IBrandUser } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';

defineComponents(IgcRatingComponent);

@Component({
  selector: 'app-brand-user-avaliable-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule
  ],
  templateUrl:'./brand-user-avaliable-list.component.html',
  styleUrls: ['./brand-user-avaliable-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})
export class BrandUserAvaliableListComponent implements OnInit {
  
  @Input() itemList: IBrandUser[] = [];
  @Input() areActionsAvailable: boolean = false;
  public brandUserService: BrandUserService = inject(BrandUserService);
  public Math = Math;

  paginatedList: IBrandUser[] = [];
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

  trackById(index: number, item: IBrandUser) {
    
    console.log(item.rate);
    return item.id;
  }

  viewProducts(item: IBrandUser) {
    // Redirige a la página de productos
    //window.location.href = `/products/${item.id}`;
  }

}