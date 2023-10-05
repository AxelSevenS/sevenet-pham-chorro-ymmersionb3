import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../product/product-model/product.model';
import { environment } from '../../shared/environment';
import { integer } from '../../shared/integer';
import { ProductService } from '../../product/product-service/product.service';
import { CartItem } from '../cart-item-model/cart-item.model';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../cart-service/cart.service';


@Component({
  selector: 'product-preview-cart',
  templateUrl: './product-preview-cart.component.html',
  styleUrls: ['./product-preview-cart.component.scss']
})
export class ProductPreviewCartComponent implements OnInit, OnDestroy {

	public static totalPrice: number = 0;

	private _cartItem: CartItem = { id: -1 as integer, quantity: 0 as integer };
	_updateQuantityCallback: ((cartItem: CartItem, quantity: integer) => void) | null = null;
	_removeItemCallback: ((cartItem: CartItem) => void) | null = null;
	product: Product | null = null;

	@Input() set updateQuantityCallback(updateQuantityCallback: ((cartItem: CartItem, quantity: integer) => void)) { this._updateQuantityCallback = updateQuantityCallback; }
	get updateQuantityCallback(): ((cartItem: CartItem, quantity: integer) => void) { 
		if (this._updateQuantityCallback === null) {
			return (cartItem: CartItem, quantity: integer) => {};
		}
		return this._updateQuantityCallback;
	}
	
	@Input() set removeItemCallback(removeItemCallback: ((cartItem: CartItem) => void)) { this._removeItemCallback = removeItemCallback; }
	get removeItemCallback(): ((cartItem: CartItem) => void) { 
		if (this._removeItemCallback === null) {
			return (cartItem: CartItem) => {};
		}
		return this._removeItemCallback;
	}

	@Input() set cartItem(cartItem: CartItem) { this._cartItem = cartItem; }
	get cartItem(): CartItem { return this._cartItem; }
	
	get urlBase() { return environment.domainUrl }

	get trashIcon() { return faTrash; }

	
	public constructor(private productService: ProductService, private router: Router) {
	}

	private getProduct = async (): Promise<void> => {
		if (this.cartItem.id != -1) {
			this.product = await this.productService.getProduct(this.cartItem.id);
			CartService.cartProducts.push([this.cartItem, this.product]);
			CartService.updateTotalPrice();
		} else {
			this.router.navigate(['/404']);
		}
	}


	ngOnInit(): void {
		this.getProduct();
	}

	ngOnDestroy(): void {
		CartService.cartProducts = CartService.cartProducts.filter(([cartItem, product]) => cartItem.id !== this.cartItem.id);
		CartService.updateTotalPrice();
	}
	
}
