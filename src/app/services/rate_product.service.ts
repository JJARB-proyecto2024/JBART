import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRateBrand, IRateProduct } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RateProductService extends BaseService<IRateProduct> {
  protected override source: string = 'ratesProduct';
  private itemListSignal = signal<IRateProduct[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get items$() {
    return this.itemListSignal;
  }

  save1(item: IRateProduct): Observable<any>{
    return this.add(item).pipe(
      tap((response: any) => {
        this.itemListSignal.update( items => [response, ...items]);
      }),
      catchError(error => {
        console.error('Error saving rate product', error);
        return throwError(error);
      })
    );
  }

  save(item: IRateProduct): Observable<any> {
    return this.add(item).pipe(
      tap((response: any) => {
        const currentRates = this.itemListSignal();
        if (Array.isArray(currentRates)) {
          this.itemListSignal.update((ratesProduct: IRateProduct[]) => [response, ...ratesProduct]);
        } else {
          this.itemListSignal.update(() => [response]);
        }
      }),
      catchError((error: any) => {
        console.error('Error saving rate product', error);
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
        console.error('Error fetching rates product', error);
      }
    })
  }

  getHasRatedProduct(productId: number | undefined): Observable<any>{
    return this.hasRatedProduct(productId).pipe(
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