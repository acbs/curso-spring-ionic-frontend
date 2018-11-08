import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthService {

  constructor(public http: HttpClient){
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

}
