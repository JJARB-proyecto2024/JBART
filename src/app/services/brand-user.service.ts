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
  
  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all users brand request', error);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
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

  public save(item: IBrandUser) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.itemListSignal.update((users: IBrandUser[]) => [response, ...users]);
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

  public update(item: IBrandUser) {
      this.add(item).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().map(u => u.id === item.id ? item: u);
        this.itemListSignal.set(updatedItems);
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
  
  public updateStat(item: IBrandUser) {
    if (item.id !== undefined && item.status !== undefined) {
      this.updateStatus(item.id, item.status).subscribe({
        next: (response: any) => {
          const updatedItems = this.itemListSignal().map(u => u.id === item.id ? { ...u, status: item.status } : u);
          this.itemListSignal.set(updatedItems);
          console.log(updatedItems);
        },
        error: (error: any) => {
          console.error('Error in updating brand user status', error);
          this.snackBar.open(error.error.description, 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.error('Item id is undefined');
      this.snackBar.open('Item id is undefined', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  public delete(item: IBrandUser) {
    this.del(item.id).subscribe({
      next: () => {
        this.itemListSignal.set(this.itemListSignal().filter(u => u.id != item.id));
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
}