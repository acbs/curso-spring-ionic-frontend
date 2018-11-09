import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage_keys.config";

@Injectable()
export class StorageService {

  getLocalUser() : LocalUser {
    // Pegando o valor no localStorage com a chave localUser
    let usr = localStorage.getItem(STORAGE_KEYS.localUser);
    if (usr == null) { // Se não existir no localStorage irá retorna nulo
      return null;
    } else {
      return JSON.parse(usr); // O localStorage armazena string, dai é preciso converter para json
    }
  }

  setLocalUser(obj : LocalUser) {
    if (obj == null) {
      localStorage.removeItem(STORAGE_KEYS.localUser);
    } else {
      // Armazenando no localStorage, convertendo de json para string
      localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
    }
  }
}
