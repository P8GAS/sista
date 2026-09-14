import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserCardComponent} from './components/user-card/user-card.component';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user.model';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserCardComponent,
    NavbarComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private readonly userService: UserService = inject(UserService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  users: User[] = [];

  errorMessage: string = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]): void => {
        this.users = users;
      },
      error: (error: any): void => {
        console.error(error);
        this.errorMessage = 'Cannot get users';
      }
    });
  }

  onMiddleClicked(): void {
    this.router.navigate([`/users/${this.authService.currentUser()?.id}`]);
  }

  goBack(): void {}

}
