import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBuyerUser, IOtp, IResponse } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OtpService extends BaseService<IOtp> {
  protected override source: string = 'auth';
  private itemListSignal = signal<IOtp[]>([]);
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

  public generateOtpAndHandle(email: string) {
    this.http.post<IResponse<IOtp>>(`${this.source}/generatePasswordResetOtp`, { email }).subscribe({
      next: (response: IResponse<IOtp>) => {
      },
      error: (error: any) => {
        console.error('Error generando OTP:', error);
        let errorMessage = '';
        if (error && error.status === 403) {
          errorMessage = 'Acceso denegado. No tienes permisos para generar OTP.';
        } else if (error && error.error && error.error.description) {
          errorMessage = error.error.description;
        }
      }
    });
  }

  public resetPasswordOTP(email: string, otpCode: string, newPassword: string) {
    this.http.post<boolean>(`${this.source}/resetPassword`, { email, otpCode, newPassword }).subscribe({
      next: (response: boolean) => {
        if (response === false) {
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudo restablecer la contraseña. Verifica el OTP y el correo electrónico.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        } else {
          // Caso en el que el servidor devuelve true
          Swal.fire({
            title: 'Éxito!',
            text: 'Contraseña restablecida exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          })
        }
      },
      error: (error: any) => {
        console.error('Error restableciendo contraseña:', error);
        let errorMessage = 'Error restableciendo contraseña';
        if (error && error.status === 403) {
          errorMessage = 'Acceso denegado. No tienes permisos para restablecer la contraseña.';
        } else if (error && error.error && error.error.description) {
          errorMessage = error.error.description;
        }
        Swal.fire({
          title: '¡Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    });
  }

  public deleteOtp(otp: IOtp) {
    this.del(otp.id!).subscribe({
      next: () => {
        const updatedOtps = this.itemListSignal().filter(o => o.id !== otp.id);
        this.itemListSignal.set(updatedOtps);
      },
      error: (error: any) => {
        console.error('Error deleting OTP', error);
      }
    });
  }

}