import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest , NgxPayPalModule } from 'ngx-paypal';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterOutlet , NgxPayPalModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      clientId: `${environment.Client_ID}`,
      createOrderOnServer: () => fetch(`${environment.apiUrl}/auth/createPayment`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          { name: 'Shoe', price: 18, quantity: 2 },
          { name: 'Jacket', price: 12, quantity: 1 }
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
