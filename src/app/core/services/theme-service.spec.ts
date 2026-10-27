import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme-service';

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('app-dark');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('estado inicial', () => {
    it('isDark inicia en false por defecto', () => {
      expect(service.isDark()).toBe(false);
    });
  });

  describe('toggle', () => {
    it('cambia isDark de false a true', () => {
      service.toggle();
      expect(service.isDark()).toBe(true);
    });

    it('cambia isDark de true a false', () => {
      service.toggle();
      service.toggle();
      expect(service.isDark()).toBe(false);
    });

    it('alterna multiple veces correctamente', () => {
      service.toggle();
      service.toggle();
      service.toggle();
      expect(service.isDark()).toBe(true);
    });
  });

  describe('persistencia en localStorage', () => {
    it('guarda "dark" en localStorage al activar', async () => {
      service.toggle();
      await flush();
      expect(localStorage.getItem('template-theme')).toBe('dark');
    });

    it('guarda "light" en localStorage al desactivar', async () => {
      service.toggle();
      await flush();
      service.toggle();
      await flush();
      expect(localStorage.getItem('template-theme')).toBe('light');
    });
  });

  describe('clase CSS en <html>', () => {
    it('agrega .app-dark al alternar a dark', async () => {
      service.toggle();
      await flush();
      expect(document.documentElement.classList.contains('app-dark')).toBe(true);
    });

    it('quita .app-dark al alternar a light', async () => {
      service.toggle();
      await flush();
      service.toggle();
      await flush();
      expect(document.documentElement.classList.contains('app-dark')).toBe(false);
    });
  });
});
