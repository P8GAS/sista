import { Routes } from '@angular/router';
import {UserPageComponent} from './pages/user-page/user-page.component';
import {HomePageComponent} from './pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Home',
  },
  {
    path: 'users/:id',
    component: UserPageComponent,
    title: 'User',
  }
];
