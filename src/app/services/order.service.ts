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

  public getAll(): Observable<any> {
    return this.findAll().pipe(
      tap((response: any) => {
        if (response && response.data) {
          // Extrae la lista de órdenes de la respuesta
          const orders = response.data;
          this.orderListSignal.set(orders);
        }
      }),
      catchError((error: any) => {
        console.error('Error in get all orders request', error);
        this.snackBar.open(error.error?.description || 'An error occurred', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        return of([]); // Devuelve un observable con un array vacío en caso de error
      })
    );
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
