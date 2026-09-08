import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import {UserCardComponent} from './components/user-card/user-card.component';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-home-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    UserCardComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private readonly userService = inject(UserService);

  users: User[] = [];

  newUser = {
    name: '',
    avatar: '',
    gender: ''
  };

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

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

  addUser(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newUser.name.trim() || !this.newUser.gender) {
      this.errorMessage = 'Name and gender are required';
      return;
    }

    this.isSubmitting = true;

    this.userService.createUser({
      name: this.newUser.name.trim(),
      avatar: this.newUser.avatar.trim() || null,
      gender: this.newUser.gender
    }).subscribe({
      next: (createdUser) => {
        this.users.push(createdUser);

        this.newUser = {
          name: '',
          avatar: '',
          gender: ''
        };

        this.successMessage = 'User added.';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Cannot add user.';
        this.isSubmitting = false;
      }
    });
  }
}
