import {Component, inject, input, output, OutputEmitterRef} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ProfileModalComponent} from '../profile-modal/profile-modal.component';

@Component({
  selector: 'app-navbar',
  imports: [
    ProfileModalComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  leftLink: OutputEmitterRef<void> = output<void>();
  rightLink: OutputEmitterRef<void> = output<void>();
  middleLink: OutputEmitterRef<void> = output<void>();

  isProfileOpen: boolean = false;

  goBack(): void {
    this.leftLink.emit();
  }

  logout(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('connectedUser');

      this.router.navigate(['/login']);
  }


  middleLinkClicked(): void {
    this.middleLink.emit();
  }

  openProfile(): void  {
    this.isProfileOpen = true;
  }

  goToGift(): void {
    this.router.navigate([`users/${this.authService.currentUser()?.id}`]);
  }
}
