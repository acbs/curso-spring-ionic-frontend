import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService) {
  }

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

        switch(errorObj.status) {
          case 403:
          this.handle403();
          break;
        }

        return Observable.throw(errorObj); // Irá propagar o error para o controlador
      }) as any;
  }

  // Utilizado para tratar o error 403 (Token inválido)
  handle403() {
    this.storage.setLocalUser(null); // Removendo o obj do storage, caso ele ainda exista
  }

}

// Exigência do framework para criar um interceptors (https://angular.io/guide/http)
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
