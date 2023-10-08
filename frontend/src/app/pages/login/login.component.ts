import { Component } from '@angular/core';
import { LoginService } from 'src/app/login/login-service/login.service';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/login/user-model/user.model';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {

	public email = new FormControl('');
	public password = new FormControl('');

	public get currentUser() { return LoginService.currentUser; }


	constructor(
		private loginService: LoginService, 
		private router: Router
	) { }


  	public submit = async () => {
		const email = this.email.getRawValue();
		const password = this.password.getRawValue();

		if (typeof email !== 'string' || typeof password !== 'string') {
			alert('Invalid input');
			return;
		}

		this.loginService.tryLogin(email, password)
			.subscribe(loginResult => {
				if (loginResult instanceof HttpErrorResponse) {
					alert(`Erreur lors de la connexion : ${loginResult.error.message}`);
					return;
				}

				this.loginService.setJWT(loginResult);
				this.router.navigate(['/']);
			}
		);
	}
	
	public logout = () => {
		this.loginService.resetJWT();
		this.router.navigate(['/']);
	}
}
