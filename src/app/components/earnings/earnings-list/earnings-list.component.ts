import { Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IEarnings } from '../../../interfaces';
import { EarningsService } from '../../../services/earnings.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-earnings-list',
  standalone: true,
  imports: [],
  templateUrl: './earnings-list.component.html',
  styleUrl: './earnings-list.component.scss'
})
export class EarningsListComponent implements OnChanges{
  @Input() itemsList: IEarnings[] = [];
  @Input() areActionsAvailable: boolean = true;
  public selectedItem: IEarnings = {};
  public earningsService: EarningsService = inject(EarningsService);
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

  showDetailModal(item: IEarnings, modal: any) {
    console.log('showDetailModal', item);
    modal.show();
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const productNames = this.itemsList.map(item => item.name);
    const quantitiesSold = this.itemsList.map(item => item.earnings);

    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: productNames,
        datasets: [{
          label: 'Ganancias',
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
