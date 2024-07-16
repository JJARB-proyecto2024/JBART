import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class BuyerProfileService extends BaseService<IUser> {
  protected override  source: string = 'usersBuyer/2';
  private userSignal = signal<IUser>({});
  private userListSignal = signal<IUser[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  get user$() {
    return this.userSignal
  }

  getUserProfileInfo() {
    this.findAll().subscribe({
      next: (response: any) => {
        console.log('response', response);
        this.userSignal.set(response);
      }
    });
  }

}
