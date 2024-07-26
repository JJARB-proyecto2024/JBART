import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { INotification, IUser } from '../../interfaces';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  public notificationService: NotificationService = inject(NotificationService);
  public userService: UserService = inject(UserService);
  public authService: AuthService = inject(AuthService);
  public user: IUser = {};

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    if (this.user.id !== undefined) {
      this.notificationService.getAllByUserId(this.user.id);
    }
    this.notificationService.notifications$();
    console.log("user: ", this.user);
  }

}
