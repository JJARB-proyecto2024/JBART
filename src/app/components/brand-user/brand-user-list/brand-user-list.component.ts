import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { IBrandUser } from '../../../interfaces';
import { UserService } from '../../../services/user.service';
import { UserBrandService } from '../../../services/user-brand.service';


@Component({
  selector: 'app-brand-user-list',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './brand-user-list.component.html',
  styleUrl: './brand-user-list.component.scss'
})
export class BrandUserListComponent {
  public brandList: IBrandUser[] = [];
  private service = inject(UserBrandService);


  constructor() {
    this.service.getAll();
    effect(() => {
      this.brandList = this.service.items$();
    });
  }
  
}
