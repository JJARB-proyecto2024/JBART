import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'change-rating',
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
    @Input() rating: number = 0; 
    @Input() min: number = 0;    
    @Input() max: number = 5;    
    @Input() readonly: boolean = false; 
    @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();
  
    stars: number[] = [];  
  
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