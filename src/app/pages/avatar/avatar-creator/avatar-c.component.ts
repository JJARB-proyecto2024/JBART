import { Component, inject, OnInit } from '@angular/core';
import { AvatarCreatorComponent } from '../../../components/avatar/avatar-creator/avatar-creator.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-c',
  standalone: true,
  imports: [
    AvatarCreatorComponent,
    CommonModule
  ],
  templateUrl: './avatar-c.component.html',
  styleUrls: ['./avatar-c.component.scss']
})
export class AvatarCComponent {
  
}
