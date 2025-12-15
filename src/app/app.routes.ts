import { Routes } from '@angular/router';
import { NavigationdasboardComponent } from './navigationdasboard/navigationdasboard.component';
import { Formularioproducto } from './components/productos/productos';
import { LoginComponent } from './component/login/login';

export const routes: Routes = [
  {
    path: '',
    component: NavigationdasboardComponent, // ✅ principal
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'productos', component: Formularioproducto },
    { path: 'login', component: LoginComponent },
    ],
  },
];
