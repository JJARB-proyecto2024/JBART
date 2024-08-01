import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ICart } from '../../interfaces';

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carts.component.html',
  styleUrl: './carts.component.scss'
})
export class CartsComponent {
  @Input() carts: ICart[] = [];
}
