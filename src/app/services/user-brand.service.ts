import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBrandUser } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserBrandService extends BaseService<IBrandUser> {
  protected override source: string = 'userBrand';
  private itemListSignal = signal<IBrandUser[]>([]);

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
