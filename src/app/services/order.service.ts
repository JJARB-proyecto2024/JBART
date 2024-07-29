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
        /*this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });*/
      }
    });
  }

  public getOrdersListForBrand(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.source}/brand`).pipe(
      tap((response: IOrder[]) => {
        this.orderListSignal.set(response.reverse());
      }),
      catchError((error: any) => {
        console.error('Error fetching orders for brand', error);
        /*this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });*/
        return of([]); // Devuelve un observable con un array vacío en caso de error
      })
    );
  }

  public getOrdersListForUser(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.source}/user`).pipe(
      tap((response: IOrder[]) => {
        this.orderListSignal.set(response.reverse());
      }),
      catchError((error: any) => {
        console.error('Error fetching orders for user', error);
        /*this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });*/
        return of([]); // Devuelve un observable con un array vacío en caso de error
      })
    );
  }

  public updateStat(item: IOrder) {
    if (item.id !== undefined && item.status !== undefined) {
      this.updateStatus(item.id, item.status).subscribe({
        next: (response: any) => {
          const updatedItems = this.orderListSignal().map(o => o.id === item.id ? { ...o, status: item.status } : o);
          this.orderListSignal.set(updatedItems);
          console.log(updatedItems);
        },
        error: (error: any) => {
          console.error('Error in updating order status', error);
          /*this.snackBar.open(error.error.description, 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });*/
        }
      });
    } else {
      console.error('Order id or status is undefined');
      /*this.snackBar.open('Order id or status is undefined', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });*/
    }
  }

}
