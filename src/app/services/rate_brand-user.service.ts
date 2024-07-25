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
  
  public save(item: IRateBrand) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.itemListSignal.update((ratesBrand: IRateBrand[]) => [response, ...ratesBrand]);
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }
  
  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all rates brand request', error);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

  /*public getHasRatedBrand(brandId: number | undefined) {
    this.hasRatedBrand(brandId).subscribe({
      next: (response: number) => {
        console.log("Resultado: "+ response)
        if (response == 1) {
          // Si el usuario ya ha calificado
          Swal.fire({
            title: 'Rating Error',
            text: 'You have already rated this brand.',
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: '#FF5733'
          });
        } 
      }
    });
  }*/

  /*public getHasRatedBrand(brandId: number | undefined) {
    this.hasRatedBrand(brandId).subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all rates brand request', error);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }*/

  public getHasRatedBrand(brandId: number | undefined) {
    this.hasRatedBrand(brandId).subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all rates brand request', error);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }
  
}