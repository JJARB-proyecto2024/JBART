import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { IRole } from "../interfaces";

@Injectable({
    providedIn: 'root',
  })
export class UserBrandRoleGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean {
      const hasRole = this.authService.hasRole(IRole.userBrand);
  
      if (!hasRole) {
        this.router.navigate(['access-denied']);
        return false;
      }
      return true;
    }
}