import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Gift, CreateGift} from '../models/gift.model';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private readonly apiUrl = 'http://localhost:3000/api/users';

  constructor(private readonly http: HttpClient) {}

  getGiftsByUserId(id: string): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.apiUrl}/${id}/gifts`);
  }

  createGift(userId: string,  gift: CreateGift): Observable<Gift> {
    return this.http.post<Gift>(`${this.apiUrl}/${userId}/gifts`, gift);
  }

  deleteGift(userId: number | undefined, giftId: number): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${userId}/gifts`, {
      params: { giftId: giftId.toString() }
    });
  }

  toggleReservation(userId: number | undefined, giftId: number, isReserved: boolean): Observable<Object> {
    const url = `${this.apiUrl}/${userId}/gifts`;

    return this.http.patch(
      url,
      { reserved: isReserved },
      { params: { giftId: giftId.toString() } }
    );
  }}
