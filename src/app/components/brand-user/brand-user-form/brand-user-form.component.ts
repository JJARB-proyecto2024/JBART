import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IBrandUser, IFeedBackMessage, IFeedbackStatus } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { BrandUserService } from '../../../services/brand-user.service';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../../user/user-from/user-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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