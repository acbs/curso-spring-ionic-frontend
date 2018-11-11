import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';
import { CartService } from "./domain/cart.service";

@Injectable()
export class AuthService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    public http: HttpClient,
    public storage: StorageService,
    public cartService: CartService){
  }

  authenticate(creds : CredenciaisDTO) {
    return this.http.post(
      `${API_CONFIG.baseURL}/login`,
      creds,
      {
        observe: 'response', // Para ter acesso ao Header
        responseType: 'text' // Para evitar error de parse de Json em um corpo (body) vazio
      });
  }

  refreshToken() {
    return this.http.post(
      `${API_CONFIG.baseURL}/auth/refresh_token`,
        {}, // O token é incluído automaticamente na requisição pelo interceptor
        {
            observe: 'response',
            responseType: 'text'
        });
  }

  successfulLogin(authorizationValue : string) {
    // Para remover o prefixo (Bearer) do token
    let tok = authorizationValue.substring(7);
    let user : LocalUser = {
        token: tok,
        email: this.jwtHelper.decodeToken(tok).sub // Pegando o email do token
    };
    this.storage.setLocalUser(user); // Guardando o usuário no localStorage
    this.cartService.createOrClearCart(); // Quando fizer o login, irá limpar o carrinho
  }

  logout() {
    this.storage.setLocalUser(null); // Removendo do localStorage o usuário
  }
}
