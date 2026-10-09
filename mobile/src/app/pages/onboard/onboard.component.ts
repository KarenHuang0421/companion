import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerConfigService } from '../../services';

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './onboard.component.html',
  styleUrl: './onboard.component.scss',
})
export class OnboardComponent {
  private readonly router = inject(Router);
  private readonly serverConfig = inject(ServerConfigService);

  code = this.serverConfig.code;
  invalid = false;

  submit(): void {
    this.invalid = !this.serverConfig.setCode(this.code);
    if (this.invalid) return;
    this.router.navigateByUrl('/landing');
  }

  skip(): void {
    this.serverConfig.setCode('');
    this.router.navigateByUrl('/landing');
  }
}
