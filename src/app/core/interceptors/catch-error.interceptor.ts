import { HttpInterceptorFn } from '@angular/common/http';

export const catchErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
