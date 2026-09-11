import { Routes } from '@angular/router';
import {UserPageComponent} from './pages/user-page/user-page.component';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {LoginModalComponent} from './shared/components/login/login-modal.component';
import {authGuard} from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [authGuard],
    title: 'Home',
  },
  {
    path: 'users/:id',
    component: UserPageComponent,
    canActivate: [authGuard],
    title: 'User',
  },
  {
    path: 'login',
    component: LoginModalComponent,
    title: 'Login',
  }
];
