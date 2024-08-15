import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IChatbot, IResponse } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService extends BaseService<IChatbot> {
  protected override source: string = 'chatbot';
  private itemListSignal = signal<IChatbot[]>([]);
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
        console.error('Error fetching categories', error);
      }
    })
  }

  save(item: IChatbot): Observable<any>{
    return this.add(item).pipe(
      tap((response: any) => {
        this.itemListSignal.update( items => [response, ...items]);
      }),
      catchError(error => {
        console.error('Error saving category', error);
        return throwError(error);
      })
    );
  }

  update(item: IChatbot): Observable<any>{
    return this.edit(item.id, item).pipe(
      tap((response: any) => {
        const updateItems = this.itemListSignal().map(u => u.id === item.id ? response : u);
        this.itemListSignal.set(updateItems);
      }),
      catchError(error => {
        console.error('Error saving category', error);
        return throwError(error);
      })
    );
  }

  delete(item: IChatbot): Observable<any>{
    return this.del(item.id).pipe(
      tap((response: any) => {
        const updateItems = this.itemListSignal().filter(u => u.id !== item.id);
        this.itemListSignal.set(updateItems);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }
}