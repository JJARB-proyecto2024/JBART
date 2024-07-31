import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ICategory } from '../../../interfaces';
import { CommonModule } from '@angular/common';

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
  @Input() categoryList: ICategory[] = [];
  @Output() categorySelected = new EventEmitter<ICategory>();

  onCategoryClick(category: ICategory) {
    this.categorySelected.emit(category);
  }

  ngOnInit(): void {
    console.log(this.categoryList);
  }
}
