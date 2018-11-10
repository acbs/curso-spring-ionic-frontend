import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req) // Passando a requisição
      .catch((error, caught) => { // catch onde é capturado o error

        let errorObj = error;
        if (errorObj.error) {
          errorObj = errorObj.error;
        }
        if (!errorObj.status) { // Se o status não vim, significa que não é um json
          errorObj = JSON.parse(errorObj); // Irá converter para json
        }
        console.log("Erro detectado pelo interceptor:");
        console.log(errorObj);

        return Observable.throw(errorObj); // Irá propagar o error
      }) as any;
  }
}

// Exigência do framework para criar um interceptors (https://angular.io/guide/http)
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
