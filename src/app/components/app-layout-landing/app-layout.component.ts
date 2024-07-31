import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../services/layout.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SvgIconComponent,
    RouterLink
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutLandingComponent {
  public title?: string;

  constructor(public layoutService: LayoutService, private router: Router,) {
    this.layoutService.title.subscribe((title) => (this.title = title));
  }

  login() {
    this.router.navigateByUrl('login')
  }

  registrer() {
    this.router.navigateByUrl('login')
  }

  landingProduct() {
    this.router.navigateByUrl('landingProduct')
  }

  landingTeam() {
    this.router.navigateByUrl('landingTeam')
  }
}
