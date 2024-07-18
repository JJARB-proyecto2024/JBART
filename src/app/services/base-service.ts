import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBuyerUser, IResponse, IUser } from '../interfaces';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  protected source!: string;
  protected http = inject(HttpClient);

  public find(id: string | number): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + '/' + id);
  }

  public findAll(s: string = ''): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source, { params: { s } });
  }

  public add(data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source, data);
  }

  public edit(id: number | undefined, data: {}): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + '/' + id, data);
  }

  public del(id: any): Observable<IResponse<T>> {
    return this.http.delete<IResponse<T>>(this.source + '/' + id);
  }

  // Método para actualizar una entidad usando PUT a una ruta específica
  public updateStatus(id: number, status: string): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + '/upStatus/'+ id, { status });
  }

  public disableAccount(user: IBuyerUser): Observable<string> {
    return this.http.put<string>(`${this.source}/deactivate`, user , { responseType: 'text' as 'json' });
  }  
}
