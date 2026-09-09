import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {GiftService} from '../../services/gift.service';
import {Gift} from '../../models/gift.model';
import {GiftCardComponent} from './components/gift-card.component/gift-card.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-page',
  imports: [
    RouterLink,
    GiftCardComponent,
    FormsModule
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly giftService = inject(GiftService);

  user: User | null = null;
  gifts: Gift[] = [];

  expandedGiftId: number | null = null;
  transitioningGiftIds = new Set<number>();

  private giftTransitionTimer?: ReturnType<typeof setTimeout>;

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
  isGiftModalOpen = false;

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

  ngOnDestroy(): void {
    if (this.giftTransitionTimer) {
      clearTimeout(this.giftTransitionTimer);
    }
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

  openGiftModal(): void {
    this.isGiftModalOpen = true;
  }

  closeGiftModal(): void {
    this.isGiftModalOpen = false;
  }

  toggleGift(giftId: number): void {
    const previousGiftId = this.expandedGiftId;

    /*
     * La carte cliquée va soit s'agrandir, soit se refermer.
     * L'ancienne carte ouverte va se refermer si une autre est sélectionnée.
     */
    const idsToHide = new Set<number>(this.transitioningGiftIds);

    idsToHide.add(giftId);

    if (previousGiftId !== null) {
      idsToHide.add(previousGiftId);
    }

    this.transitioningGiftIds = idsToHide;

    this.expandedGiftId =
      this.expandedGiftId === giftId ? null : giftId;
  }

  onGiftTransitionEnd(event: TransitionEvent, giftId: number): void {
    /*
     * transitionend remonte depuis les enfants :
     * on garde uniquement l'événement provenant directement
     * de .gift-grid-item.
     */
    if (event.target !== event.currentTarget) {
      return;
    }

    /*
     * La largeur est animée via flex-basis et max-width.
     * Un seul des deux événements suffit.
     */
    if (event.propertyName !== 'flex-basis') {
      return;
    }

    const updatedIds = new Set(this.transitioningGiftIds);

    updatedIds.delete(giftId);

    this.transitioningGiftIds = updatedIds;
  }


}
