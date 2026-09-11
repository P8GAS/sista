import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../shared/models/user.model';
import {GiftService} from '../../shared/services/gift.service';
import {Gift} from '../../shared/models/gift.model';
import {GiftCardComponent} from './components/gift-card/gift-card.component';
import {FormsModule} from '@angular/forms';
import {AddGiftModalComponent} from './components/add-gift-modal/add-gift-modal.component';
import {NavbarComponent} from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-user-page',
  imports: [
    GiftCardComponent,
    FormsModule,
    AddGiftModalComponent,
    NavbarComponent
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly giftService = inject(GiftService);

  user: User | null = null;
  gifts: Gift[] = [];

  expandedGiftId: number | null = null;
  transitioningGiftIds = new Set<number>();

  private giftTransitionTimer?: ReturnType<typeof setTimeout>;

  errorMessage = '';
  isLoading = true;
  isGiftModalOpen = false;

  userId = '';

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

    this.loadGifts(id);
  }

  ngOnDestroy(): void {
    if (this.giftTransitionTimer) {
      clearTimeout(this.giftTransitionTimer);
    }
  }

  loadGifts(id: string): void {
    this.giftService.getGiftsByUserId(id).subscribe({
      next: (gifts) => {
        this.gifts = gifts;
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Cannot get gifts';
      }
    });
  }

  openGiftModal(): void {
    this.isGiftModalOpen = true;
  }

  toggleGift(giftId: number): void {
    const previousGiftId = this.expandedGiftId;
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
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.propertyName !== 'flex-basis') {
      return;
    }

    const updatedIds = new Set(this.transitioningGiftIds);

    updatedIds.delete(giftId);

    this.transitioningGiftIds = updatedIds;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
