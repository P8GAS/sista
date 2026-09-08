import {Component, input} from '@angular/core';
import {Gift} from '../../../../models/gift.model';

@Component({
  selector: 'app-gift-card',
  imports: [],
  templateUrl: './gift-card.component.html',
  styleUrl: './gift-card.component.css',
})
export class GiftCardComponent {
  gift = input.required<Gift>();
}
