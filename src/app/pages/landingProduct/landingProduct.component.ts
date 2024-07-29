import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './landingProduct.component.html',
  styleUrl: './landingProduct.component.scss'
})
export class LandingProductComponent {
  
}
