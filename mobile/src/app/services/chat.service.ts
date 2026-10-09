import { inject, Injectable } from '@angular/core';
// import { ChatMessage } from '../interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServerConfigService } from './server-config.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private serverConfig = inject(ServerConfigService);
  // TODO:未來可能會取過去聊天記錄
  // private chat = new Observable<ChatMessage[]>();

  greeting(): Observable<any> {
    return this.http.get(`${this.serverConfig.baseUrl()}/hello`);
  }

  sendMessage(user_message: string): Observable<Object> {
    return this.http.post(`${this.serverConfig.baseUrl()}/chat`, {
      user_message,
    });
  }

  // getMessage(): ChatMessage[] {
  //   return []
  // };
}
