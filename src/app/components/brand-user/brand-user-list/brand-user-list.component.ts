import { Component, effect, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BrandUserService } from '../../../services/brand-user.service';
import { IBrandUser } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { BrandUserFormComponent } from '../brand-user-form/brand-user-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-brand-user-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    BrandUserFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './brand-user-list.component.html',
  styleUrls: ['./brand-user-list.component.scss'],
  providers: [DatePipe]
})
export class BrandUserListComponent implements OnChanges{
  
  @Input() itemList: IBrandUser[] = [];
  @Input() areActionsAvailable: boolean = false;
  public brandUserService: BrandUserService = inject(BrandUserService);

  public selectedItem: IBrandUser = {
    legalId: 0,
    logoType: '',
    brandName: '',
    legalRepresentativeName: '',
    mainLocationAddress: '',
    legalDocuments: '',
    status: '',
    email: '',
    brandCategories: '',
    password: '',
    createdAt: '',
    updatedAt: ''
  };

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
    if (changes['itemList']) {
      console.log('itemList', this.itemList);
    }
  }
  
  showDetailModal(item: IBrandUser, modal: any) {
    this.selectedItem = {...item}
    modal.show();
  }

  hideModal(modal: any) {
    modal.hide();
  }

  handleFormAction(item: IBrandUser, modal: any) {
    item.status = "Activo";
    console.log(item.status);
    this.brandUserService.updateStat(item);
    if (confirm('¿Está seguro de que desea aprobar esta solicitud?')) {
      this.brandUserService.updateStat(item);
      this.itemList = this.itemList.filter(u => u.id !== item.id);
      this.hideModal(modal);
    }
  }

  deleteBrandUser(item: IBrandUser, modal: any) {
    this.brandUserService.delete(item);
    if (confirm('¿Está seguro de que desea rechazar esta solicitud?')) {
      this.brandUserService.delete(item);
      this.itemList = this.itemList.filter(u => u.id !== item.id);
      this.hideModal(modal);
    }
  }
}