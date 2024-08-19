import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AngularOpenlayersModule } from 'ng-openlayers';
import { OrderService } from '../../services/order.service';
import { IOrder } from '../../interfaces';

@Component({
  selector: 'app-order-map',
  standalone: true,
  imports: [AngularOpenlayersModule, CommonModule],
  templateUrl: './order-map.component.html',
  styleUrls: ['./order-map.component.scss']
})
export class OrderMapComponent {
  @Input() order: IOrder = {};
  public latitude: number = 0;
  public longitude: number = 0;
  public orderService: OrderService = inject(OrderService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] && this.order) {
      console.log("Order:", this.order);
      const address = this.order.currentLocation || this.order.product?.userBrand?.mainLocationAddress;
      if (address) {
        this.getCoordinates(address);
      } else {
        console.warn('No hay una dirección definida para convertir a coordenadas');
      }
    }
  }

  async getCoordinates(address: string | undefined) {
    if (address) {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          const location = data[0];
          this.latitude = parseFloat(location.lat);
          this.longitude = parseFloat(location.lon);
        } else {
          console.error('No results found for the address.');
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    }
  }
}
