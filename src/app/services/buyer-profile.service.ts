import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject, Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class BuyerProfileService extends BaseService<IUser> {
  protected override  source: string = 'usersBuyer';
  protected override findSource: string = 'usersBuyer/me';
  private userSignal = signal<IUser>({});
  private snackBar: MatSnackBar = inject(MatSnackBar);
  get user$() {
    return this.userSignal
  }

  getUserProfileInfo() {
    this.findProfile().subscribe({
      next: (response: any) => {
        console.log('response', response);
        this.userSignal.set(response);
      }
    });
  }
  updateUserProfileInfo(user: IUser) {
    this.editProfile(user.id, user).subscribe({
      next: (response: any) => {
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
          duration: 2000
        });
        this.userSignal.set(response);
      },
      error: (error: any) => {
        this.snackBar.open('Error al actualizar perfil', 'Cerrar', {
          duration: 2000
        });
        throwError(error);
      }
    });
  }
}