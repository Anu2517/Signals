import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const authReq = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }})
    : req;

  return next(authReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        console.log('Response:', event.status);
      }
    }),
    catchError(err => {
      if (err.status === 401) {
        inject(Router).navigate(['/signin']);
      }
      return throwError(() => err);
    })
  );
};
