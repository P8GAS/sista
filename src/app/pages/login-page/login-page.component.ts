import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LoginResponse, UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private userService: UserService = inject(UserService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  isSubmitting: boolean = false;
  errorMessage: string = '';
  loginData: {name: string, surname: string, password: string} = {
    name: '',
    surname: '',
    password: ''
  };


  onLogin(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.userService.login(this.loginData).subscribe({
      next: (response: LoginResponse): void => {
        console.log('LOGIN OK', response);

        this.authService.login(response.user);

        console.log('AUTH OK', this.authService.currentUser());

        this.isSubmitting = false;

        console.log('NAVIGATION');
        this.router.navigate(['/']);
      },
      error: (error: any): void => {
        this.isSubmitting = false;
        console.error('Login error:', error);

        this.errorMessage = error.error?.message ?? 'Unable to log in.';
      }
    });
  }
}
