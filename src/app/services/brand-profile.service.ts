import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBrandUser } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class BrandProfileService extends BaseService<IBrandUser>{
  protected override  source: string = 'users';
  private userBrandSignal = signal<IBrandUser>({});

  get user$ () {
    return this.userBrandSignal
  }

  getUserProfileInfo() {
    this.findAll().subscribe({
      next: (response: any) => {
        console.log('response', response);
        this.userBrandSignal.set(response);
      }
    });
  }
}
