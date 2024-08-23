import { Component, inject, OnInit } from '@angular/core';
import { CategoryListComponent } from '../../components/category/category-list/category-list.component';
import { CategoryFormComponent } from '../../components/category/category-from/category-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ICategory } from '../../interfaces';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ChatbotFloatingComponent } from '../../components/chatbot/chatbot-floating/chatbot-floating.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CategoryListComponent,
    LoaderComponent,
    CommonModule,
    ModalComponent,
    CategoryFormComponent,
    ChatbotFloatingComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit{
  public categoryService: CategoryService = inject(CategoryService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService =  inject(AuthService);
  public routeAuthorities: string[] =  [];

  ngOnInit(): void {
    this.categoryService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  hideModal(modal: any) {
    modal.hide();
  }

  handleFormAction(item: ICategory, modal: any) {
    this.categoryService.save(item).subscribe({
      next: (response: any) => {
        Swal.fire(
          'Éxito',
          'La categoría ha sido guardada exitosamente.',
          'success'
        ).then(() => {
          this.hideModal(modal);
        });
      },
      error: (error: any) => {
        console.error('Error saving category', error);
        Swal.fire(
          'Error',
          'Hubo un problema al guardar la categoría.',
          'error'
        ).then(() => {
          this.hideModal(modal);
        });
      }
    });
  }

}