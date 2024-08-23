import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface IReportProblem {
  id?: number;
  problemArea: string;
  description: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportProblemService {
  private http = inject(HttpClient);
  private itemListSignal = signal<IReportProblem[]>([]);
  private readonly apiUrl = 'reportProblems'; // Base URL for your API

  get items$() {
    return this.itemListSignal;
  }


  public getAll(): void {
    this.http.get<IReportProblem[]>(`${this.apiUrl}`)
      .pipe(catchError((error: any) => this.handleError(error, 'Error al obtener los reportes')))
      .subscribe((response: IReportProblem[]) => {
        response.reverse();
        this.itemListSignal.set(response);
      });
  }


  public createReportProblem(reportProblem: IReportProblem): void {
    this.http.post<IReportProblem>(`${this.apiUrl}/createReportProblem`, reportProblem)
      .pipe(catchError((error: any) => this.handleError(error, 'Error al enviar el reporte de problema')))
      .subscribe(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El reporte ha sido enviado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.getAll(); 
      });
  }


  public deleteReportProblem(reportProblem: IReportProblem): void {
    this.http.delete(`${this.apiUrl}/${reportProblem.id}`)
      .pipe(catchError((error: any) => this.handleError(error, 'Error al eliminar el reporte de problema')))
      .subscribe(() => {
        const updatedReports = this.itemListSignal().filter(r => r.id !== reportProblem.id);
        this.itemListSignal.set(updatedReports);
        Swal.fire({
          title: '¡Éxito!',
          text: 'El reporte ha sido eliminado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      });
  }

  private handleError(error: any, customMessage: string): Observable<never> {
    console.error(customMessage, error);
    let errorMessage = 'Ha ocurrido un error inesperado.';
    if (error && error.error && error.error.description) {
      errorMessage = error.error.description;
    }
    Swal.fire({
      title: '¡Error!',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    throw error;
  }
}