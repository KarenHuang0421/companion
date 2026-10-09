import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly chat = inject(ChatService);

  public helloMessage = '嗨，今天過得怎麼樣？';
  public smallTalk = signal('');

  ngOnInit(): void {
      this.chat.greeting().subscribe((response) =>
        this.smallTalk.set(response)
      )
  };


  openChat(): void {
    this.router.navigateByUrl('/chat');
  }

  openCheckin(): void {
    this.router.navigateByUrl('/checkin');
  }
}
