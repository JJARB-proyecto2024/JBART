import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatbotService } from '../../../services/chatbot.service';
import { IChatbot } from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot-floating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot-floating.component.html',
  styleUrls: ['./chatbot-floating.component.scss']
})
export class ChatbotFloatingComponent implements OnInit {
  isChatOpen = false;
  items: IChatbot[] = [];
  selectedItem: IChatbot | null = null;

  @ViewChild('chatbotBody', { static: false }) chatbotBody!: ElementRef;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.chatbotService.getAll();
    this.items = this.chatbotService.items$();
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  selectQuestion(item: IChatbot) {
    this.selectedItem = item;
    this.scrollToBottom();
  }

  deselectQuestion() {
    this.selectedItem = null;
  }

  private scrollToBottom(): void {
    if (this.chatbotBody) {
      const element = this.chatbotBody.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

}