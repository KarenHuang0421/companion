import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services';
import { ChatMessage } from '../../interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  providers: [ChatService]
})
export class ChatComponent {
  private readonly router = inject(Router);
  private chat = inject(ChatService);

  // TODO(API): 換成 GET /chat 實際的對話紀錄
  messages: ChatMessage[] = [];
  draft = '';

  openCheckin(): void {
    this.router.navigateByUrl('/checkin');
  }

  // TODO(API): 把 draft 送到 GET /chat，並把回覆塞進 messages
  send(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.messages.push({ from: 'me', text });
    this.chat.sendMessage(text).subscribe(response => {
      this.messages.push({ from: 'rorty', text: response as string });
    })
    this.draft = '';
  }
}
