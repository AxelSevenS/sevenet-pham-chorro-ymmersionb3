import { Component, HostListener, ViewChild } from '@angular/core';
import { faHome, faUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartService } from './cart/cart-service/cart.service';
import { integer } from './shared/integer';
import { User } from './login/user-model/user.model';
import { LoginService } from './login/login-service/login.service';
import { CartComponent } from './cart/cart-component/cart.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
  	public title = 'THF-ymmersion';
	public isCartOpen: boolean = false;

	private _cart: CartComponent | null = null;
		@ViewChild('sidebarCart') public set cart(cart: CartComponent) { this._cart = cart; }

	get currentUser() { return LoginService.currentUser; }
	
	get totalCartQuantity() {
		return this._cart?.totalQuantity ?? 0 
	}
	get userIcon() { return faUser; }
	get homeIcon() { return faHome; }
	get cartIcon() { return faCartShopping; }


	constructor() {
		LoginService.refreshUser();
	}

	toggleCart = () => {
		this.isCartOpen = !this.isCartOpen;
	}
}
