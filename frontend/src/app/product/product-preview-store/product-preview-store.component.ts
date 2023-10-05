import { Component, Input } from '@angular/core';
import { Product } from '../product-model/product.model';
import { environment } from '../../shared/environment';
import { CartService } from 'src/app/cart/cart-service/cart.service';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'product-preview-store',
	templateUrl: './product-preview-store.component.html',
	styleUrls: ['./product-preview-store.component.scss']
})
export class ProductPreviewStoreComponent {

	private _product: (Product | null) = null;
	get product(): Product { return this._product as Product; }
	@Input() set product(product: (Product | null)) { this._product = product; }

	get urlBase() { return environment.domainUrl }

	get cartIcon() { return faCartShopping; }


	public constructor(private cartService: CartService) {}


	addToCart = async () => {
		await this.cartService.addItem(this.product.id);
	}

}
