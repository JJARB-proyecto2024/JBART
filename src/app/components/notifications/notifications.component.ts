import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { INotification, IUser } from '../../interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  public notificationService: NotificationService = inject(NotificationService);
  public userService: UserService = inject(UserService);
  public authService: AuthService = inject(AuthService);
  public user: IUser = {};
  public seenAll: boolean = false;
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    if (this.user.id !== undefined) {
      this.notificationService.getAllByUserId(this.user.id);
    }
  }

  handleNotificationRead(item: INotification) {
    item.seen = true;
    const userBuyer = {
      id: this.user.id
    }
    item.user = userBuyer;
    this.notificationService.update(item);
  }

}
