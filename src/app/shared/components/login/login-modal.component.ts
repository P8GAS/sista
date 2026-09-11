import {Component, inject, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent {
  private userService: UserService = inject(UserService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  isSubmitting = false;
  errorMessage = '';
  loginData = {
    name: '',
    surname: '',
    password: ''
  };


  onLogin(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.userService.login(this.loginData).subscribe({
      next: (response) => {
        this.authService.login(response.token, response.user);

        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Login error:', error);

        this.errorMessage = error.error?.message ?? 'Unable to log in.';
      }
    });
  }
}
