import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ICategory } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}
  // Cambiado para redirigir a products-recommended
  viewProducts(item: ICategory) {
    this.router.navigateByUrl('app/products-recommended-categories/' + item.id);
  }

  ngOnInit(): void {
    console.log(this.categoryList);
  }
}
