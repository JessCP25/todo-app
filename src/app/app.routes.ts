import { Routes } from '@angular/router';
import { LabsComponent } from './pages/labs/labs.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'labs',
    component: LabsComponent
  }
];
