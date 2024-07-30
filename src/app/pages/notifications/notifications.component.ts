import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { INotification, IUser } from '../../interfaces';
import { NotificationListComponent } from "../../components/notification-list/notification-list.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NotificationListComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  public notificationsService: NotificationService = inject(NotificationService);
  public authService: AuthService = inject(AuthService);

  public user?: IUser = {};
  ngOnInit() {
    this.user = this.authService.getUser();
    this.notificationsService.getAllByUserId(this.user?.id || 0) || [];
  }
}
