import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryCardsComponent } from "../../components/category/category-cards/category-cards.component";

@Component({
  selector: 'app-product-types',
  standalone: true,
  imports: [CategoryCardsComponent],
  templateUrl: './product-types.component.html',
  styleUrl: './product-types.component.scss'
})
export class ProductTypesComponent implements OnInit {
  public categoryService: CategoryService = inject(CategoryService)

  ngOnInit(): void {
    this.categoryService.getAll();
  }
}
