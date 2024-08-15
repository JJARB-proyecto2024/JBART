import { Component, effect, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ICategory, IChatbot } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { ChatbotFormComponent } from '../chatbot-form/chatbot-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ChatbotService } from '../../../services/chatbot.service';

@Component({
  selector: 'app-chatbot-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    ChatbotFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './chatbot-list.component.html',
  styleUrls: ['./chatbot-list.component.scss'],
  providers: [DatePipe]
})
export class ChatbotListComponent implements OnChanges{
  @Input() itemList: IChatbot[] = [];
  @Input() areActionsAvailable: boolean = false;
  public chatbotService: ChatbotService = inject(ChatbotService);

  public selectedItem: IChatbot = {
    question: '',
    answer:'',
    id: 0
  };

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
    if (changes['itemList']) {
      console.log('itemList', this.itemList);
    }
  }
  
  showDetailModal(item: IChatbot, modal: any) {
    this.selectedItem = {...item}
    modal.show();
  }

  hideModal(modal: any) {
    modal.hide();
  }

  handleFormAction(item: IChatbot, modal: any) {
    this.chatbotService.update(item).subscribe({
      next: (response: any) => {
        // Mostrar mensaje de éxito
        Swal.fire(
          'Éxito',
          'La pregunta ha sido actualizada exitosamente.',
          'success'
        ).then(() => {
          // Ocultar el modal después de mostrar el mensaje de éxito
          this.hideModal(modal);
        });
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Hubo un problema al actualizar la pregunta.',
          'error'
        ).then(() => {
          // Ocultar el modal después de mostrar el mensaje de error
          this.hideModal(modal);
        });
      }
    });
  }

  deleteChatbot(item: IChatbot, modal: any) {
    // Mostrar mensaje de confirmación
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de que desea eliminar la pregunta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, proceder con la eliminación
        this.chatbotService.delete(item).subscribe({
          next: (response: any) => {
            // Mostrar mensaje de éxito
            Swal.fire(
              'Eliminado',
              'La pregunta ha sido eliminada exitosamente.',
              'success'
            ).then(() => {
              // Ocultar el modal después de mostrar el mensaje de éxito
              this.hideModal(modal);
            });
          },
          error: (error: any) => {
            // Manejar el error
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la pregunta.',
              'error'
            ).then(() => {
              // Ocultar el modal después de mostrar el mensaje de error
              this.hideModal(modal);
            });
          }
        });
      }
    });
  }
}