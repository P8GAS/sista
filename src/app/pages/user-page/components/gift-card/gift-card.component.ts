import { Component, input, output } from '@angular/core';
import { Gift } from '../../../../shared/models/gift.model';

@Component({
  selector: 'app-gift-card',
  imports: [],
  templateUrl: './gift-card.component.html',
  styleUrl: './gift-card.component.css',
})
export class GiftCardComponent {
  gift = input.required<Gift>();
  expanded = input(false);
  showImage = input(true);
  toggleExpanded = output<void>();
}
