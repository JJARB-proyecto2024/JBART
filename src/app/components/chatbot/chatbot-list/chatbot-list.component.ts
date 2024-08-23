import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IChatbot } from '../../../interfaces';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { ChatbotFormComponent } from '../chatbot-form/chatbot-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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

  public paginatedList: IChatbot[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 6;
  public Math = Math;

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areActionsAvailable']) {
      console.log('areActionsAvailable', this.areActionsAvailable);
    }
    if (changes['itemList']) {
      console.log('itemList', this.itemList);
      this.updatePaginatedList();
    }
  }
  
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.itemList.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > Math.ceil(this.itemList.length / this.itemsPerPage)) {
      return; // No hacer nada si la página es inválida
    }
    this.currentPage = page;
    this.updatePaginatedList();
  }

  trackById(index: number, item: IChatbot) {
    return item.id;
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
        Swal.fire(
          'Éxito',
          'La pregunta ha sido actualizada exitosamente.',
          'success'
        ).then(() => {
          this.hideModal(modal);
          this.updatePaginatedList();
        });
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Hubo un problema al actualizar la pregunta.',
          'error'
        ).then(() => {
          this.hideModal(modal);
        });
      }
    });
  }

  deleteChatbot(item: IChatbot, modal: any) {
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
        this.chatbotService.delete(item).subscribe({
          next: (response: any) => {
            Swal.fire(
              'Eliminado',
              'La pregunta ha sido eliminada exitosamente.',
              'success'
            ).then(() => {
              this.hideModal(modal);
              this.updatePaginatedList();
            });
          },
          error: (error: any) => {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la pregunta.',
              'error'
            ).then(() => {
              this.hideModal(modal);
            });
          }
        });
      }
    });
  }
}