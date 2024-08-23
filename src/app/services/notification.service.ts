import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INotification } from '../interfaces';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService<INotification> {
  protected override source: string = 'notifications';
  protected notificationListSignal = signal<INotification[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  public webSocketService: WebSocketService = inject(WebSocketService);
  get notifications$() {
    return this.notificationListSignal;
  }

  public createWebSocket(user: any) {
    this.webSocketService.createWebSocket(user);
  }

  public connectWebSocket() {
    this.webSocketService.connect().subscribe(
      (message) => {
        const notification: INotification = JSON.parse(message);
        this.notificationListSignal.update((notifications: INotification[]) => [notification, ...notifications]);
        console.log('Connected web socket:', message);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public disconnectWebSocket() {
    this.webSocketService.disconnect();
    console.log('Disconnected web socket');
  }

  public getAllByUserId(id: number): INotification[] {
    this.findNotifications(id).subscribe({
      next: (response: any) => {
        response.reverse();
        this.notificationListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching notifications', error);
      }
    });
    return []; 
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.notificationListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all notifications request', error);
        this.snackBar.open(error.error.description, 'Close', {
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
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

  public update(item: INotification) {
    console.log('item', item);
    this.setNotificationStatus(item.id, item).subscribe({
      next: () => {
        const updatedItems = this.notificationListSignal().map(notification => notification.id === item.id ? item : notification);
        this.notificationListSignal.set(updatedItems);
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.snackBar.open(error.error.description, 'Close', {
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
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

}
