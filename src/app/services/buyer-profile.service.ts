import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject, Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class BuyerProfileService extends BaseService<IUser> {
  protected override  source: string = 'usersBuyer';
  protected override findSource: string = 'usersBuyer/me';
  private userSignal = signal<IUser>({});
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
        Swal.fire({
          title: 'Perfil actualizado',
          text: 'El perfil se ha actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#3085d6'
        })
        this.userSignal.set(response);
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.description
        })
      }
    });
  }
}