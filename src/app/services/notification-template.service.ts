import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { INotification, INotificationTemplate } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotificationTemplateService extends BaseService<INotificationTemplate> {
  protected override source: string = 'notificationTemplates';
  private notificationTemplateSignal = signal<INotificationTemplate>({});


  get notificationTemplate() {
    return this.notificationTemplateSignal();
  }

  public getNotificationTemplateById(id: number): INotificationTemplate {
    this.find(id).subscribe({
      next: (response: any) => {
        this.notificationTemplateSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching notification template', error);
      }
    });
    return {} as INotificationTemplate;
  }
}
