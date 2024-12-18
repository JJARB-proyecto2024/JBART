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

  public findCarts(id: string | number): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/user/' + id);
  }

  public findAll(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source, { params: { s } });
  }

  public findAllProductsBrand(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source + '/brands', { params: { s } });
  }

  public findByBrand(id: number | undefined): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/brand' + '/' + id);
  }

  public findByCategory(id: number | undefined): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/category' + '/' + id);
  }

  public findProductsLanding(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>('auth/products', { params: { s } });
  }

  public findBrandActive(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source + '/active', { params: { s } });
  }

  public findBrandActiveLanding(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>('auth/brands', { params: { s } });
  }

  public findBrandByNewRequest(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source + '/newRequests', { params: { s } });
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


  public updateStatus(id: number, status: string): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + '/upStatus/' + id, { status });
  }


  public generateOtp(email: string): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source + '/generatePasswordResetOtp', { email }, { responseType: 'text' as 'json' });
  }

  public resetPassword(email: string, otpCode: string, newPassword: string): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source + '/resetPassword', { email, otpCode, newPassword });
  }

  public activateAccount(email: string, otpCode: string): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source + '/resetStatusAccount', { email, otpCode });
  }

  public disableAccount(user: IBuyerUser): Observable<string> {
    return this.http.put<string>(`${this.source}/deactivate`, user, { responseType: 'text' as 'json' });
  }

  public hasRatedBrand(brandId: number | undefined): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/rate/' + brandId);
  }

  public hasRatedProduct(productId: number | undefined): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/rate/' + productId);
  }

  public hasRatedOrder(orderId: number | undefined): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/rate/' + orderId);
  }

  public findOrdersForBrand(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source + '/brand', { params: { s } });
  }

  public findOrdersForUser(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source + '/user', { params: { s } });
  }

}
