import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    selector: 'igc-rating',
    standalone: true,
    imports: [
      CommonModule, 
      FormsModule,
      ModalComponent,
      MatSnackBarModule
    ],
    templateUrl: './star-rating.component.html',
    styleUrls: ['./star-rating.component.scss'],
    providers: [DatePipe]
  })

  export class StarRatingComponent {
    @Input() rating: number = 0; // Calificación actual
    @Input() min: number = 0;    // Valor mínimo
    @Input() max: number = 5;    // Valor máximo
    @Input() readonly: boolean = false; // Modo solo lectura
    @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();
  
    stars: number[] = [];  // Array para almacenar estrellas
  
    ngOnInit() {
      this.stars = Array(this.max).fill(0).map((_, i) => i + 1);
    }
  
    onClick(star: number) {
      if (!this.readonly) {
        this.rating = star;
        this.ratingChange.emit(this.rating);
      }
    }
  
    onMouseOver(star: number) {
      if (!this.readonly) {
        this.rating = star;
      }
    }
  
    onMouseOut() {
      if (!this.readonly) {
      }
    }
  }