import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRateBrand } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RateBrandService extends BaseService<IRateBrand> {
  protected override source: string = 'ratesBrand';
  private itemListSignal = signal<IRateBrand[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get items$() {
    return this.itemListSignal;
  }

  save1(item: IRateBrand): Observable<any>{
    return this.add(item).pipe(
      tap((response: any) => {
        this.itemListSignal.update( items => [response, ...items]);
      }),
      catchError(error => {
        console.error('Error saving rate brand', error);
        return throwError(error);
      })
    );
  }

  save(item: IRateBrand): Observable<any> {
    return this.add(item).pipe(
      tap((response: any) => {
        const currentRates = this.itemListSignal();
        if (Array.isArray(currentRates)) {
          this.itemListSignal.update((ratesBrand: IRateBrand[]) => [response, ...ratesBrand]);
        } else {
          this.itemListSignal.update(() => [response]);
        }
      }),
      catchError((error: any) => {
        console.error('Error saving rate brand', error);
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
        console.error('Error fetching rates brand', error);
      }
    })
  }

  getHasRatedBrand(brandId: number | undefined): Observable<any>{
    return this.hasRatedBrand(brandId).pipe(
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