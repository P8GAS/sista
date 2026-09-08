import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Gift} from '../models/gift.model';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private readonly apiUrl = 'http://localhost:3000/api/users';

  constructor(private readonly http: HttpClient) {}

  getGiftsByUserId(id: string): Observable<Gift[]> {
    return this.http.get<Gift[]>(`${this.apiUrl}/${id}/gifts`);
  }
}
