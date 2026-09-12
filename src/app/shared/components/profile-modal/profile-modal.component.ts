import {Component, inject, output, OutputEmitterRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-profile-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css',
})
export class ProfileModalComponent {
  private authService: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);

  closeModal: OutputEmitterRef<boolean> = output<boolean>();

  isSubmitting: boolean = false;

  profileData: {name: string, surname: string, password: string, avatar: string} = {
    name: '',
    surname: '',
    password: '',
    avatar: ''
  };

  ngOnInit(): void {
    const currentUser: User | null = this.authService.currentUser();
    if (currentUser) {
      this.profileData.name = currentUser.name;
      this.profileData.surname = currentUser.surname;
    }
  }

  onUpdateProfile(): void {
    this.isSubmitting = true;
    const userId: number | undefined = this.authService.currentUser()?.id;

    if (!userId) return;

    this.userService.updateUser(userId as unknown as string, this.profileData).subscribe({
      next: (): void => {
        window.location.reload();

        this.isSubmitting = false;
        this.onClose();
      },
      error: (err: any): void => {
        console.error('Update failed', err);
        this.isSubmitting = false;
      }
    });
  }

  onClose(): void {
    this.closeModal.emit(false);
  }
}
