import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

private http = inject(HttpClient);

  private usersKey = 'users';
  private loggedInKey = 'isLoggedIn';
  private currentUserKey = 'currentUser';

  private currentUserSignal = signal<any>(this.getStoredUser());
  user$ = this.currentUserSignal;

  constructor(private router: Router) {}

  private getStoredUser() {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
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

  private loginUrl = 'http://192.168.5.13:5078/api/auth/login';
  login(email: string, password: string): Observable<boolean> {
      // const body = {
      //   email: 'yugandhar.reddy@example.com',
      //   password: 'SecurePass123!'
      // };  
    localStorage.removeItem('token');

    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
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

  getCurrentUser() {
    return this.currentUserSignal();
  }


  logout() {
    localStorage.removeItem(this.loggedInKey);
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem('token');
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.loggedInKey) === 'true';
  }

}
