import { Component, Input } from '@angular/core';
import { Product } from '../product-model/product.model';
import { environment } from '../../../../../environment';
import { CartService } from 'src/app/cart/cart-service/cart.service';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'product-preview-store',
	templateUrl: './product-preview-store.component.html',
	styleUrls: ['./product-preview-store.component.scss']
})
export class ProductPreviewStoreComponent {

	private _product: (Product | null) = null;
		public get product(): Product { return this._product as Product; }
		@Input() public set product(product: (Product | null)) { this._product = product; }

	public get urlBase() { return environment.domainUrl }

	public get cartIcon() { return faCartShopping; }


	public constructor(
		private cartService: CartService
	) {}


	/**
	 * @description Add the product to the cart
	 * @returns {Promise<void>}
	 * @memberof ProductPreviewStoreComponent
	 */
	public addToCart = async () => {
		await this.cartService.addItem(this.product);
	}

}
