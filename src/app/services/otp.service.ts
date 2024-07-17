import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBuyerUser, IOtp, IResponse } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

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

  // Método personalizado para generar OTP y manejar suscripción
  public generateOtpAndHandle(email: string) {
    this.http.post<IResponse<IOtp>>(`${this.source}/generatePasswordResetOtp`, { email }).subscribe({
      next: (response: IResponse<IOtp>) => {
        this.snackBar.open('OTP generado exitosamente y enviado', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (error: any) => {
        console.error('Error generando OTP:', error);
        let errorMessage = '';
        if (error && error.status === 403) {
          errorMessage = 'Acceso denegado. No tienes permisos para generar OTP.';
        } else if (error && error.error && error.error.description) {
          errorMessage = error.error.description;
        }
        this.snackBar.open(errorMessage, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }


  public resetPasswordOTP(email: string, otpCode: string, newPassword: string) {
    this.http.post<any>(`${this.source}/resetPassword`, { email, otpCode, newPassword }).subscribe({
      next: (response: any) => {
        this.snackBar.open('Contraseña restablecida exitosamente', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (error: any) => {
        console.error('Error resetting password', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  public deleteOtp(otp: IOtp) {
    this.del(otp.id!).subscribe({
      next: () => {
        const updatedOtps = this.itemListSignal().filter(o => o.id !== otp.id);
        this.itemListSignal.set(updatedOtps);
        this.snackBar.open('OTP eliminado exitosamente', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      error: (error: any) => {
        console.error('Error deleting OTP', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

}