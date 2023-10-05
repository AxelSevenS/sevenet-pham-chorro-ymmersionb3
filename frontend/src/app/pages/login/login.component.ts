import { Component } from '@angular/core';
import { LoginService } from 'src/app/login/login-service/login.service';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/login/user-model/user.model';
import { Router } from '@angular/router';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {

	email = new FormControl('');
	password = new FormControl('');

	constructor(private loginService: LoginService, private router: Router) { }

  	submit = async () => {
		const email = this.email.getRawValue();
		const password = this.password.getRawValue();

		if (typeof email !== 'string' || typeof password !== 'string') {
			alert('Invalid input');
			return;
		}
		
		let loginResult: (string | Error) = await this.loginService.tryLogin(email, password);
		
		if (loginResult instanceof Error) {
			alert("Login failed");
			return;
		}

		localStorage.setItem('jwt', JSON.stringify(loginResult));
		this.router.navigate(['/']);
	}
}
