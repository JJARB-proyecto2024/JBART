import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService<ICategory> {
  protected override source: string = 'categories';
  private itemListSignal = signal<ICategory[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  
  get items$() {
    return this.itemListSignal;
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);
      }
    })
  }

  save(item: ICategory): Observable<any>{
    return this.add(item).pipe(
      tap((response: any) => {
        this.itemListSignal.update( items => [response, ...items]);
      }),
      catchError(error => {
        console.error('Error saving category', error);
        return throwError(error);
      })
    );
  }

  update(item: ICategory): Observable<any>{
    return this.edit(item.id, item).pipe(
      tap((response: any) => {
        const updateItems = this.itemListSignal().map(u => u.id === item.id ? response : u);
        this.itemListSignal.set(updateItems);
      }),
      catchError(error => {
        console.error('Error saving category', error);
        return throwError(error);
      })
    );
  }

  delete(item: ICategory): Observable<any>{
    return this.del(item.id).pipe(
      tap((response: any) => {
        const updateItems = this.itemListSignal().filter(u => u.id !== item.id);
        this.itemListSignal.set(updateItems);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }
}