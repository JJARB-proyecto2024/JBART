import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IDesign } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignService extends BaseService<IDesign> {
  protected override source: string = 'designs';
  private itemListSignal = signal<IDesign[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private itemSignal = signal<IDesign>({});

  public getById(id: number) {
    this.find(id).subscribe({
      next: (response: any) => {
        this.itemSignal.set(response);
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

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all products request', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

  public save(item: IDesign): Observable<any> {
    return this.add(item).pipe(
      tap((response: any) => {
        this.itemListSignal.update((designs: IDesign[]) => [response, ...designs]);
      }),
      catchError((error: any) => {
        console.error('response', error.description);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        return throwError(error);
      })
    );
  }
}
