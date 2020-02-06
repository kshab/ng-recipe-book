import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpParams
} from "@angular/common/http";
import { Observable } from 'rxjs';
import { take, exhaustMap } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return this.authService.currentUser.pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(request);
                }

                const modifiedRequest = request.clone({
                    params: new HttpParams().set("auth", user.token)
                });

                return next.handle(modifiedRequest);
            })
        );
    }
}
