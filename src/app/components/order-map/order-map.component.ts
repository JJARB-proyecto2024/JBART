import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, SimpleChanges } from '@angular/core';
import { AngularOpenlayersModule } from 'ng-openlayers';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-map',
  standalone: true,
  imports: [AngularOpenlayersModule, CommonModule],
  templateUrl: './order-map.component.html',
  styleUrl: './order-map.component.scss'
})
export class OrderMapComponent implements OnInit {
  public direction: String = '';
  public orderService: OrderService = inject(OrderService);

  ngOnInit(): void {
  }
}
