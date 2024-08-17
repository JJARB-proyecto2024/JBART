import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IFeedBackMessage, ICategory, IFeedbackStatus, IChatbot} from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ChatbotService } from '../../../services/chatbot.service';

@Component({
  selector: 'app-chatbot-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './chatbot-form.component.html',
  styleUrl: './chatbot-form.component.scss'
})
export class ChatbotFormComponent  {
  @Input() chatbot: IChatbot =  {
    question: '',
    answer: '',
    id: 0
  };
  @Input() action = '';
  @Output() callParentEvent: EventEmitter<IChatbot> = new EventEmitter<IChatbot>()

  callEvent() {
    this.callParentEvent.emit(this.chatbot);
  }
}
