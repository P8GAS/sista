import {Component, inject, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import { Gift } from '../../../../shared/models/gift.model';
import {GiftService} from '../../../../shared/services/gift.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-gift-card',
  imports: [],
  templateUrl: './gift-card.component.html',
  styleUrl: './gift-card.component.css',
})
export class GiftCardComponent {
  private giftService: GiftService = inject(GiftService);
  protected authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  gift: InputSignal<Gift> = input.required<Gift>();
  expanded: InputSignal<boolean> = input(false);
  showImage: InputSignal<boolean> = input(true);
  toggleExpanded: OutputEmitterRef<void> = output<void>();
  loadGifts: OutputEmitterRef<void> = output<void>();
  isCurrentUserPage: boolean = false;

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.isCurrentUserPage = id !== null && +id === this.authService.currentUser()?.id;
  }

  deleteGift(giftId: number): void {
    const userId: number | undefined = this.authService.currentUser()?.id;
    this.giftService.deleteGift(userId, giftId).subscribe({
      next: (response: Object): void => {
        console.log("Gift deleted !", response);
        this.loadGifts.emit()
      },
      error: (error: any): void => {
        console.error("HTTP error:", error);
      }
    });
  }

  reserveGift(): void {
      const userId: string | null = this.route.snapshot.paramMap.get('id');
      const giftId: number = this.gift().id;

      const newReservedState: boolean = !this.gift().reserved;

      if(userId !== null) {
        this.giftService.toggleReservation(+userId, giftId, newReservedState)
          .subscribe({
            next: (): void => {
              this.gift().reserved = newReservedState;
            },
            error: (err: any): void => {
              console.error("Error while reserving", err);
            }
          });
      }
  }
}
