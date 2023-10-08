import { Component, HostListener, Input, OnInit, ViewChildren } from '@angular/core';
import { CartService } from '../cart-service/cart.service';
import { CartItem } from '../cart-item-model/cart-item.model';
import { integer } from 'src/app/shared/integer';
import { ProductService } from 'src/app/product/product-service/product.service';
import { faCartShopping, faShoppingBasket, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/product/product-model/product.model';
import { ProductPreviewCartComponent } from 'src/app/product/product-preview-cart/product-preview-cart.component';

@Component({
	selector: 'cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent {

	cartItems: CartItem[] = [];
	
	private _checkoutButton: boolean = true;
		public get checkoutButton(): boolean { return this._checkoutButton; }
		@Input() public set checkoutButton(checkoutButton: boolean) { this._checkoutButton = checkoutButton; }

	// @ViewChildren(ProductPreviewCartComponent) cartItemComponents: ProductPreviewCartComponent[] = [];
	
	private _totalPrice: number = 0;
		public get totalPrice(): number { return this._totalPrice; }

	private _totalQuantity: integer = 0 as integer;
		public get totalQuantity(): integer { return this._totalQuantity; }


	public get cartIcon() { return faCartShopping; }
	public get checkoutIcon() { return faShoppingBasket; }
	public get trashIcon() { return faTrash; }


	constructor(
		private cartService: CartService,
		private productService: ProductService
	) {
		this.updateCart();
		this.cartService.items.subscribe(cartItems => {
			this.cartItems = cartItems;
			this.updateTotalPrice();
			this.updateTotalQuantity();
		});
	}

	private updateTotalPrice = async (): Promise<number> => {
		this._totalPrice = 0;
		for (const cartItem of this.cartItems) {
			const product = await this.productService.getOrCacheProduct(cartItem.id);
			if (product === null) {
				continue;
			}
			if (this.cartItems.find(item => item.id === product?.id) === undefined) {
				continue;
			}
			this._totalPrice += product.price * cartItem.quantity;
		}
		this._totalPrice = Math.round(this._totalPrice * 100) / 100;
		return this._totalPrice;
	}

	private updateTotalQuantity = async (): Promise<integer> => {
		this._totalQuantity = 0 as integer;
		for (const cartItem of this.cartItems) {
			const product = await this.productService.getOrCacheProduct(cartItem.id);
			if (product === null) {
				continue;
			}
			if (this.cartItems.find(item => item.id === product.id) === undefined) {
				continue;
			}
			this._totalQuantity = this._totalQuantity + cartItem.quantity as integer;
		}
		return this._totalQuantity;
	}

	public updateCart = async () => {
		this.cartService.getCartItems();
	}

	public removeItem = async (cartItem: CartItem, product: Product) => {
		this.cartService.deleteItem(cartItem.id);
	}

	public updateQuantity = async (cartItem: CartItem, product: Product, quantity: integer) => {
		this.cartService.updateQuantity(cartItem.id, clamp(quantity, product.stock));

		function clamp(num: integer, max: integer): integer {
			return num <= max ? num : max;
		}
	}

	public clearCart = async () => {
		this.cartService.clearCart();
	}
}
