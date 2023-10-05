import { Component, Host, HostListener } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartService } from './cart/cart-service/cart.service';
import { integer } from './shared/integer';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
  	title = 'THF-ymmersion';
	userIcon = faUser;
	totalCount: integer = 0 as integer;
	displayCart: boolean = false;

	get cartIcon() { return faCartShopping; }


	constructor(private cartService: CartService) {
		this.updateCartQuantity();
	}


	@HostListener('document:cartUpdated')
	updateCartQuantity = async () => {
		this.totalCount = await this.cartService.getTotalQuantity();
	}


	toggleCart = () => {
		this.displayCart = !this.displayCart;
	}
}
