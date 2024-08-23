
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SVG } from '@svgdotjs/svg.js';
import { FormsModule } from '@angular/forms';
import { IAvatar } from '../../../interfaces';
import { AvatarService } from '../../../services/avatar.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avatar-see',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './avatar-see.component.html',
  styleUrls: ['./avatar-see.component.scss']
})
export class AvatarSeeComponent {
  public avatarService: AvatarService = inject(AvatarService);
  public avatar: IAvatar | null = null;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.avatarService.getByUserBuyer().subscribe({
      next: (response: IAvatar) => {
        this.avatar = response;
      },
      error: (error: any) => {
        console.error('Error fetching avatar', error);
        Swal.fire(
          'Error',
          'Hubo un problema al cargar el avatar.',
          'error'
        );
      }
    });
  }

  deleteAvatar(id: number): void {
    console.log(id)
    if (id === undefined || id === null) {
      Swal.fire(
        'Error',
        'No se pudo eliminar el avatar, ID no válido.',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.avatarService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado!',
              'El avatar ha sido eliminado.',
              'success'
            ).then(() => {
              // Limpiar el avatar en el componente después de eliminarlo
              this.avatar = null;
            });
          },
          error: (error: any) => {
            console.error('Error deleting avatar', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el avatar.',
              'error'
            );
          }
        });
      }
    });
  }

  createAvatar() {
    this.router.navigate(['app/avatarCreate']); 
  }
}