import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { StarRatingComponent } from "../../components/star-rating/star-rating.component";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

}
