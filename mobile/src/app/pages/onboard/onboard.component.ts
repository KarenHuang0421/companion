import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerConfigService } from '../../services';
import { TAILNET_HOSTS } from '../../constants';

/** 選完主機後停一下，讓使用者看到選取效果再切回代碼區塊 */
const HOST_PICK_DELAY = 220;

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
  private readonly codeInput = viewChild<ElementRef<HTMLInputElement>>('codeInput');
  private readonly hostPanel = viewChild<ElementRef<HTMLElement>>('hostPanel');

  readonly hosts = TAILNET_HOSTS;
  host = this.serverConfig.host;
  code = this.serverConfig.code;
  invalid = false;
  /** A：輸入代碼；B：選擇主機 */
  panel: 'code' | 'host' = 'code';

  get currentHost() {
    return this.hosts.find((h) => h.name === this.host) ?? this.hosts[0];
  }

  submit(): void {
    if (!this.code.trim()) return;
    this.invalid = !this.serverConfig.setCode(this.code);
    if (this.invalid) return;
    this.router.navigateByUrl('/landing');
  }

  skip(): void {
    this.serverConfig.setCode('');
    this.router.navigateByUrl('/landing');
  }

  showHostPanel(): void {
    this.panel = 'host';
    // 等 transition 開始後再移焦點，避免捲動跳動
    setTimeout(() => this.hostPanel()?.nativeElement.querySelector<HTMLElement>('.host-option.selected')?.focus());
  }

  showCodePanel(): void {
    this.panel = 'code';
    setTimeout(() => this.codeInput()?.nativeElement.focus({ preventScroll: true }));
  }

  pickHost(name: string): void {
    this.host = name;
    this.serverConfig.setHost(name);
    setTimeout(() => this.showCodePanel(), HOST_PICK_DELAY);
  }
}
