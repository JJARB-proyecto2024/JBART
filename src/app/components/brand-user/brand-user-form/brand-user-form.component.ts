import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBrandUser} from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand-user-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './brand-user-form.component.html',
  styleUrls: ['./brand-user-form.component.scss']
})
export class BrandUserFormComponent {
  @Input() action = '';
  @Input() brandUser: IBrandUser = {
    legalId: 0,
    logoType: '',
    brandName: '',
    legalRepresentativeName: '',
    mainLocationAddress: '',
    legalDocuments: '',
    brandCategories: '',
    status: '',
    email: '',
    password: '',
    createdAt: '',
    updatedAt: ''
  };

  @Output() callParentEvent: EventEmitter<IBrandUser> = new EventEmitter<IBrandUser>()
  @Output() deleteBrandUserEvent: EventEmitter<IBrandUser> = new EventEmitter<IBrandUser>();

  callEvent() {
    this.callParentEvent.emit(this.brandUser);
  }
  deleteEvent() {
    this.deleteBrandUserEvent.emit(this.brandUser);
  }
}