import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SVG } from '@svgdotjs/svg.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avatar-creator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './avatar-creator.component.html',
  styleUrls: ['./avatar-creator.component.scss']
})
export class AvatarCreatorComponent {
  // Opciones para las partes del avatar
  headOptions: string[] = ['Colochos1.svg', 'Colochos2.svg', 'Rubia1.svg', 'Rubia2.svg', 'Rubia3.svg','DoraNegro1.svg', 'DoraNegro2.svg', 'DoraNegro3.svg'];
  bodyOptions: string[] = ['Dress.svg', 'Device.svg'];
  faceOptions: string[] = ['Cute.svg', 'Driven.svg'];
  facialHairOptions: string[] = ['Chin.svg', 'Full.svg'];
  accessoriesOptions: string[] = ['Eyepatch.svg', 'Glasses.svg'];

  // Opciones para las poses
  standingPoseOptions: string[] = ['blazer-1.svg', 'blazer-2.svg'];
  sittingPoseOptions: string[] = ['bike.svg', 'mid-1.svg'];

  // Paths to the SVG images
  headSvgPath = 'assets/avatar/head/';
  bodySvgPath = 'assets/avatar/body/';
  faceSvgPath = 'assets/avatar/face/';
  facialHairSvgPath = 'assets/avatar/facialHair/';
  accessoriesSvgPath = 'assets/avatar/accessories/';
  poseSvgPath = 'assets/avatar/pose/';

  // Subdirectories for pose
  poseStandingPath = 'standing/';
  poseSittingPath = 'sitting/';

  // Selected values
  selectedHead: string = '';
  selectedBody: string = '';
  selectedFace: string = '';
  selectedFacialHair: string = '';
  selectedAccessories: string = '';
  selectedPose: string = ''; // Tracks the selected pose
  selectedPoseType: 'standing' | 'sitting' = 'standing'; // Tracks pose type

  // Method to update the avatar part based on user input
  updateAvatarPart(value: string, part: string): void {
    switch (part) {
      case 'head':
        this.selectedHead = value;
        break;
      case 'body':
        this.selectedBody = value;
        break;
      case 'face':
        this.selectedFace = value;
        break;
      case 'facialHair':
        this.selectedFacialHair = value;
        break;
      case 'accessories':
        this.selectedAccessories = value;
        break;
    }
  }

  // Method to update the avatar pose based on user input
  updatePose(value: string): void {
    this.selectedPose = value;
  }

  // Method to update pose type (standing/sitting)
  updatePoseType(value: 'standing' | 'sitting'): void {
    this.selectedPoseType = value;
  }
}