import { Component, inject, OnInit } from '@angular/core';
import { BrandUserListComponent } from '../../components/brand-user/brand-user-list/brand-user-list.component';
import { BrandUserFormComponent } from '../../components/brand-user/brand-user-form/brand-user-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { BrandUserService } from '../../services/brand-user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IBrandUser } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-users',
  standalone: true,
  imports: [
    BrandUserListComponent,
    BrandUserFormComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './brand-users.component.html',
  styleUrl: './brand-users.component.scss'
})
export class BrandUsersComponent implements OnInit{
  public brandUserService: BrandUserService = inject(BrandUserService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public routeAuthorities: string[] = [];

  ngOnInit(): void {
    this.brandUserService.getNewRequests();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  handleFormAction(item: IBrandUser) {
    this.brandUserService.save(item);
  }

}
