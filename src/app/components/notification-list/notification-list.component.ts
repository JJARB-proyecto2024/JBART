import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { INotification } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent implements OnChanges {
  public notificationService: NotificationService = inject(NotificationService);
  @Input() notifications: INotification[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notifications']) {
      console.log('notifications', this.notifications);
    }
  }
  deleteNotification(item: INotification) {
    this.notificationService.delete(item);
  }
}
