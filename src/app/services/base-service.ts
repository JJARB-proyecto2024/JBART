import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBuyerUser, IResponse, IUser } from '../interfaces';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  protected source!: string;
  protected findSource!: string;
  protected http = inject(HttpClient);

  public find(id: string | number): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/' + id);
  }

  public findNotifications(id: string | number): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/user/' + id);
  }

  public findAll(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source, { params: { s } });
  }

  public findProfile(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.findSource, { params: { s } });
  }

  public add(data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source, data);
  }

  public edit(id: number | undefined, data: {}): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + '/' + id, data);
  }

  public setNotificationStatus(id: number | undefined, data: {}): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + '/user/' + id, data);
  }

  public editProfile(id: number | undefined, data: {}): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + '/' + id, data);
  }

  public del(id: any): Observable<IResponse<T>> {
    return this.http.delete<IResponse<T>>(this.source + '/' + id);
  }

  // Método para actualizar una entidad usando PUT a una ruta específica
  public updateStatus(id: number, status: string): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + '/upStatus/'+ id, { status });
  }

  // Método especializado para generar OTP usando POST a una ruta específica
  public generateOtp(email: string): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source + '/generatePasswordResetOtp', { email }, { responseType: 'text' as 'json' });
  }

  public resetPassword(email: string, otpCode: string, newPassword: string): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source+  '/resetPassword', { email, otpCode, newPassword });
  }
  
  public disableAccount(user: IBuyerUser): Observable<string> {
    return this.http.put<string>(`${this.source}/deactivate`, user , { responseType: 'text' as 'json' });
  }
}
