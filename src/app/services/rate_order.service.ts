import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRateBrand, IRateOrder } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RateOrderService extends BaseService<IRateOrder> {
  protected override source: string = 'ratesOrder';
  private itemListSignal = signal<IRateOrder[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get items$() {
    return this.itemListSignal;
  }

  save1(item: IRateOrder): Observable<any>{
    return this.add(item).pipe(
      tap((response: any) => {
        this.itemListSignal.update( items => [response, ...items]);
      }),
      catchError(error => {
        console.error('Error saving rate order', error);
        return throwError(error);
      })
    );
  }

  save(item: IRateOrder): Observable<any> {
    return this.add(item).pipe(
      tap((response: any) => {
        const currentRates = this.itemListSignal();
        if (Array.isArray(currentRates)) {
          this.itemListSignal.update((ratesOrder: IRateOrder[]) => [response, ...ratesOrder]);
        } else {
          this.itemListSignal.update(() => [response]);
        }
      }),
      catchError((error: any) => {
        console.error('Error saving rate order', error);
        return throwError(error);
      })
    );
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching rates order', error);
      }
    })
  }

  getHasRatedOrder(orderId: number | undefined): Observable<any>{
    return this.hasRatedOrder(orderId).pipe(
      tap((response: any) => {
        this.itemListSignal.set(response);
      }),
      catchError(error => {
        console.error('Error get rate', error);
        return throwError(error);
      })
    );
  }
  
}