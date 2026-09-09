import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserCardComponent} from './components/user-card/user-card.component';
import {UserService} from '../../services/user.service';
import {CreateUserPayload, User} from '../../models/user.model';

@Component({
  selector: 'app-home-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserCardComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private readonly userService = inject(UserService);

  users: User[] = [];

  newUser: CreateUserPayload = {
    name: '',
    surname: '',
    avatar: '',
    password: ''
  };

  loginData = {
    name: '',
    surname: '',
    password: ''
  };

  loginErrorMessage = '';
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
  isUserModalOpen = false;
  isLoginModalOpen = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Cannot get users';
      }
    });
  }

  openUserModal(): void {
    this.isUserModalOpen = true;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
  }

  openLoginModal(): void {
    this.isLoginModalOpen = true;
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }

  addUser(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newUser.name.trim() || !this.newUser.surname.trim() || !this.newUser.password) {
      this.errorMessage = 'Name and gender are required';
      return;
    }

    this.isSubmitting = true;

    this.userService.createUser({
      name: this.newUser.name.trim(),
      surname: this.newUser.surname.trim(),
      avatar: this.newUser.avatar?.trim() || null,
      password: this.newUser.password,
    }).subscribe({
      next: () => {
        this.loadUsers()

        this.newUser = {
          name: '',
          surname: '',
          avatar: '',
          password: ''
        };

        this.successMessage = 'User added.';
        this.isSubmitting = false;
        this.closeUserModal()
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Cannot add user.';
        this.isSubmitting = false;
      }
    });
  }

  onLogin(): void {
    this.loginErrorMessage = '';

    this.userService.login(this.loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem(
          'connectedUser',
          JSON.stringify(response.user)
        );

        console.log('Connected user:', response.user);

        this.closeLoginModal()
      },
      error: (error) => {
        console.error('Login error:', error);

        this.loginErrorMessage =
          error.error?.message ?? 'Unable to log in.';
      }
    });
  }

}
