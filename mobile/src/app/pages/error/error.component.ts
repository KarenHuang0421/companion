import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServerConfigService } from '../../services';

@Component({
  selector: 'app-error',
  standalone: true,
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent {
  private readonly router = inject(Router);

  readonly error = inject(ServerConfigService).lastError;

  retry(): void {
    this.router.navigateByUrl('/');
  }
}
