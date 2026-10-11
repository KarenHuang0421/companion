import { computed, inject, Injectable, signal } from '@angular/core';
import {
  LOCAL_URL,
  TAILNET_CODE_PATTERN,
  TAILNET_HOST_PLACEHOLDER,
  TAILNET_HOSTS,
  TAILNET_PLACEHOLDER,
  TAILSCALE_URL,
} from '../constants';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const STORAGE_KEY = 'tailnetCode';
const HOST_STORAGE_KEY = 'tailnetHost';

export interface ServerError {
  status: number;
  statusText: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {
  private readonly http = inject(HttpClient);
  private readonly tailnetCode = signal(this.readStored(STORAGE_KEY));
  private readonly tailnetHost = signal(this.readStoredHost());

  /** 最近一次連線檢查失敗的錯誤，給 error 頁顯示 */
  readonly lastError = signal<ServerError | null>(null);

  /** 有六位英數就走 Tailscale 網域，否則維持 IP */
  readonly baseUrl = computed(() => {
    const code = this.tailnetCode();
    const host = code
      ? TAILSCALE_URL.replace(TAILNET_HOST_PLACEHOLDER, this.tailnetHost()).replace(TAILNET_PLACEHOLDER, code)
      : LOCAL_URL;
    const protocol = code ? 'https' : 'http'
    return `${protocol}://${host}`;
  });

  get code(): string {
    return this.tailnetCode();
  }

  get host(): string {
    return this.tailnetHost();
  }

  /** 空字串代表清除，改回 IP；格式不符回傳 false */
  setCode(input: string): boolean {
    const code = input.trim().toLowerCase();
    if (code && !TAILNET_CODE_PATTERN.test(code)) return false;

    this.tailnetCode.set(code);
    this.writeStored(STORAGE_KEY, code);
    return true;
  }

  setHost(name: string): void {
    if (!TAILNET_HOSTS.some((h) => h.name === name)) return;
    this.tailnetHost.set(name);
    this.writeStored(HOST_STORAGE_KEY, name);
  }

  private readStoredHost(): string {
    const stored = this.readStored(HOST_STORAGE_KEY);
    return TAILNET_HOSTS.some((h) => h.name === stored) ? stored : TAILNET_HOSTS[0].name;
  }

  private readStored(key: string): string {
    try {
      return localStorage.getItem(key) ?? '';
    } catch {
      return '';
    }
  }

  private writeStored(key: string, value: string): void {
    try {
      value ? localStorage.setItem(key, value) : localStorage.removeItem(key);
    } catch {
      // localStorage 不可用時只保留在記憶體
    }
  }

  getServerStatus(): Observable<Object> {
    this.lastError.set(null);
    return this.http.get(this.baseUrl()).pipe(
      tap({
        error: (err: HttpErrorResponse) =>
          this.lastError.set({ status: err.status, statusText: err.statusText }),
      }),
    );
  }
}
