import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Gift, CreateGift} from '../models/gift.model';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private readonly apiUrl = '/api/users';

  constructor(private readonly http: HttpClient) {}

  getGiftsByUserId(id: string): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.apiUrl}/${id}/gifts`, {
      withCredentials: true
    });
  }

  createGift(userId: string,  gift: CreateGift): Observable<Gift> {
    return this.http.post<Gift>(`${this.apiUrl}/${userId}/gifts`, gift, {
      withCredentials: true
    });
  }

  deleteGift(userId: number | undefined, giftId: number): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${userId}/gifts`, {
      withCredentials: true,
      params: { giftId: giftId.toString() }
    });
  }

  toggleReservation(userId: number | undefined, giftId: number, isReserved: boolean): Observable<Object> {
    const url = `${this.apiUrl}/${userId}/gifts/reserve`;

    return this.http.patch(
      url,
      { reserved: isReserved },
      { withCredentials: true, params: { giftId: giftId.toString() } }
    );
  }

  editGift(
    userId: number | undefined,
    giftId: number,
    giftData: { name: string; brand: string; price: number; url: string; photo: string }
  ): Observable<Gift> {
    const url = `${this.apiUrl}/${userId}/gifts`;

    return this.http.patch<Gift>(
      url,
      giftData,
      { withCredentials: true, params: { giftId: giftId.toString() } }
    );
  }
}

