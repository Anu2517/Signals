import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private usersKey = 'users';
  private loggedInKey = 'isLoggedIn';
  private currentUserKey = 'currentUser';

  private currentUserSignal = signal<any>(this.getStoredUser());
  user$ = this.currentUserSignal;

  constructor(private router: Router) { }

  private getStoredUser() {
    const data = localStorage.getItem(this.currentUserKey);
    if (!data) return null;
    
    const user = JSON.parse(data);
    if (user && !user.role) {
      user.role = 'Administrator';
    }
    return user;
  }

  signUp(user: any) {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

    const newUser = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: 'Administrator'
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  signIn(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const validUser = users.find((u: any) => u.email === email && u.password === password);

    if (validUser) {
      if (!validUser.role) validUser.role = 'Administrator';

      localStorage.setItem(this.loggedInKey, 'true');
      localStorage.setItem(this.currentUserKey, JSON.stringify(validUser));
      this.currentUserSignal.set(validUser);
      return true;
    }
    return false;
  }

  getCurrentUser() {
    return this.currentUserSignal();
  }


  logout() {
    localStorage.removeItem(this.loggedInKey);
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSignal.set(null);
    // this.router.navigate(['/auth']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.loggedInKey) === 'true';
  }

}
