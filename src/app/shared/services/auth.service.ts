import {Injectable, signal, inject, WritableSignal} from '@angular/core';
import { Router } from '@angular/router';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router: Router = inject(Router);

  readonly currentUser: WritableSignal<User | null> = signal<User | null>(null);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser: string | null = localStorage.getItem('connectedUser');
    const token: string | null = localStorage.getItem('token');
    const expiry: string | null= localStorage.getItem('tokenExpiry');

    if (storedUser && token) {
      if (expiry && Date.now() > parseInt(expiry, 10)) {
        console.warn('Expired session');
        this.logout();
        return;
      }

      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (error) {
        console.error('Parsing error on the user', error);
        this.logout();
      }
    }
  }

  login(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('connectedUser', JSON.stringify(user));

    const expiresIn: number = 2 * 60 * 60 * 1000;
    const expiryDate: number = Date.now() + expiresIn;
    localStorage.setItem('tokenExpiry', expiryDate.toString());

    this.currentUser.set(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('connectedUser');
    localStorage.removeItem('tokenExpiry');

    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
