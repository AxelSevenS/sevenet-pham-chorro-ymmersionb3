import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { User } from '../user-model/user.model';
import { sha256 } from 'js-sha256';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  	providedIn: 'root'
})
export class LoginService {

	public static currentUser: User | null = null;


	constructor(
		private http: HttpClient
	) { }


	public tryLogin = (email: string, password: string): Observable<string | HttpErrorResponse> => {
		let body = new FormData();
		body.append('email', email);
		body.append('password', sha256(password));

		return this.http.post<string | HttpErrorResponse>(environment.domainUrl + 'api/users/login', body);
	};

	public tryRegister = (email: string, password: string): Observable<User | HttpErrorResponse> => {
		let body = new FormData();
		body.append('email', email);
		body.append('password', sha256(password));

		return this.http.post<User | HttpErrorResponse>(environment.domainUrl + 'api/users/register', body);
	}

	public static refreshUser() {
		LoginService.currentUser = LoginService.getCurrentUser();
	}
	
	public static getCurrentUser(): User | null {
		const jwtString = this.getJWT();
		if (jwtString === null || jwtString === undefined) {
			return null;
		}

		// split the jwt string into 3 parts: header, payload, and signature
		const jwt = jwtString.split('.');
		if (jwt.length !== 3) {
			return null;
		}

		const payload = JSON.parse(atob(jwt[1]));
		let user = {
			id: payload.id,
			email: payload.email,
			password: payload.password,
		};
		
		return user;
	}

	public static setJWT(jwt: string) {
		localStorage.setItem('jwt', JSON.stringify(jwt));
		LoginService.refreshUser();
	}

	public static getJWT(): string | null {
		return localStorage.getItem('jwt');
	}

	public static resetJWT() {
		localStorage.removeItem('jwt');
		LoginService.refreshUser();
	}
}