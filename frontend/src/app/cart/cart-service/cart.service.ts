import { HostListener, Injectable } from '@angular/core';
import { CartItem } from '../cart-item-model/cart-item.model';
import { integer } from 'src/app/shared/integer';
import { Observable } from 'rxjs';
import { ProductPreviewCartComponent } from '../product-preview-cart/product-preview-cart.component';
import { Product } from 'src/app/product/product-model/product.model';

@Injectable({
  	providedIn: 'root'
})
export class CartService {

	static localStorageKey = 'cartItems';

	items : CartItem[];
	private static _totalPrice: number = 0;
	public static cartProducts: [CartItem, Product][] = [];

	static get totalPrice(): number { return CartService._totalPrice; }


	constructor() {
		this.items = JSON.parse(localStorage.getItem(CartService.localStorageKey) || '[]');
		this.updateCart();
	}


	private updateCart = async () => {
		document.dispatchEvent(new CustomEvent('cartUpdated', {
			detail: {
				cartItems: this.items
			}
		}));
	}

	public static updateTotalPrice = async () => {	
		CartService._totalPrice = 0;
		CartService.cartProducts.forEach(([cartItem, product]) => {
			CartService._totalPrice += cartItem.quantity * product.price;
		});
		CartService._totalPrice = Math.round(CartService._totalPrice * 100) / 100;
	}

	public async getTotalQuantity(): Promise<integer> {
		return new Promise<integer>(resolve => {
			resolve(this.items.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0) as integer);
		});
	}


	public async getCartItems(): Promise<CartItem[]> {
		return new Promise<CartItem[]>(resolve => {
			resolve(this.items);
		});
	}

	public async updateQuantity(id: integer, quantity: integer): Promise<CartItem[]> {
		return new Promise<CartItem[]>(resolve => {

			let inList = this.items.find(item => item.id === id);
			if (inList) {
				inList.quantity = quantity;
			}
			localStorage.setItem(CartService.localStorageKey, JSON.stringify(this.items));
			this.updateCart();
			CartService.updateTotalPrice();

			resolve(this.items);
		});
	}

	public async addItem(id: integer, quantity: integer = 1 as integer): Promise<CartItem[]> {
		return new Promise<CartItem[]>(resolve => {

			let inList = this.items.find(item => item.id === id);
			if (inList) {
				inList.quantity = (inList.quantity + quantity) as integer;
			} else {
				this.items.push({
					id: id,
					quantity: quantity
				});
			}
			localStorage.setItem(CartService.localStorageKey, JSON.stringify(this.items));
			this.updateCart();
			CartService.updateTotalPrice();

			resolve(this.items);
		});
	}

	public async removeItem(id: integer, quantity: integer = 1 as integer): Promise<CartItem[]> {
		return new Promise<CartItem[]>(resolve => {

			let inList = this.items.find(item => item.id === id);
			if (inList) {
				inList.quantity = (inList.quantity - quantity) as integer;
				if (inList.quantity <= 0) {
					this.items = this.items.filter(item => item.id !== id);
				}
			}
			localStorage.setItem(CartService.localStorageKey, JSON.stringify(this.items));
			this.updateCart();
			CartService.updateTotalPrice();

			resolve(this.items);
		});
	}

	public async deleteItem(id: integer): Promise<CartItem[]> {
		return new Promise<CartItem[]>(resolve => {

			this.items = this.items.filter(item => item.id !== id);
			localStorage.setItem(CartService.localStorageKey, JSON.stringify(this.items));
			this.updateCart();
			CartService.updateTotalPrice();

			resolve(this.items);
		});
	}
		
}
