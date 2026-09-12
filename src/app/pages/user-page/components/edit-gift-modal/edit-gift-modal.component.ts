import {Component, inject, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {UserService} from '../../../../shared/services/user.service';
import {User} from '../../../../shared/models/user.model';
import {GiftService} from '../../../../shared/services/gift.service';
import {Gift} from '../../../../shared/models/gift.model';

@Component({
  selector: 'app-edit-gift-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-gift-modal.component.html',
  styleUrl: './edit-gift-modal.component.css',
})
export class EditGiftModalComponent {
  private giftService: GiftService = inject(GiftService);

  gift: InputSignal<Gift> = input.required<Gift>();
  userId: InputSignal<number | undefined> = input.required<number | undefined>();

  closeModal: OutputEmitterRef<boolean> = output<boolean>();
  giftUpdated: OutputEmitterRef<Gift> = output<Gift>();

  isSubmitting: boolean = false;

  giftData: {name: string, brand: string, price: number, url: string, photo: string} = {
    name: '',
    brand: '',
    price: 0,
    url: '',
    photo: ''
  };

  ngOnInit(): void {
    const current = this.gift();
    if (current) {
      this.giftData = {
        name: current.name,
        brand: current.brand,
        price: current.price,
        url: current.url,
        photo: current.photo || ''
      };
    }
  }

  onEditGift(): void {
    this.isSubmitting = true;

    this.giftService.editGift(this.userId(), this.gift().id, this.giftData).subscribe({
      next: (updatedGift: Gift) => {
        this.isSubmitting = false;
        this.giftUpdated.emit(updatedGift);
        this.onClose();
      },
      error: (err) => {
        console.error('Error while editing gift', err);
        this.isSubmitting = false;
      }
    });
  }

  onClose(): void {
    this.closeModal.emit(false);
  }
}
