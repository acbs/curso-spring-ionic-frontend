import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { Cart } from '../../models/cart';
import { ProdutoDTO } from '../../models/produto.dto';

@Injectable()
export class CartService {

  constructor(public storage: StorageService) {
  }

  // Criando um carrinho vazio e armazenando no localStorage
  createOrClearCart() : Cart {
    let cart: Cart = {items: []};
    this.storage.setCart(cart);
    return cart;
  }

  // Retorna o cart que já existe no localStorage ou cria um novo cart vazio
  getCart() : Cart {
    let cart: Cart = this.storage.getCart();
    if (cart == null) {
      cart = this.createOrClearCart();
    }
    return cart;
  }

  addProduto(produto: ProdutoDTO) : Cart {
    let cart = this.getCart(); // Pegando o cart
    // Encontrar na lista de itens do cart, cujo produto tenha o mesmo id do produto que está querendo adicionar
    let position = cart.items.findIndex(x => x.produto.id == produto.id); // findIndex - Para pegar a posição do elemento
    // Se não existir irá retorna -1 (Padrão do findIndex)
    if (position == -1) {
      cart.items.push({quantidade: 1, produto: produto});
    }
    this.storage.setCart(cart);
    return cart;
  }

  removeProduto(produto: ProdutoDTO) : Cart {
    let cart = this.getCart();
    let position = cart.items.findIndex(x => x.produto.id == produto.id);
    if (position != -1) {
      cart.items.splice(position, 1); // Para remover o carrinho, 1 para indicar q é uma remoção
    }
    this.storage.setCart(cart); // Armazenando o carrinho atualizado
    return cart;
  }

  increaseQuantity(produto: ProdutoDTO) : Cart {
    let cart = this.getCart();
    let position = cart.items.findIndex(x => x.produto.id == produto.id);
    if (position != -1) {
      cart.items[position].quantidade++;
    }
    this.storage.setCart(cart);
    return cart;
  }

  decreaseQuantity(produto: ProdutoDTO) : Cart {
    let cart = this.getCart();
    let position = cart.items.findIndex(x => x.produto.id == produto.id);
    if (position != -1) {
      cart.items[position].quantidade--;
      if (cart.items[position].quantidade < 1) { // Para evitar a quantidade negativa, irá excluir o produto do cart
        cart = this.removeProduto(produto);
      }
    }
    this.storage.setCart(cart);
    return cart;
  }

  total() : number {
    let cart = this.getCart();
    let sum = 0;
    for (var i=0; i<cart.items.length; i++) {
      sum += cart.items[i].produto.preco * cart.items[i].quantidade;
    }
    return sum;
  }
}
