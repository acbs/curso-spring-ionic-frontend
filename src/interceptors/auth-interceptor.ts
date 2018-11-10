import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { API_CONFIG } from '../config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let localUser = this.storage.getLocalUser();

    // O Headers Authorization será enviado apenas para API, quando for uma requisição para o storage da amazon, não será adicionado.
    // Para testar se a requisição é para API (Comparando a baseURL com a url requisitada)
    let N = API_CONFIG.baseURL.length;
    let requestToAPI = req.url.substring(0, N) == API_CONFIG.baseURL;

    if(localUser && requestToAPI) { // Se existe o token no localStorage, será inserido o cabeçalho na requisição
      // Criando um clone da requisição original acrescentando o Headers Authorization (https://angular.io/guide/http)
      const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)});
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
