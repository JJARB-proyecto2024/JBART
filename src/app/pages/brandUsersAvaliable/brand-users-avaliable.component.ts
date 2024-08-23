import { Component, inject, OnInit } from '@angular/core';
import { BrandUserAvaliableListComponent } from '../../components/brand-user/brand-user-list-avaliable/brand-user-avaliable-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { BrandUserService } from '../../services/brand-user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-users-avaliable',
  standalone: true,
  imports: [
    BrandUserAvaliableListComponent,
    CommonModule,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './brand-users-avaliable.component.html',
  styleUrl: './brand-users-avaliable.component.scss'
})
export class BrandUsersAvaliableComponent implements OnInit{
  public brandUserService: BrandUserService = inject(BrandUserService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public routeAuthorities: string[] = [];

  ngOnInit(): void {
    this.brandUserService.getActive();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }
}
