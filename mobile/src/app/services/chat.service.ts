import { inject, Injectable, OnDestroy } from '@angular/core';
import { ChatMessage } from '../interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  // TODO:未來可能會取過去聊天記錄
  // private chat = new Observable<ChatMessage[]>();

  sendMessage(user_message: string): Observable<Object> {
    return this.http.post('http://127.0.0.1:8000/chat', { user_message })
  };

  // getMessage(): ChatMessage[] {
  //   return []
  // };
}
