
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SVG } from '@svgdotjs/svg.js';
import { FormsModule } from '@angular/forms';
import { IAvatar } from '../../../interfaces';
import { AvatarService } from '../../../services/avatar.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  public avatarService: AvatarService = inject(AvatarService);
  constructor(private router: Router) {}

  // Opciones para las partes del avatar
  headOptions: string[] = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg','6.svg', '7.svg', '8.svg', '9.svg', '10.svg', '11.svg', '12.svg','13.svg', '14.svg', '15.svg', '16.svg', '17.svg', '18.svg', '19.svg','20.svg', '21.svg', '22.svg', '23.svg', '24.svg', '25.svg', '26.svg','27.svg', '28.svg', '29.svg', '30.svg', '31.svg', '32.svg', '33.svg','34.svg', '35.svg', '36.svg', '37.svg', '38.svg', '39.svg', '40.svg','41.svg', '42.svg', '43.svg', '44.svg', '45.svg', '46.svg', '47.svg','48.svg', '49.svg', '50.svg', '51.svg'];
  facialHairOptions: string[] = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg','6.svg', '7.svg', '8.svg', '9.svg', '10.svg', '11.svg', '12.svg','13.svg', '14.svg', '15.svg', '16.svg'];
  faceOptions: string[] = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg','6.svg', '7.svg', '8.svg', '9.svg', '10.svg', '11.svg', '12.svg','13.svg', '14.svg', '15.svg', '16.svg', '17.svg', '18.svg', '19.svg','20.svg', '21.svg', '22.svg', '23.svg', '24.svg', '25.svg', '26.svg','27.svg', '28.svg', '29.svg', '30.svg'];
  accessoriesOptions: string[] = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg','6.svg', '7.svg', '8.svg'];
  poseOptions: string[] = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg','6.svg', '7.svg', '8.svg', '9.svg', '10.svg', '11.svg', '12.svg','13.svg', '14.svg', '15.svg', '16.svg', '17.svg', '18.svg', '19.svg','20.svg', '21.svg', '22.svg', '23.svg', '24.svg', '25.svg', '26.svg','27.svg', '28.svg', '29.svg', '30.svg', '31.svg', '32.svg', '33.svg','34.svg', '35.svg', '36.svg', '37.svg', '38.svg', '39.svg', '40.svg','41.svg', '42.svg', '43.svg', '44.svg', '45.svg', '46.svg', '47.svg','48.svg', '49.svg', '50.svg', '51.svg', '52.svg', '53.svg', '54.svg','55.svg', '56.svg', '57.svg', '58.svg', '59.svg', '60.svg', '61.svg','62.svg', '63.svg', '64.svg', '65.svg', '66.svg','67.svg', '68.svg', '69.svg', '70.svg','71.svg', '72.svg', '73.svg', '74.svg'];

  // Paths to the SVG images
  headSvgPath = 'assets/avatar/head/';
  faceSvgPath = 'assets/avatar/face/';
  facialHairSvgPath = 'assets/avatar/facialHair/';
  accessoriesSvgPath = 'assets/avatar/accessories/';
  poseSvgPath = 'assets/avatar/pose/';

  // Selected values
  selectedHead: string = '';
  selectedFace: string = '';
  selectedFacialHair: string = '';
  selectedAccessories: string = '';
  selectedPose: string = ''; 
  selectedSkinTone: string = ''; // Skin tone selected by the user


  // Method to update the avatar part based on user input
  updateAvatarPart(value: string, part: string): void {
    switch (part) {
      case 'head':
        this.selectedHead = value;
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
      case 'pose':
        this.selectedPose = value;
        break;
    }
  }

  // Method to update skin tone and change paths accordingly
  updateSkinTone(value: 'claro' | 'medio' | 'oscuro'): void {
    this.selectedSkinTone = value;
    this.updateHeadSvgPath(); // Update head path based on skin tone
    this.updatePoseSvgPath(); // Update pose path based on skin tone
  }

  // Update the head path based on the selected skin tone
  updateHeadSvgPath(): void {
    this.headSvgPath = `assets/avatar/head/${this.selectedSkinTone}/`;
  }

  // Update the pose path based on the selected skin tone
  updatePoseSvgPath(): void {
    this.poseSvgPath = `assets/avatar/pose/${this.selectedSkinTone}/`;
  }

  // Método para guardar el avatar en la base de datos
  saveAvatar(): void {
    // Creación del objeto avatar con los valores seleccionados
    if (this.selectedHead) {
      this.headSvgPath = `assets/avatar/head/${this.selectedSkinTone}/${this.selectedHead}`;
    }

    if (this.selectedFace) {
      this.faceSvgPath = `assets/avatar/face/${this.selectedFace}`;
    }

    if (this.selectedFacialHair) {
      this.facialHairSvgPath = `assets/avatar/facialHair/${this.selectedFacialHair}`;
    }else{
      this.facialHairSvgPath = ``
    }

    if (this.selectedAccessories) {
      this.accessoriesSvgPath = `assets/avatar/accessories/${this.selectedAccessories}`;
    }else{
      this.accessoriesSvgPath = ``
    }

    if (this.selectedPose) {
      this.poseSvgPath = `assets/avatar/pose/${this.selectedSkinTone}/${this.selectedPose}`;
    }
    const avatar: IAvatar = {
      head: this.headSvgPath,
      face: this.faceSvgPath,
      facialHair: this.facialHairSvgPath,
      accessories: this.accessoriesSvgPath,
      pose: this.poseSvgPath,
      userBrand: {}
    };

    // Uso del servicio para guardar el avatar
  this.avatarService.save(avatar).subscribe({
    next: (response: any) => {
      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire(
        'Éxito',
        'El avatar ha sido guardado exitosamente.',
        'success'
      ).then(() => {
        this.router.navigate(['app/avatarView']); 
      });
    },
    error: (error: any) => {
      // Manejar el error con SweetAlert
      console.error('Error al guardar el avatar', error);
      Swal.fire(
        'Error',
        'Hubo un problema al guardar el avatar.',
        'error'
      );
    }
  });
  }

}
