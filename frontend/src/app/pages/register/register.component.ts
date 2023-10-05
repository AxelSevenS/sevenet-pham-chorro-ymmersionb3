import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { LoginService } from 'src/app/login/login-service/login.service';
import { User } from 'src/app/login/user-model/user.model';


@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	constructor(private loginService: LoginService, private router: Router) { }

	email = new FormControl('');
	password = new FormControl('');

	submit = async () => {
		const email = this.email.getRawValue();
		const password = this.password.getRawValue();
		// const email = document.getElementById('register-email'.value);
		// const password = document.getElementById('register-password');
		if (email === '' || password === '' || email === null || password === null) {
			alert('Invalid input');
			return;
		} else {
			if (password.length < 8) {
				alert('Password must be at least 8 characters long');
				return;
			}
			if (email?.includes('@') === false) {
				alert('Invalid email');
				return;
			}

		}
		
		if (typeof email !== 'string' || typeof password !== 'string') {
			alert('Invalid input');
			return;
		}
		
		let loginResult: (User | Error) = await this.loginService.tryRegister(email, password);
		if (loginResult instanceof Error) {
			alert("Register failed");
			return;
		}

		this.router.navigate(['/login']);
    };
}

