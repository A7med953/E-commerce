import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth =inject(AuthService)
  if(req.url.includes('cart')||req.url.includes('orders'))
  req=req.clone({
    setHeaders:{
      token:auth.getToken()!
    }
  })

  return next(req);
};
