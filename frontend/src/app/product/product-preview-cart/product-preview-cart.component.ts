import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product-model/product.model';
import { environment } from '../../../../../environment';
import { integer } from '../../shared/integer';
import { ProductService } from '../product-service/product.service';
import { CartItem } from '../../cart/cart-item-model/cart-item.model';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../cart/cart-service/cart.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'product-preview-cart',
  templateUrl: './product-preview-cart.component.html',
  styleUrls: ['./product-preview-cart.component.scss']
})
export class ProductPreviewCartComponent implements OnInit, OnDestroy {

	public static totalPrice: number = 0;


	private _cartItem: CartItem = { id: -1 as integer, quantity: 0 as integer };
		public get cartItem(): CartItem { return this._cartItem; }
		@Input() public set cartItem(cartItem: CartItem) { this._cartItem = cartItem; }

	public product: Product | null = null;


	/**
	 * @description Callback function to update the quantity of a cart item
	 * @memberof ProductPreviewCartComponent
	 * @param {CartItem} cartItem The cart item to update
	 * @param {Product} product The product data of the cart item to update
	 * @param {integer} quantity The new quantity
	 */
	_updateQuantityCallback: ((cartItem: CartItem, product: Product, quantity: integer) => void) | null = null;
		get updateQuantityCallback(): ((cartItem: CartItem, product: Product, quantity: integer) => void) { 
			if (this._updateQuantityCallback === null) {
				return (cartItem: CartItem, product: Product, quantity: integer) => {};
			}
			return this._updateQuantityCallback;
		}
		@Input() set updateQuantityCallback(updateQuantityCallback: ((cartItem: CartItem, product: Product, quantity: integer) => void)) { this._updateQuantityCallback = updateQuantityCallback; }
	
	/**
	 * @description Callback function to remove a cart item
	 * @memberof ProductPreviewCartComponent
	 * @param {CartItem} cartItem The cart item to remove
	 * @param {Product} product The product data of the cart item to remove
	 */
	_removeItemCallback: ((cartItem: CartItem, product: Product) => void) | null = null;
		get removeItemCallback(): ((cartItem: CartItem, product: Product) => void) { 
			if (this._removeItemCallback === null) {
				return (cartItem: CartItem, product: Product) => {};
			}
			return this._removeItemCallback;
		}
		@Input() set removeItemCallback(removeItemCallback: ((cartItem: CartItem, product: Product) => void)) { this._removeItemCallback = removeItemCallback; }

	
	public get urlBase() { return environment.domainUrl }

	public get trashIcon() { return faTrash; }

	
	public constructor(
		private productService: ProductService
	) {}



	private getProduct = async () => {
		if (this.cartItem.id === -1) {
			return;
		}

		this.product = await this.productService.getOrCacheProduct(this.cartItem.id);
	}


	ngOnInit(): void {
		this.getProduct();
	}

	ngOnDestroy(): void {
		// CartService.cartProducts.delete(this.cartItem);
		// CartService.updateTotalPrice();
	}
	
}
