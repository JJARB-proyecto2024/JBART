import { Component, Input } from '@angular/core';
import { ICategory } from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-cards',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './category-cards.component.html',
  styleUrl: './category-cards.component.scss'
})
export class CategoryCardsComponent {
  @Input() categoryList: ICategory[] = [];

  ngOnInit(): void {
    console.log(this.categoryList);
  }

}
