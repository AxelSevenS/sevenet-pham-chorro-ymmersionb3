import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CartComponent } from 'src/app/cart/cart-component/cart.component';
import { CartService } from 'src/app/cart/cart-service/cart.service';
import { GoogleAddressValidationService } from 'src/app/checkout/google-address-validation-service/google-address-validation.service';
import { ProductService } from 'src/app/product/product-service/product.service';

@Component({
	selector: 'checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
	address: string = ""
	locality: string = ""
	validatedAddress: any | null = null;

	private _cart: CartComponent | null = null;
		@ViewChild('checkoutCart') public set cart(cart: CartComponent) { this._cart = cart; }


	public get formattedAddress() { return this.validatedAddress?.result.address.formattedAddress; }
	public get mapUrl() {
		return this._sanitizer.bypassSecurityTrustResourceUrl(this.googleAddressValidationService.getEmbedMapUrl(this.formattedAddress));
	}
	public get isCartEmpty() { return this._cart?.cartItems.length === 0; }


	constructor(
		private googleAddressValidationService: GoogleAddressValidationService, 
		private productService: ProductService, 
		private cartService: CartService, 
		protected _sanitizer: DomSanitizer
	) { }


	public validateAddress = () => {
		this.googleAddressValidationService.validateAddress(this.address, this.locality)
		.subscribe(response => {
			if (response instanceof HttpErrorResponse) {
				return;
			}

			this.validatedAddress = response;
		});
	}

	public processPayment = async () => {
		if ( !this.validatedAddress ) {
			alert("Veuillez valider votre adresse avant de procéder au paiement.");
			return;
		}

		// CartService.cartProducts.forEach((product, cartItem) => {
		// 	const newStock = product.stock - cartItem.quantity;
		// 	this.productService.setStock(product.id, newStock);
		// });
		for (const cartItem of this._cart?.cartItems ?? []) {
			const product = await this.productService.getOrCacheProduct(cartItem.id);
			if (product === null) {
				return;
			}
			const newStock = product.stock - cartItem.quantity;
			console.log(`Setting stock of product ${product.id} to ${newStock}`);
			this.productService.setStock(product.id, newStock);
		}
		this.cartService.clearCart();
	}

}
