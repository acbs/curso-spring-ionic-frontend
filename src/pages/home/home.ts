import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

// Informa q essa clase é uma página e poderá ser referenciada pelo nome entre aspas
// Tornando ela mais flexível para trabalhar no modo Lazy loading
@IonicPage()
// Faz essa classe ser o controlador da view
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  }

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService) {

  }

  // https://ionicframework.com/docs/api/navigation/NavController/
  // Quando fór entrar na página (home), irá desabilitar o menu
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  // Quando sair da página (home), irá habilitar o menu
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  login() {
    // Chamando outra página, o push ele vai empilhar uma página na outra (Colocando o btn voltar)
    // setRoot chama outra tela sem empilhar
    this.auth.authenticate(this.creds)
      .subscribe(response => { // Se for tudo ok, pega o token
        console.log(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      }),
      error => {};
    }
}
