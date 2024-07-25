import { Component, inject, OnInit } from '@angular/core';
import { MostSoldProductsListComponent } from '../../components/sales/most-sold-products-list/most-sold-products-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { SalesService } from '../../services/sales.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [MostSoldProductsListComponent, LoaderComponent, CommonModule, ModalComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit{
  public salesService: SalesService = inject(SalesService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);
  private routeAuthorities: string[] = [];
  public areActionsAvailable: boolean = false;

  ngOnInit(): void {
      this.salesService.getAll();
      this.route.data.subscribe( data => {
        this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
      })
  }

}
