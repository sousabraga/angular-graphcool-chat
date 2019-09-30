import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { LoginRoutingModule } from './login-routing.module';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: LoginRoutingModule
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated;
  }

}
