import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { ParseService } from "../services/parse.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
  declare user: any;
  constructor(private parseService: ParseService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.parseService.current().then((user) => {
      this.user = user;
      if (!user) {
        this.router.navigateByUrl("/login");
        return false;
      }
      return true;
    });
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.parseService.current().then((user) => {
      this.user = user;
      if (!user) {
        this.router.navigateByUrl("/login");
        return false;
      }
      return true;
    });
  }
}
