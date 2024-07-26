import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { INotification, IUser } from '../../../../interfaces';
import { LayoutService } from '../../../../services/layout.service';
import { MyAccountComponent } from '../../../my-account/my-account.component';
import { NotificationsComponent } from "../../../notifications/notifications.component";
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MyAccountComponent, NotificationsComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent implements OnInit {
  public user?: IUser;
  public notifications?: INotification[];
  constructor(
    public router: Router,
    public layoutService: LayoutService,
    public authService: AuthService,
    public notificationsService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.notifications = this.notificationsService.getAllByUserId(this.user?.id || 0) || [];
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
