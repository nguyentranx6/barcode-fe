import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {configApi} from "../../shared/constants/config-api";
import {AuthService} from "../services/auth/auth.service";

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.auth.getAuthorizationToken();
    let requestOption:any = {};
    if(authToken) {
      requestOption.setHeaders = {
        Authorization: `Bearer ${authToken}`,
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
      }
    }
    request = request.clone(requestOption);
    return next.handle(request)
  }
}
