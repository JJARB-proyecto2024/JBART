import { Component, inject, OnInit } from '@angular/core';
import { EarningsListComponent } from '../../components/earnings/earnings-list/earnings-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { EarningsService } from '../../services/earnings.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [EarningsListComponent, LoaderComponent, CommonModule, ModalComponent],
  templateUrl: './earnings.component.html',
  styleUrl: './earnings.component.scss'
})
export class EarningsComponent implements OnInit{
  public earningsService: EarningsService = inject(EarningsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);
  private routeAuthorities: string[] = [];
  public areActionsAvailable: boolean = false;

  ngOnInit(): void {
      this.earningsService.getAll();
      this.route.data.subscribe( data => {
        this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities)
      });
  }

}
