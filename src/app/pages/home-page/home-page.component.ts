import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserCardComponent} from './components/user-card/user-card.component';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user.model';
import {AddUserModalComponent} from './components/add-user-modal/add-user-modal.component';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UserCardComponent,
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

  goBack(): void {}

}
