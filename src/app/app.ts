import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AuthService } from './services/auth-service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

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

  constructor(private router: Router, private route: ActivatedRoute, public auth: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.getChild(this.router.routerState.root);
        this.showSidebar = currentRoute.snapshot.data['showSidebar'] ?? true;
      }
    });
  }

  getChild(route: any): any {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  ngOnInit(): void {
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
  const htmlElement = document.documentElement;
  if (this.isDark) {
    htmlElement.classList.add('p-dark');
    document.body.classList.add('p-dark'); 
  } else {
    htmlElement.classList.remove('p-dark');
    document.body.classList.remove('p-dark');
  }
}


logout(): void {
  this.auth.logout();
    // localStorage.removeItem('token');
    this.router.navigate(['/signin']);
}

}