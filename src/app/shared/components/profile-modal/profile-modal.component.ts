import {Component, inject, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css',
})
export class ProfileModalComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  closeModal = output<boolean>();

  isSubmitting = false;

  profileData = {
    name: '',
    surname: '',
    password: ''
  };

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.profileData.name = currentUser.name;
      this.profileData.surname = currentUser.surname;
    }
  }

  onUpdateProfile(): void {
    this.isSubmitting = true;
    const userId = this.authService.currentUser()?.id;

    if (!userId) return;

    this.userService.updateUser(userId as unknown as string, this.profileData).subscribe({
      next: (updatedUser) => {
        const currentToken = localStorage.getItem('token') || '';
        this.authService.login(currentToken, updatedUser);

        this.isSubmitting = false;
        this.onClose();
      },
      error: (err) => {
        console.error('Update failed', err);
        this.isSubmitting = false;
      }
    });
  }

  onClose(): void {
    this.closeModal.emit(false);
  }
}
