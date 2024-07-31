import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackgroundParticlesModule } from '../../components/background-particles/background-particles.module';
import { AppLayoutLandingComponent } from '../../components/app-layout-landing/app-layout.component';
import { SvgWaveModule } from '../../components/svg-wave/svg-wave.module';
import { BrandUserService } from '../../services/brand-user.service';
import { AuthService } from '../../services/auth.service';
import { IBrandUser } from '../../interfaces';
import { ProductService } from '../../services/product.service';
import { BrandUserAvaliableListComponentLanding } from '../../components/brand-user/brand-user-list-avaliable-landing/brand-user-avaliable-list-landing.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ProductlandingComponent } from '../../components/products-recomended/product-landing/product-landing.component';

@Component({
  selector: 'app-landing-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BackgroundParticlesModule,
    AppLayoutLandingComponent,
    SvgWaveModule,
    LoaderComponent,
    ProductlandingComponent,
    BrandUserAvaliableListComponentLanding
  ],
  templateUrl: './landingProduct.component.html',
  styleUrl: './landingProduct.component.scss'
})
export class LandingProductComponent implements OnInit {
  public brandUserService: BrandUserService = inject(BrandUserService);
  public productService: ProductService = inject(ProductService);
  public brandUsers: IBrandUser[] = [];

  ngOnInit(): void {
    this.brandUserService.getActiveLanding();
    this.productService.getAllLanding();
  }
}