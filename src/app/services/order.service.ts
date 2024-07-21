import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IOrder } from '../interfaces';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService<IOrder> {
  protected override source: string = 'orders';
  private orderListSignal = signal<IOrder[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get orders() {
    return this.orderListSignal();
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

  public getOrdersForBrand(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`/orders/brand`).pipe(
      tap((response: IOrder[]) => {
        this.orderListSignal.set(response.reverse());
      }),
      catchError((error: any) => {
        console.error('Error fetching orders for brand', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        return of([]); // Devuelve un observable con un array vacío en caso de error
      })
    );
  }

  public getOrdersForUser(): void {
    this.http.get<IOrder[]>(`/orders/user`).subscribe({
      next: (response: any) => {
        response.reverse();
        this.orderListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get orders for user request', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
