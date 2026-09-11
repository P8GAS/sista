import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CreateUserPayload, User} from '../models/user.model';

export interface LoginData {
  name: string;
  surname: string;
  password: string;
}

export interface ConnectedUser {
  id: number;
  name: string;
  surname: string;
  avatar: string | null;
}

export interface LoginResponse {
  token: string;
  user: ConnectedUser;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:3000/api/users';

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(this.apiUrl, payload);
  }

  updateUser(id: string, payload: CreateUserPayload): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, payload);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`http://localhost:3000/api/login`, data);
  }
}
