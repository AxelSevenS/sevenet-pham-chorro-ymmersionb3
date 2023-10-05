import { Component, HostListener } from '@angular/core';
import { faHome, faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartService } from './cart/cart-service/cart.service';
import { integer } from './shared/integer';
import { User } from './login/user-model/user.model';
import { LoginService } from './login/login-service/login.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
  	title = 'THF-ymmersion';
	totalCount: integer = 0 as integer;
	displayCart: boolean = false;

	get currentUser() { return LoginService.currentUser; }
	
	get userIcon() { return faUser; }
	get homeIcon() { return faHome; }
	get cartIcon() { return faCartShopping; }


	constructor(private cartService: CartService) {
		this.updateCartQuantity();
		LoginService.updateCurrentUser();
	}


	@HostListener('document:cartUpdated')
	updateCartQuantity = async () => {
		this.totalCount = await this.cartService.getTotalQuantity();
	}

	toggleCart = () => {
		this.displayCart = !this.displayCart;
	}
}
