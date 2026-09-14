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
import {Subscription} from 'rxjs';

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
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private readonly userService: UserService = inject(UserService);
  private readonly giftService: GiftService = inject(GiftService);

  user: User | null = null;
  gifts: Gift[] = [];

  expandedGiftId: number | null = null;
  transitioningGiftIds: Set<number> = new Set<number>();

  private giftTransitionTimer?: ReturnType<typeof setTimeout>;

  errorMessage: string = '';
  isLoading: boolean = true;
  isGiftModalOpen: boolean = false;

  userId: string = '';

  private routeSub?: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id: string | null = params.get('id');

      if (!id) {
        this.errorMessage = 'Invalid ID.';
        this.isLoading = false;
        return;
      }

      this.userId = id;
      this.isLoading = true;

      this.userService.getUserById(id).subscribe({
        next: (user: User): void => {
          this.user = user;
          this.isLoading = false;
        },
        error: (error: any): void => {
          console.error(error);
          this.errorMessage = 'User not found.';
          this.isLoading = false;
        }
      });

      this.loadGifts(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();

    if (this.giftTransitionTimer) {
      clearTimeout(this.giftTransitionTimer);
    }
  }

  loadGifts(id: string): void {
    this.giftService.getGiftsByUserId(id).subscribe({
      next: (gifts: Gift[]): void => {
        this.gifts = gifts;
      },
      error: (error: any): void => {
        console.error(error);
        this.errorMessage = 'Cannot get gifts';
      }
    });
  }

  openGiftModal(): void {
    this.isGiftModalOpen = true;
  }

  toggleGift(giftId: number): void {
    const previousGiftId: number | null = this.expandedGiftId;
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
