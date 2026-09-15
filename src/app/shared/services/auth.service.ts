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

    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (error) {
        console.error('Parsing error on the user', error);
        this.logout();
      }
    }
  }

  login(user: User): void {
    localStorage.setItem('connectedUser', JSON.stringify(user));

    this.currentUser.set(user);
  }

  logout(): void {
    localStorage.removeItem('connectedUser');

    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
