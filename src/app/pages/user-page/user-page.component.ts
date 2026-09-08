import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {GiftService} from '../../services/gift.service';
import {Gift} from '../../models/gift.model';
import {GiftCardComponent} from './components/gift-card.component/gift-card.component';
import {FormsModule} from '@angular/forms';
import {UserCardComponent} from '../home-page/components/user-card/user-card.component';

@Component({
  selector: 'app-user-page',
  imports: [
    RouterLink,
    GiftCardComponent,
    FormsModule,
    UserCardComponent
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly giftService = inject(GiftService);

  user: User | null = null;
  gifts: Gift[] = [];

  newGift = {
    name: '',
    brand: '',
    price: null as number | null,
    url: '',
    photo: ''
  };

  errorMessage = '';
  giftsErrorMessage = '';
  successMessage = '';
  isLoading = true;
  isSubmittingGift = false;

  private userId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid ID.';
      this.isLoading = false;
      return;
    }

    this.userId = id;

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
        this.gifts = gifts;
      },
      error: (error) => {
        console.error(error);
        this.giftsErrorMessage = 'Unable to retrieve gifts.';
      }
    });
  }

  addGift(): void {
    this.giftsErrorMessage = '';
    this.successMessage = '';

    if (!this.newGift.name.trim()) {
      this.giftsErrorMessage = 'Gift name is required.';
      return;
    }

    this.isSubmittingGift = true;

    this.giftService.createGift(this.userId, {
      name: this.newGift.name.trim(),
      brand: this.newGift.brand.trim(),
      price: this.newGift.price,
      url: this.newGift.url.trim(),
      photo: this.newGift.photo.trim() || null
    }).subscribe({
      next: (createdGift) => {
        this.gifts.push(createdGift);

        this.newGift = {
          name: '',
          brand: '',
          price: null,
          url: '',
          photo: ''
        };

        this.successMessage = 'Gift added.';
        this.isSubmittingGift = false;
      },
      error: (error) => {
        console.error(error);
        this.giftsErrorMessage = 'Unable to add the gift.';
        this.isSubmittingGift = false;
      }
    });
  }
}
