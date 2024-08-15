import { Component, Input, Output, EventEmitter, inject, SimpleChanges } from '@angular/core';
import { ICategory } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-cards',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './category-cards.component.html',
  styleUrls: ['./category-cards.component.scss']
})
export class CategoryCardsComponent {
  @Input() itemList: ICategory[] = [];
  @Output() categorySelected = new EventEmitter<ICategory>();
  @Input() areActionsAvailable: boolean = false;
  public categoryService: CategoryService = inject(CategoryService);
  public Math = Math;

  constructor(private router: Router) {}
  // Cambiado para redirigir a products-recommended
  viewProducts(item: ICategory) {
    this.router.navigateByUrl('app/products-recommended-categories/' + item.id);
  }

  paginatedList: ICategory[] = [];
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

  trackById(index: number, item: ICategory) {
    return item.id;
  }

}
