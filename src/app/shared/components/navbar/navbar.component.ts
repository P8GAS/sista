import {Component, inject, input, output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  leftLink = output<void>();
  rightLink = output<void>();
  middleLink = output<void>();

  goBack() {
    this.leftLink.emit();
  }

  logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('connectedUser');

      this.router.navigate(['/login']);
  }


  middleLinkClicked() {
    this.middleLink.emit();
  }

  openProfile() {
  }

  goToGift() {
    this.router.navigate([`users/${this.authService.currentUser()?.id}`]);
  }
}
