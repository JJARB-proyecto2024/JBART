import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBrandUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class BrandUserService extends BaseService<IBrandUser> {
  protected override source: string = 'usersBrand';
  private itemListSignal = signal<IBrandUser[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get items$() {
    return this.itemListSignal;
  }
  
  public getActive() {
    this.findBrandActive().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get active users brand request', error);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

  public getNewRequests() {
    this.findBrandByNewRequest().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get new requests users brand request', error);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }
  
  save(user: IBrandUser): Observable<any>{
    return this.add(user).pipe(
      tap((response: any) => {
        this.itemListSignal.update( users => [response, ...users]);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }

  update(user: IBrandUser): Observable<any>{
    return this.edit(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.itemListSignal().map(u => u.id === user.id ? response : u);
        this.itemListSignal.set(updatedUsers);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }
  
  updateStat(item: IBrandUser): Observable<any> {
    if (item.id !== undefined && item.status !== undefined) {
      return this.updateStatus(item.id, item.status).pipe(
        tap((response: any) => {
          const updatedItems = this.itemListSignal().map(u => u.id === item.id ? { ...u, status: item.status } : u);
          this.itemListSignal.set(updatedItems);
        }),
        catchError((error: any) => {
          console.error('Error in updating brand user status', error);
          return throwError(error);
        })
      );
    } else {
      console.error('Item id or status is undefined');
      return throwError('Item id or status is undefined');
    }
  }

  delete(user: IBrandUser): Observable<any>{
    return this.del(user.id).pipe(
      tap((response: any) => {
        const updatedUsers = this.itemListSignal().filter(u => u.id !== user.id);
        this.itemListSignal.set(updatedUsers);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }
}