import { Component, inject, OnInit } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IChatbot } from '../../interfaces';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ChatbotService } from '../../services/chatbot.service';
import { ChatbotListComponent } from '../../components/chatbot/chatbot-list/chatbot-list.component';
import { ChatbotFormComponent } from '../../components/chatbot/chatbot-form/chatbot-form.component';
import { ChatbotFloatingComponent } from '../../components/chatbot/chatbot-floating/chatbot-floating.component';

@Component({
  selector: 'app-admin-chatbot',
  standalone: true,
  imports: [
    ChatbotListComponent,
    LoaderComponent,
    CommonModule,
    ModalComponent,
    ChatbotFormComponent,
    ChatbotFloatingComponent
  ],
  templateUrl: './admin-chatbot.component.html',
  styleUrl: './admin-chatbot.component.scss'
})
export class AdminChatbotComponent implements OnInit{
  public chatbotService: ChatbotService = inject(ChatbotService);
  public route: ActivatedRoute = inject(ActivatedRoute);
  public areActionsAvailable: boolean = false;
  public authService: AuthService =  inject(AuthService);
  public routeAuthorities: string[] =  [];

  ngOnInit(): void {
    this.chatbotService.getAll();
    this.route.data.subscribe( data => {
      this.routeAuthorities = data['authorities'] ? data['authorities'] : [];
      this.areActionsAvailable = this.authService.areActionsAvailable(this.routeAuthorities);
    });
  }

  hideModal(modal: any) {
    modal.hide();
  }

  handleFormAction(item: IChatbot, modal: any) {
    this.chatbotService.save(item).subscribe({
      next: (response: any) => {
        Swal.fire(
          'Éxito',
          'La pregunta ha sido guardada exitosamente.',
          'success'
        ).then(() => {
          this.hideModal(modal);
        });
      },
      error: (error: any) => {
        Swal.fire(
          'Error',
          'Hubo un problema al guardar la pregunta.',
          'error'
        ).then(() => {
          this.hideModal(modal);
        });
      }
    });
  }

}