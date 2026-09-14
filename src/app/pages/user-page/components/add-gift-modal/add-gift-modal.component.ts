import {Component, inject, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
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
  private readonly giftService: GiftService = inject(GiftService);

  userId: InputSignal<string> = input.required<string>();
  closeModal: OutputEmitterRef<boolean> = output<boolean>();
  giftAdded: OutputEmitterRef<void> = output<void>();

  gifts: Gift[] = [];

  newGift: {name: string, brand: string, price: number | null, url: string, photo: string} = {
    name: '',
    brand: '',
    price: null as number | null,
    url: '',
    photo: ''
  };

  errorMessage: string = '';
  isSubmittingGift: boolean = false;

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
      next: (): void => {
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
      error: (error: any): void => {
        console.error(error);
        this.errorMessage = 'Unable to add the gift.';
        this.isSubmittingGift = false;
      }
    });
  }
}
