import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ICart, INotification, IUser } from '../../../../interfaces';
import { LayoutService } from '../../../../services/layout.service';
import { MyAccountComponent } from '../../../my-account/my-account.component';
import { NotificationsComponent } from "../../../notifications/notifications.component";
import { NotificationService } from '../../../../services/notification.service';
import { CartsComponent } from '../../../carts/carts.component';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MyAccountComponent, NotificationsComponent, CartsComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent implements OnInit {
  public user?: IUser;
  public notifications?: INotification[];
  public carts?: ICart[];
  public isBuyer = false;
  constructor(
    public router: Router,
    public layoutService: LayoutService,
    public authService: AuthService,
    public notificationsService: NotificationService,
    public cartsService: CartService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user?.authorities?.some(auth => auth.authority === 'ROLE_USER')) {
      this.isBuyer = true;
      if (this.user?.id !== undefined) {
        this.cartsService.getAllByUserId(this.user.id);
      }
    }
    this.notifications = this.notificationsService.getAllByUserId(this.user?.id || 0) || [];
  }


  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
