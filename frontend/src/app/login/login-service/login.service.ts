import { Injectable } from '@angular/core';
import { environment } from 'src/app/shared/environment';
import { User } from '../user-model/user.model';

@Injectable({
  	providedIn: 'root'
})
export class LoginService {

	public static currentUser: User | null = null;

	constructor() { }

	tryLogin = async (email: string, password: string): Promise<string | Error> => {
		
		return new Promise<string | Error>(resolve => {
			let body = new FormData();
			body.append('email', email);
			body.append('password', password);

			fetch( environment.domainUrl + 'api/users/login', {
				method: 'POST',
				body: body
			} )
				.then(response => response.json())
				.then(data => {
					if (data.status) {
						let error = new Error(data.title);
						resolve(error);
						return;
					}
					resolve(data);
				});
		});
		
	};

	tryRegister = async (email: string, password: string): Promise<User | Error> => {
		return new Promise<User | Error>(resolve => {
			var body = new FormData();
			body.append('email', email);
			body.append('password', password);

			fetch( environment.domainUrl + 'api/users/register', {
				method: 'POST',
				body: body
			} )
				.then(response => response.json())
				.catch(error => {
					resolve(error);
				})
				.then(data => {
					resolve(data);
				});
		});
		
	}

	public static updateCurrentUser = () => {
		let currentUser: User | Error = LoginService.getCurrentUser();
		if ( !(currentUser instanceof Error) ) {
			LoginService.currentUser = currentUser;
		}
	}
	
	public static getCurrentUser = (): User | Error => {
		const jwtString = localStorage.getItem('jwt');
		if (jwtString === null || jwtString === undefined) {
			return new Error('No JWT found');
		}
		const jwt = JSON.parse(jwtString);

		const payload = JSON.parse(atob(jwt.payload));
		let user = {
			id: payload.id,
			email: payload.email,
			password: payload.password,
		};
		
		return user;
	}
}