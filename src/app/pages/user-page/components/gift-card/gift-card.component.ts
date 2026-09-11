import {Component, inject, input, output} from '@angular/core';
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

  gift = input.required<Gift>();
  expanded = input(false);
  showImage = input(true);
  toggleExpanded = output<void>();
  loadGifts = output<void>();
  routeId = this.route.snapshot.paramMap.get('id');

  deleteGift(giftId: number) {
    const userId = this.authService.currentUser()?.id;
    this.giftService.deleteGift(userId, giftId).subscribe({
      next: (reponse) => {
        console.log("Cadeau supprimé !", reponse);
        this.loadGifts.emit()
      },
      error: (erreur) => {
        console.error("Erreur HTTP :", erreur);
      }
    });  }
}
