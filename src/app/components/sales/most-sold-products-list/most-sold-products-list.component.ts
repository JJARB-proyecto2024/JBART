import { Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ISales } from '../../../interfaces';
import { SalesService } from '../../../services/sales.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-most-sold-products-list',
  standalone: true,
  imports: [],
  templateUrl: './most-sold-products-list.component.html',
  styleUrl: './most-sold-products-list.component.scss'
})
export class MostSoldProductsListComponent implements OnChanges{
  @Input() itemsList: ISales[] = [];
  @Input() areActionsAvailable: boolean = true;
  public selectedItem: ISales = {};
  public salesService: SalesService = inject(SalesService);
  @ViewChild('barChart', { static: true }) barChart: any;
  public chart: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
    if (changes['itemsList']) {
      console.log('itemsList', this.itemsList);
      this.updateChart();
    }
  
  }

  showDetailModal(item: ISales, modal: any) {
    console.log('showDetailModal', item);
    modal.show();
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const productNames = this.itemsList.map(item => item.productName);
    const quantitiesSold = this.itemsList.map(item => item.quantitySold);

    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: productNames,
        datasets: [{
          label: 'Cantidad Vendida',
          data: quantitiesSold,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
