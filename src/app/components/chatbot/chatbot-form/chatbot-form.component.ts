import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IChatbot} from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
