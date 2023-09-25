import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate} from '@angular/router';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    /*const profile = this.authService.getProfileSelected()

    if (profile && profile.codigo == CodigoPerfil.CONTROL_CALIDAD) return true

    this.router.navigate(['login'])*/
    return true;
  }
}
