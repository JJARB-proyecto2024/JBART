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
  private orderSignal = signal<IOrder>({});
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get orders() {
    return this.orderListSignal();
  }

  get order() {
    return this.orderSignal();
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

  public getOrderByID(id: number) {
    this.find(id).subscribe({
      next: (response: any) => {
        this.orderSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching order by id', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
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
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
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
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        return of([]); // Devuelve un observable con un array vacío en caso de error
      })
    );
  }

}
