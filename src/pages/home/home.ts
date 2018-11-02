import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

// Informa q essa clase é uma página e poderá ser referenciada pelo nome entre aspas
// Tornando ela mais flexível para trabalhar no modo Lazy loading
@IonicPage()
// Faz essa classe ser o controlador da view
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

}
