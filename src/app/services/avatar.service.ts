import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IAvatar } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class AvatarService extends BaseService<IAvatar> {
  protected override source: string = 'avatares';
  private itemListSignal = signal<IAvatar[]>([]);
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
        console.error('Error fetching avatar', error);
      }
    })
  }

  public getByUserBuyer(): Observable<any> {
    return this.http.get<IAvatar>(`${this.source}/AvatarByUser`).pipe(
      tap((response: any) => {
        this.itemListSignal.set([response]);
      }),
      catchError((error: any) => {
        console.error('Error fetching avatar', error);
        return throwError(error);
      })
    );
  }


  save(item: IAvatar): Observable<any>{
    return this.add(item).pipe(
      tap((response: any) => {
        this.itemListSignal.update( items => [response, ...items]);
      }),
      catchError(error => {
        console.error('Error saving avatar', error);
        return throwError(error);
      })
    );
  }

  delete(id: number): Observable<any>{
    return this.del(id).pipe(
      tap((response: any) => {
        const updateItems = this.itemListSignal().filter(u => u.id !== id);
        this.itemListSignal.set(updateItems);
      }),
      catchError(error => {
        console.error('Error saving avatar', error);
        return throwError(error);
      })
    );
  }
}