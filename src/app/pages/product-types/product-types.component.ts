import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryCardsComponent } from '../../components/category/category-cards/category-cards.component';
import { Router } from '@angular/router';
import { ICategory } from '../../interfaces';

@Component({
  selector: 'app-product-types',
  standalone: true,
  imports: [CategoryCardsComponent],
  templateUrl: './product-types.component.html',
  styleUrls: ['./product-types.component.scss']
})
export class ProductTypesComponent implements OnInit {
  public categoryService: CategoryService = inject(CategoryService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.categoryService.getAll();
  }

  onCategorySelected(category: ICategory) {
    this.router.navigate(['app/products-recommended']);
  }
}
