import {Component, inject, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../../../shared/services/user.service';

@Component({
  selector: 'app-login-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent {
  private userService: UserService = inject(UserService);

  closeModal = output<boolean>();
  isSubmitting = false;

  loginData = {
    name: '',
    surname: '',
    password: ''
  };

  errorMessage = '';

  onLogin(): void {
    this.errorMessage = '';

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

        this.errorMessage =
          error.error?.message ?? 'Unable to log in.';
      }
    });
  }

  closeLoginModal(): void {
    this.closeModal.emit(false);
  }
}
