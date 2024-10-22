// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SharedState } from './shared-state';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  private loggedIn = false;

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (SharedState.loggedIn) {
      return true;
    } else {
      this.router.navigate(['/home']); 
      return false;
    }
  }

}
