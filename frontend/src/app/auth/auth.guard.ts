import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs";

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.user.pipe(take(1), map(user => {
        const isAuth = !!user;
        if (isAuth) {
            return true;
        }
        return router.createUrlTree(['/auth']);
    })
    );
}
export const canActivate2: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.user.pipe(take(1), map(user => {
        const isAuth = !!user;
        if (isAuth) {
            return false;
        }
        return router.createUrlTree(['/branches']);
    })
    );
}