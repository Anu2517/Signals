import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ButtonModule,
    ToggleButtonModule,
    TableModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  title = 'School Management';

  //   isDark = false;

  //   ngOnInit(): void {
  //     const savedTheme = localStorage.getItem('theme');
  //     this.isDark = savedTheme === 'dark';
  //     this.applyTheme();
  // }

  //   toggleTheme(): void {
  //     this.isDark = !this.isDark;
  //     localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  //     this.applyTheme();
  //   }

  //   private applyTheme(): void {
  //     document.body.classList.remove('light-theme', 'dark-theme');
  //     if (this.isDark) {
  //       document.body.classList.add('dark-theme');
  //     } else {
  //       document.body.classList.add('light-theme');
  //     }
  //   }

  isDark = false;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDark = savedTheme === 'dark';
    this.applyTheme();
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

}