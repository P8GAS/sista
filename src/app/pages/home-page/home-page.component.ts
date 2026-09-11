import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserCardComponent} from './components/user-card/user-card.component';
import {UserService} from '../../shared/services/user.service';
import {CreateUserPayload, User} from '../../shared/models/user.model';
import {LoginModalComponent} from './components/login-modal/login-modal.component';
import {AddUserModalComponent} from './components/add-user-modal/add-user-modal.component';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserCardComponent,
    LoginModalComponent,
    AddUserModalComponent,
    NavbarComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private readonly userService = inject(UserService);

  users: User[] = [];

  errorMessage = '';
  isAddUserModalOpen = false;
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

  openAddUserModal(): void {
    this.isAddUserModalOpen = true;
  }

  openLoginModal(): void {
    this.isLoginModalOpen = true;
  }

}
