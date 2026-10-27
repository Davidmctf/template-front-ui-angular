import { afterNextRender, effect, Service, signal } from '@angular/core';

const STORAGE_KEY = 'template-theme';

@Service()
export class ThemeService {
  private readonly _isDark = signal(false);

  readonly isDark = this._isDark.asReadonly();

  constructor() {
    afterNextRender(() => {
      this._isDark.set(this.getInitialTheme());
      document.documentElement.classList.toggle('app-dark', this._isDark());
    });

    effect(() => {
      const dark = this._isDark();
      if (typeof document === 'undefined') return;
      document.documentElement.classList.toggle('app-dark', dark);
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this._isDark.update((v) => !v);
  }

  private getInitialTheme(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
