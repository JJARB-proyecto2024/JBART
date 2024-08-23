import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BrandUserService } from '../../../services/brand-user.service';
import { IBrandUser } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { defineComponents, IgcRatingComponent } from 'igniteui-webcomponents';
import { RateBrandService } from '../../../services/rate_brand-user.service';
import { StarRatingComponent } from '../../star-rating/star-rating.component';

defineComponents(IgcRatingComponent);

@Component({
  selector: 'app-brand-user-avaliable-list-landing',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule,
    StarRatingComponent
  ],
  templateUrl: './brand-user-avaliable-list-landing.component.html',
  styleUrls: ['./brand-user-avaliable-list-landing.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})
export class BrandUserAvaliableListComponentLanding implements OnInit, OnChanges {
  
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
  itemsPerPage: number = 3;
  ratingValue: number = 0; 

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

}
