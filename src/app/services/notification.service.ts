import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INotification } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService<INotification> {
  protected override source: string = 'notifications';
  protected notificationListSignal = signal<INotification[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get notifications$() {
    return this.notificationListSignal;
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.notificationListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all notifications request', error);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }
  
  public save(item: INotification) {
    this.add(item).subscribe({
      next: (response: any) => {
        this.notificationListSignal.update((notifications: INotification[]) => [response, ...notifications]);
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
  
  public update(item: INotification) {
    this.add(item).subscribe({
      next: () => {
        const updatedItems = this.notificationListSignal().map(notification => notification.id === item.id ? item: notification);
        this.notificationListSignal.set(updatedItems);
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


  public delete(item: INotification) {
    this.del(item.id).subscribe({
      next: () => {
        this.notificationListSignal.set(this.notificationListSignal().filter(notification => notification.id != item.id));
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
