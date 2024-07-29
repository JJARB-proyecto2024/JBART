import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BackgroundParticlesModule } from '../../components/background-particles/background-particles.module';
import { AppLayoutLandingComponent } from '../../components/app-layout-landing/app-layout.component';
import { SvgWaveModule } from '../../components/svg-wave/svg-wave.module';

@Component({
  selector: 'app-landing-team',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BackgroundParticlesModule,
    AppLayoutLandingComponent,
    SvgWaveModule
  ],
  templateUrl: './landingTeam.component.html',
  styleUrl: './landingTeam.component.scss'
})
export class LandingTeamComponent {
  constructor(
    private router: Router, 
  ) {}

  public handleLogin(event: Event) {
    event.preventDefault();
  }

  login() {
    this.router.navigateByUrl('login')
  }
}
