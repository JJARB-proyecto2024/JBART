import { Injectable, signal, inject } from '@angular/core';
import { BaseService } from './base-service';
import { IBrandUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
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
        Swal.fire({
          title: 'Perfil actualizado',
          text: 'El perfil se ha actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#3085d6'
        })
        this.userBrandSignal.set(response);
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