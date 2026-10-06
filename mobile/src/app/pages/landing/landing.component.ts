import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.checkServerStatus().then((ok) => {
      this.router.navigateByUrl(ok ? '/home' : '/error');
    });
  }

  /**
   * TODO(API): 換成真正打 GET /hello 的邏輯。
   * 打通（含 Tailscale 連線正常）resolve(true)；逾時或失敗 resolve(false)。
   */
  private checkServerStatus(): Promise<boolean> {
    return new Promise((resolve) => setTimeout(() => resolve(true), 900));
  }
}
