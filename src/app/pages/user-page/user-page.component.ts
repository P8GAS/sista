import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {GiftService} from '../../services/gift.service';
import {Gift} from '../../models/gift.model';
import {GiftCardComponent} from './components/gift-card.component/gift-card.component';

@Component({
  selector: 'app-user-page',
  imports: [
    RouterLink,
    GiftCardComponent
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly giftService = inject(GiftService)

  user: User | null = null;
  gifts: Gift[] = [];
  errorMessage = '';
  giftErrorMessage = '';
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid ID.';
      this.isLoading = false;
      return;
    }

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'User not found.';
        this.isLoading = false;
      }
    });

    this.giftService.getGiftsByUserId(id).subscribe({
      next: (gifts) => {
        this.gifts = gifts
      },
      error: (error) => {
        console.error(error);
        this.giftErrorMessage = 'Unable to retrieve gifts.';
      }
    })
  }
}
