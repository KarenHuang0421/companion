import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);

  // TODO(API): 換成 GET /hello 實際回傳的文字
  readonly helloMessage = '嗨，今天過得怎麼樣？';

  openChat(): void {
    this.router.navigateByUrl('/chat');
  }

  openCheckin(): void {
    this.router.navigateByUrl('/checkin');
  }
}
