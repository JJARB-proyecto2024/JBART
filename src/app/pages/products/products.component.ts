import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ProductListComponent } from '../../components/products/product-list/product-list.component';
import { ProductFormComponent } from '../../components/products/product-form/product-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interfaces';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductListComponent,
    LoaderComponent,
    CommonModule,
    ModalComponent,
    ProductFormComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  public productService: ProductService = inject(ProductService);
  public categoryService: CategoryService = inject(CategoryService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public routeAuthorities: string[] = [];
  @ViewChild('addModal') addModal!: ModalComponent;
  @ViewChild(ProductFormComponent) productFormComponent!: ProductFormComponent;
  ngOnInit() {
    this.categoryService.getAll();
    this.productService.getAllProductsBrand();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  handleFormAction(item: IProduct) {
    this.productService.save(item).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: 'El producto ha sido agregado exitosamente.',
        timer: 2000
      });
      this.addModal.hide();
      this.resetForm();
    });
  }
  resetForm() {
    if (this.productFormComponent) {
      this.productFormComponent.resetForm();
    }
  }
}
