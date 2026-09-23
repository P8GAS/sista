import {Injectable, signal, inject, WritableSignal} from '@angular/core';
import { Router } from '@angular/router';
import {User} from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router: Router = inject(Router);
  private http: HttpClient = inject(HttpClient);

  readonly currentUser: WritableSignal<User | null> = signal<User | null>(null);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser: string | null = localStorage.getItem('connectedUser');

    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (error) {
        console.error('Parsing error on the user', error);
        this.clearSession();
      }
    }
  }

  handleUnauthorized(): void {
    localStorage.removeItem('connectedUser');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  login(user: User): void {
    localStorage.setItem('connectedUser', JSON.stringify(user));

    this.currentUser.set(user);
  }

  logout(): void {
    this.http.post('/api/logout', {}, {
      withCredentials: true
    }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession(): void {
    localStorage.removeItem('connectedUser');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
