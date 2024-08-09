import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IEarnings } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class EarningsService extends BaseService<IEarnings>{
  protected override source = 'sales/total-earnings';
  private itemListSignal = signal<IEarnings[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get items$() {
    return this.itemListSignal;
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        const earningsData: IEarnings[] = response.map((item: any) => ({
          id: item[0],
          name: item[1],
          earnings: item[2]
        }));
        earningsData.reverse();
        this.itemListSignal.set(earningsData);
      },
      error: (error: any) => {
        console.log("Error in get all earnings request", error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

}
