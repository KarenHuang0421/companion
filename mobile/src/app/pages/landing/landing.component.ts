import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServerConfigService } from '../../services';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly serverConfig = inject(ServerConfigService);

  ngOnInit(): void {
    this.checkServerStatus().then((ok) => {
      this.router.navigateByUrl(ok ? '/home' : '/error');
    });
  }

  private checkServerStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      this.serverConfig.getServerStatus().subscribe({
        next: () => resolve(true),
        error: () => resolve(false),
      });
    });
  }
}
