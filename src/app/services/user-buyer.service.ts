import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBuyerUser } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserBuyerService extends BaseService<IBuyerUser> {
  protected override source: string = 'usersBuyer';
  private itemListSignal = signal<IBuyerUser[]>([]);

  get items$() {
    return this.itemListSignal;
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.itemListSignal.set(response);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}
