import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IProduct } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<IProduct> {
  protected override source: string = 'products';
  private itemListSignal = signal<IProduct[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private itemSignal = signal<IProduct>({});


  get items$() {
    return this.itemListSignal;
  }

  get item$() {
    return this.itemSignal;
  }

  public getById(id: number) {
    this.find(id).subscribe({
      next: (response: any) => {
        this.itemSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching order by id', error);
        }
    });
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all products request', error);
      }
    })
  }

  public getAllProductsBrand() {
    this.findAllProductsBrand().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all products request', error);
      }
    })
  }

  public getAllLanding() {
    this.findProductsLanding().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all products request', error);
      }
    })
  }

  public getByBrand(item: number | undefined) {
    this.findByBrand(item).subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all products request', error);
      }
    })
  }

  public getByCategory(item: number | undefined) {
    this.findByCategory(item).subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all products request', error);
      }
    })
  }

  public save(item: IProduct): Observable<any> {
    return this.add(item).pipe(
      tap((response: any) => {
        this.itemListSignal.update((products: IProduct[]) => [response, ...products]);
      }),
      catchError((error: any) => {
        console.error('response', error.description);
        return throwError(error);
      })
    );
  }

  public update(item: IProduct): Observable<any> {
    return this.edit(item.id, item).pipe(
      tap((response: any) => {
        this.itemListSignal.update((products: IProduct[]) => products.map(product => product.id === item.id ? item : product));
      }),
      catchError((error: any) => {
        console.error('response', error.description);
        return throwError(error);
      })
    );
  }

  public delete(item: IProduct) {
    this.del(item.id).subscribe({
      next: () => {
        Swal.fire({
          title: '¿Está seguro?',
          text: '¿Está seguro de que desea eliminar este producto?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.itemListSignal.set(this.itemListSignal().filter(product => product.id != item.id));
          }
        });
      },
      error: (error: any) => {
        console.error('response', error.description);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.description
        })
      }
    })
  }

}
