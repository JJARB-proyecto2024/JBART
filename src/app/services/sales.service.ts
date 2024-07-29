import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISales } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';



@Injectable({
  providedIn: 'root'
})
export class SalesService extends BaseService<ISales>{
  protected override source = 'sales/most-sold-products';
  private itemListSignal = signal<ISales[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get items$() {
    return this.itemListSignal;
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        const salesData: ISales[] = response.map((item: any) => ({
          productName: item[0],
          category: item[1],
          quantitySold: item[2]
        }));
        salesData.reverse();
        this.itemListSignal.set(salesData);
      },
      error: (error: any) => {
        console.log("Error in get all sales request", error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }
}
