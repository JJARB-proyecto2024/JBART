import { Injectable, signal, inject } from '@angular/core';
import { BaseService } from './base-service';
import { IBrandUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class BrandProfileService extends BaseService<IBrandUser>{
  protected override  source: string = 'usersBrand';
  protected override findSource: string = 'usersBrand/me';
  private userBrandSignal = signal<IBrandUser>({});
  private snackBar: MatSnackBar = inject(MatSnackBar);
  get user$ () {
    return this.userBrandSignal
  }

  getUserProfileInfo() {
    this.findProfile().subscribe({
      next: (response: any) => {
        console.log('response', response);
        this.userBrandSignal.set(response);
      }
    });
  }

  updateUserProfileInfo(user: IBrandUser) {
    this.editProfile(user.id, user).subscribe({
      next: (response: any) => {
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 2000
        });
        this.userBrandSignal.set(response);
      },
      error: (error: any) => {
        this.snackBar.open('Profile update failed', 'Close', {
          duration: 2000
        });
        throwError(error);
      }
    });
  }


}
