import { CommonModule } from '@angular/common';
import { Component, Input, OnInit , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ICart } from '../../interfaces';

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carts.component.html',
  styleUrl: './carts.component.scss'
})
export class CartsComponent {
  @Input() carts: ICart[] = [];
}
