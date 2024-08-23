import { Component } from '@angular/core';
import { CategoryListComponent } from '../../../components/category/category-list/category-list.component';
import { CategoryFormComponent } from '../../../components/category/category-from/category-form.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { ModalComponent } from '../../../components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { AvatarSeeComponent } from '../../../components/avatar/avatar-see/avatar-see.component';

@Component({
  selector: 'app-avatar-view',
  standalone: true,
  imports: [
    CategoryListComponent,
    LoaderComponent,
    CommonModule,
    ModalComponent,
    CategoryFormComponent,
    AvatarSeeComponent
  ],
  templateUrl: './avatar-view.component.html',
  styleUrl: './avatar-view.component.scss'
})
export class AvatarViewComponent{
  
}