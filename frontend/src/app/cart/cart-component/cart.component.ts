import { Component, Host, HostListener, OnInit } from '@angular/core';
import { CartService } from '../cart-service/cart.service';
import { CartItem } from '../cart-item-model/cart-item.model';
import { integer } from 'src/app/shared/integer';
import { ProductService } from 'src/app/product/product-service/product.service';
import { ProductPreviewCartComponent } from '../product-preview-cart/product-preview-cart.component';

@Component({
	selector: 'cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent {

	cartItems: CartItem[] = [];
	get totalPrice(): number { return CartService.totalPrice; }

	constructor(private cartService: CartService, private productService: ProductService) {
		this.updateCart();
	}

	@HostListener('document:cartUpdated')
	updateCart = async () => {
		this.cartItems = await this.cartService.getCartItems();
	}

	removeItem = async (cartItem: CartItem) => {
		this.cartItems = await this.cartService.deleteItem(cartItem.id);
	}

	updateQuantity = async (cartItem: CartItem, quantity: integer) => {
		this.cartItems = await this.cartService.updateQuantity(cartItem.id, quantity);
	}
}
