import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { INotification, IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  public notificationService: NotificationService = inject(NotificationService);
  public userService: UserService = inject(UserService);
  public authService: AuthService = inject(AuthService);
  public webSocketService: WebSocketService = inject(WebSocketService);
  public user: IUser = {};
  public seenAll = false;
  @Input() notifications: INotification[] = [];
  public selectedNotification: INotification = {};
  constructor(public router: Router) { }


  ngOnInit(): void {
    this.user = this.authService.getUser() || {};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notifications']) {
      this.handleSeenAll();
    }
  }
  
  handleNotificationRead(item: INotification) {
    this.selectedNotification = item;
    this.selectedNotification.seen = true;
    const userBuyer = {
      id: this.user.id
    }
    this.selectedNotification.user = userBuyer;
    this.notificationService.update(item);
  }
  handleSeenAll() {
    this.seenAll = this.notifications.filter(notification => !notification.seen).length === 0;
  }
}