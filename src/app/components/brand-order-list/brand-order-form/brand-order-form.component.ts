import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IOrder} from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand-order-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './brand-order-form.component.html',
  styleUrls: ['./brand-order-form.component.scss']
})
export class OrderBrandFormComponent {
  @Input() action = '';
  @Input() order: IOrder = {
    status: ''
  };

  @Output() callParentEvent: EventEmitter<IOrder> = new EventEmitter<IOrder>()

  callEvent() {
    this.callParentEvent.emit(this.order);
  }
}