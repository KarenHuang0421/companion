import { computed, Injectable, signal } from '@angular/core';
import { LOCAL_URL, TAILNET_CODE_PATTERN, TAILNET_PLACEHOLDER, TAILSCALE_URL } from '../constants';

const STORAGE_KEY = 'tailnetCode';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {
  private readonly tailnetCode = signal(this.readStoredCode());

  /** 有六位英數就走 Tailscale 網域，否則維持 IP */
  readonly baseUrl = computed(() => {
    const code = this.tailnetCode();
    const host = code ? TAILSCALE_URL.replace(TAILNET_PLACEHOLDER, code) : LOCAL_URL;
    return `http://${host}`;
  });

  get code(): string {
    return this.tailnetCode();
  }

  /** 空字串代表清除，改回 IP；格式不符回傳 false */
  setCode(input: string): boolean {
    const code = input.trim().toLowerCase();
    if (code && !TAILNET_CODE_PATTERN.test(code)) return false;

    this.tailnetCode.set(code);
    try {
      code ? localStorage.setItem(STORAGE_KEY, code) : localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage 不可用時只保留在記憶體
    }
    return true;
  }

  private readStoredCode(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  }
}
