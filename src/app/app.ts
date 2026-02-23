import { Component, DOCUMENT, inject, Renderer2, DestroyRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AuthService } from './services/auth-service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ButtonModule,
    ToggleButtonModule,
    ToastModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'School Management';
  isDark = false;
  showSidebar = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public auth = inject(AuthService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const currentRoute = this.getChild(this.router.routerState.root);
        this.showSidebar = currentRoute.snapshot.data['showSidebar'] ?? true;
      });

    this.updateSidebarVisibility();

    const savedTheme = localStorage.getItem('theme');
    this.isDark = savedTheme === 'dark';
    this.applyTheme();
  }

  private updateSidebarVisibility(): void {
    let currentRoute = this.route.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    this.showSidebar = currentRoute.snapshot.data['showSidebar'] !== false;
  }


  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    const htmlElement = this.document.documentElement;
    const bodyElement = this.document.body;
    
    if (this.isDark) {
      this.renderer.addClass(htmlElement, 'p-dark');
      this.renderer.addClass(bodyElement, 'p-dark');
    } else {
      this.renderer.removeClass(htmlElement, 'p-dark');
      this.renderer.removeClass(bodyElement, 'p-dark');
    }
  }


  logout(): void {
    this.auth.logout();
  }

}