import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService, public alertCtrl: AlertController) {
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
        //console.log(errorObj);

        switch(errorObj.status) {

          case 401:
            this.handle401();
            break;

          case 403:
            this.handle403();
            break;

          default:
            this.handleDefaultEror(errorObj);
        }

        return Observable.throw(errorObj); // Irá propagar o error para o controlador
      }) as any;
    }

  // Trata o error 403 (Token inválido)
  handle403() {
    this.storage.setLocalUser(null); // Removendo o obj do storage, caso ele ainda exista
  }

  // Trata erro 401 (Erro de autenticação)
  handle401() {
    let alert = this.alertCtrl.create({
      title: 'Erro 401: falha de autenticação',
      message: 'Email ou senha incorretos',
      enableBackdropDismiss: false, // Indica que para sair do alert é preciso apertar no botão do alert e não fora
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  // Trata outros erros
  handleDefaultEror(errorObj) {
    let alert = this.alertCtrl.create({
      title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
      message: errorObj.message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }
}

// Exigência do framework para criar um interceptors (https://angular.io/guide/http)
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
