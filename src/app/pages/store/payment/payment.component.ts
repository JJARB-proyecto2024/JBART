import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest , NgxPayPalModule } from 'ngx-paypal';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterOutlet , NgxPayPalModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  public product: IProduct | null = null;
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public routeAuthorities: string[] = [];
  public router: Router = inject(Router);

  ngOnInit(): void {
    this.product = history.state.product;
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
    this.initConfig();
  }

  private initConfig(): void {
    if(!this.product) {
      console.error('Product not found');
      return;
    }

    const { name, price } = this.product;

    this.payPalConfig = {
      clientId: `${environment.Client_ID}`,
      createOrderOnServer: () => fetch(`${environment.apiUrl}/auth/createPayment`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getAccessToken()?.replace(/"/g, '')}`,
        },
        body: JSON.stringify([
          { name,
            price,
            quantity: 1,
          },
        ])
      })
        .then((res) => res.json())
        .then((order) => {
          console.log('Payment ID:', order.id); // Make sure this displays the payment ID
          return order.token;  // Return the token here
        }),
      authorizeOnServer: async (approveData: any) => {
        return fetch(`${environment.apiUrl}/auth/executePayment`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            payerId: approveData.payerID,
            paymentId: approveData.paymentID,
          })
        }).then((res) => res.json())
          .then((details) => {
            console.log(('Authorization created for ' + details.payer_given_name));
            this.router.navigate(['/app/user-orders']);
          });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
