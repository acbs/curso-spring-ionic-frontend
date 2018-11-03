import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { CategoriaDTO } from "../../models/categoria.dto";
import { Observable } from "rxjs/Rx"; // Alterado o Observable por RX, pois iremos precisar

@Injectable() // Para que a classe seja injetada em outras classes
export class CategoriaService {

  constructor(public http: HttpClient) {

  }

  findAll() : Observable<CategoriaDTO[]> { // Observable fica aguardando a respostas da requisição
    return this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseURL}/categorias`);
  }

}
