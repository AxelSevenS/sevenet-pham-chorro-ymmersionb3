import { HostListener, Injectable } from '@angular/core';
import { CartItem } from '../cart-item-model/cart-item.model';
import { integer } from 'src/app/shared/integer';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductPreviewCartComponent } from '../../product/product-preview-cart/product-preview-cart.component';
import { Product } from 'src/app/product/product-model/product.model';

@Injectable({
  	providedIn: 'root'
})
export class CartService {

	private static readonly localStorageKey = 'cartItems';


	private _items : CartItem[] = [];
	private _itemsSubject = new BehaviorSubject<CartItem[]>(JSON.parse(localStorage.getItem(CartService.localStorageKey) || '[]'));
	public items: Observable<CartItem[]> = this._itemsSubject.asObservable();


	constructor() {
		this._itemsSubject.subscribe(items => {
			this._items = items;
		});
	}

	ngOnInit() {
	}

	private updateCart = (newCart: CartItem[]) => {
		this._itemsSubject.next(newCart);
		localStorage.setItem(CartService.localStorageKey, JSON.stringify(newCart));
	}


	public getCartItems = () => {
		return this._items;
	}

	public clearCart = async () => {
		this.updateCart([]);
	}

	public updateQuantity = async (id: integer, quantity: integer) => {
		let inList = this._items.find(item => item.id === id);
		if (inList) {
			inList.quantity = quantity;
		}
		this.updateCart(this._items);
	}

	public addItem = (product: Product, quantity: integer = 1 as integer) => {
		let inList = this._items.find(item => item.id === product.id);
		if (inList) {
			inList.quantity = clamp(inList.quantity + quantity as integer, product.stock) as integer;
		} else {
			this._items.push({
				id: product.id,
				quantity: clamp(quantity, product.stock)
			});
		}
		this.updateCart(this._items);

		function clamp(num: integer, max: integer): integer {
			return num <= max ? num : max;
		}
	}

	public removeItem = async (id: integer, quantity: integer = 1 as integer) => {
		let inList = this._items.find(item => item.id === id);
		if (inList) {
			inList.quantity = (inList.quantity - quantity) as integer;
			if (inList.quantity <= 0) {
				this.deleteItem(id);
			}
		}
		this.updateCart(this._items);
	}

	public deleteItem = async (id: integer) => {
		this._items = this._items.filter(item => item.id !== id);
		this.updateCart(this._items);
	}
		
}
