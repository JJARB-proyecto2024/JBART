import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IOrder } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService<IOrder> {
  protected override source: string = 'orders';
  private orderListSignal = signal<IOrder[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  
  get orders$() {
    return this.orderListSignal;
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.orderListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all orders request', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
