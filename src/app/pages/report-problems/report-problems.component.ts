import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReportProblemService } from '../../services/report-problem.service';

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problems.component.html',
  styleUrls: ['./report-problems.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule] // Importar ReactiveFormsModule aquí
})
export class ReportProblemsComponent implements OnInit {
  reportProblemForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reportProblemService: ReportProblemService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.reportProblemForm = this.fb.group({
      problemArea: ['', Validators.required],
      description: ['', Validators.required],
      status: ['alta', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.reportProblemForm.invalid) {
      this.showErrorAlert('Por favor, completa todos los campos.');
      return;
    }

    const formData = this.reportProblemForm.value;

    try {
      await this.reportProblemService.createReportProblem(formData);
      Swal.fire({
        title: '¡Éxito!',
        text: 'El reporte ha sido enviado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.reportProblemForm.reset(); // Limpia el formulario después de enviarlo
    } catch (error) {
      console.error('Error enviando el reporte de problema:', error);
      this.showErrorAlert('Hubo un error al enviar el reporte. Inténtalo nuevamente.');
    }
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: '¡Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }
}
