import { Service, signal } from '@angular/core';

@Service()
export class LayoutService {
  sidebarCollapsed = signal(false);
  mobileSidebarOpen = signal(false);

  toggleSidebar() {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      this.sidebarCollapsed.update((v) => !v);
    } else {
      this.mobileSidebarOpen.update((v) => !v);
    }
  }
  closeMobileSidebar() {
    this.mobileSidebarOpen.set(false);
  }
}
