import {Component, inject, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CreateUserPayload} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';

@Component({
  selector: 'app-add-user-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css',
})
export class AddUserModalComponent {
  private userService: UserService = inject(UserService);

  closeModal = output<boolean>();
  userAdded = output<void>();

  newUser: CreateUserPayload = {
    name: '',
    surname: '',
    avatar: '',
    password: ''
  };

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  closeUserModal(): void {
    this.closeModal.emit(false);
  }

  addUser(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newUser.name.trim() || !this.newUser.surname.trim() || !this.newUser.password) {
      this.errorMessage = 'Name,surname and password are required';
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
        this.userAdded.emit();

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
}
