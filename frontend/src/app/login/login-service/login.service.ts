import { Injectable } from '@angular/core';
import { environment } from 'src/app/shared/environment';
import { User } from '../user-model/user.model';

@Injectable({
  	providedIn: 'root'
})
export class LoginService {

	constructor() { }

	async tryLogin(email: string, password: string): Promise<string | Error> {
		
		return new Promise<string | Error>(resolve => {
			let body = new FormData();
			body.append('email', email);
			body.append('password', password);

			fetch( environment.domainUrl + 'api/users/login', {
				method: 'POST',
				body: body,
				redirect: 'follow'
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

	async tryRegister(email: string, password: string): Promise<User | Error> {
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
}