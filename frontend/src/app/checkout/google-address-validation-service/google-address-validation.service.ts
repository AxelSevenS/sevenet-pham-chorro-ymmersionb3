import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GoogleAddressValidationService {


	constructor(
		private http: HttpClient, 
		@Inject('GMAPS_API_KEY') public apiKey: string
	) { }
  
	
	public validateAddress = (address: string, locality: string): Observable<any | HttpErrorResponse> => {
		const apiUrl = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${this.apiKey}`;
		let body = {
			'address': {
				'addressLines': [locality, address]
			}
		}
		
		return this.http.post(apiUrl, body);
	}

	public getEmbedMapUrl = (address: string) => {
		let url = `https://www.google.com/maps/embed/v1/place?key=${this.apiKey}&q=${encodeURI(address)}`;
		return url;
	}
}
