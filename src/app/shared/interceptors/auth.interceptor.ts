import { inject } from '@angular/core';
import {
  HttpErrorResponse, HttpHandlerFn,
  HttpInterceptorFn, HttpRequest
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): any => {
  const authService: AuthService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse): Observable<never> => {
      if (
        error.status === 401 &&
        !req.url.includes('/api/login')
      ) {
        authService.handleUnauthorized();
      }

      return throwError((): HttpErrorResponse => error);
    })
  );
};
