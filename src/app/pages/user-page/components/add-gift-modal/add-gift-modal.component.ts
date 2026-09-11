import {Component, inject, input, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GiftService} from '../../../../shared/services/gift.service';
import {Gift} from '../../../../shared/models/gift.model';

@Component({
  selector: 'app-add-gift-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './add-gift-modal.component.html',
  styleUrl: './add-gift-modal.component.css',
})
export class AddGiftModalComponent {
  private readonly giftService = inject(GiftService);

  userId = input.required<string>();
  closeModal = output<boolean>();
  giftAdded = output<void>();

  gifts: Gift[] = [];

  newGift = {
    name: '',
    brand: '',
    price: null as number | null,
    url: '',
    photo: ''
  };

  errorMessage = '';
  isSubmittingGift = false;

  closeGiftModal(): void {
    this.closeModal.emit(false);
  }

  addGift(): void {
    this.errorMessage = '';

    if (!this.newGift.name.trim() || !this.newGift.price) {
      this.errorMessage = 'Gift name and price are required.';
      return;
    }

    this.isSubmittingGift = true;

    this.giftService.createGift(this.userId(), {
      name: this.newGift.name.trim(),
      brand: this.newGift.brand.trim(),
      price: this.newGift.price,
      url: this.newGift.url.trim(),
      photo: this.newGift.photo.trim() || null
    }).subscribe({
      next: () => {
        this.giftAdded.emit()

        this.newGift = {
          name: '',
          brand: '',
          price: null,
          url: '',
          photo: ''
        };

        this.isSubmittingGift = false;
        this.closeGiftModal();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to add the gift.';
        this.isSubmittingGift = false;
      }
    });
  }
}
