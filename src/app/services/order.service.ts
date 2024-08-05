import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IOrder, IResponse } from '../interfaces';
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
        /*this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });*/
      }
    });
  }

  public getOrderByID(id: number): Observable<any> {
    return this.find(id).pipe(
      tap((response: any) => {
        this.orderSignal.set(response);
      }),
      catchError((error: any) => {
        console.error('Error fetching order by id', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        return throwError(error);
      })
    );
  }
  


  public getOrdersListForBrand(): Observable<any> {
    return this.findOrdersForBrand().pipe(
      tap((response: any) => {
        if (response && response.data) {
          const sortedOrders = response.data; // Ordenar de mayor a menor
          this.orderListSignal.set(sortedOrders);
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching orders for brand', error);
        return of([]); // Devuelve un observable con un array vacío en caso de error
      })
    );
  }

  public getOrdersListForUser(): Observable<any> {
    return this.findOrdersForUser().pipe(
      tap((response: any) => {
        if (response && response.data) {
          const sortedOrders = response.data; // Ordenar de mayor a menor
          this.orderListSignal.set(sortedOrders);
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching orders for brand', error);
        return of([]); // Devuelve un observable con un array vacío en caso de error
      })
    );
  }


  updateStat(item: IOrder): Observable<any> {
    if (item.id !== undefined && item.status !== undefined) {
      return this.updateStatus(item.id, item.status).pipe(
        tap((response: any) => {
          const updatedItems = this.orderListSignal().map(u => u.id === item.id ? { ...u, status: item.status } : u);
          this.orderListSignal.set(updatedItems);
        }),
        catchError((error: any) => {
          console.error('Error in updating order status', error);
          return throwError(error);
        })
      );
    } else {
      console.error('Item id or status is undefined');
      return new Observable<any>();
    }
  }

}
