import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { LoginService } from 'src/app/login/login-service/login.service';
import { User } from 'src/app/login/user-model/user.model';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	constructor(private loginService: LoginService, private router: Router) { }

	public email = new FormControl('');
	public password = new FormControl('');

	public submit = () => {
		const email = this.email.getRawValue();
		const password = this.password.getRawValue();
		
		if (email === '' || password === '' || email === null || password === null) {
			alert('Veuillez remplir tous les champs');
			return;
		}

		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
		if (!passwordRegex.test(password)) {
			alert('Le mot de passe doit contenir au moins 8 caractères dont une majuscule et un chiffre');
			return;
		}

		const emailRegex = /\S+@\S+\.\S+/;
		if (!emailRegex.test(email)) {
			alert('Veuillez entrer une adresse email valide');
			return;
		}


		this.loginService.tryRegister(email, password)
			.subscribe(loginResult => {
				if (loginResult instanceof HttpErrorResponse) {
					alert(`Erreur lors de l'inscription : ${loginResult.error.message}`);
					return;
				}

				// success
				this.router.navigate(['/login']);
			}
		);
    };
}

