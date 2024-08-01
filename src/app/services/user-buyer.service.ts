import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBuyerUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserBuyerService extends BaseService<IBuyerUser> {
  protected override source: string = 'usersBuyer';
  private itemListSignal = signal<IBuyerUser[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

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

  public disableAcct(item: IBuyerUser): Observable<string> {
    if (item.id !== undefined && item.password !== undefined) {
      return this.disableAccount(item);
    } else {
      throw new Error('User id or password is undefined');
    }
  }
}
