import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
  name: string;
  email: string;
  role: string;
  userName?: string;
  fullName?: string;
  password?: string;
  age?: number;
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private baseUrl = `${environment.apiUrl}/auth`;
  private loggedInKey = 'isLoggedIn';
  private currentUserKey = 'currentUser';

  private currentUserSignal = signal<User | null>(this.getStoredUser());
  user$ = this.currentUserSignal;

  private getStoredUser() {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
  }

  signUp(user: User) {
    return this.http.post<any>(`${this.baseUrl}/register`, user)
  }

  login(email: string, password: string) {

    return this.http.post<{ token: string; userName: string; email: string; role: string }>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);

        const user = {
          name: res.userName,
          email: res.email,
          role: res.role
        };

        localStorage.setItem(this.loggedInKey, 'true');
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.currentUserSignal.set(user);
      }),
      map(() => true),
      catchError(err => {
        console.error('Login failed', err);
        return of(false);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }


  logout() {
    localStorage.removeItem(this.loggedInKey);
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem('token');
    this.currentUserSignal.set(null);
    this.router.navigate(['/signin']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.loggedInKey) === 'true';
  }

}
