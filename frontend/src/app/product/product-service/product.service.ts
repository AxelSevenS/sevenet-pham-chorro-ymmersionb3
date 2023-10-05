import { Injectable } from '@angular/core';
import { Product } from '../product-model/product.model';
import { environment } from '../../shared/environment';

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	constructor() {}

	public async getProducts(): Promise<Product[]> {
		return new Promise<Product[]>(resolve => {
			fetch( environment.domainUrl + 'api/products' )
				.then(response => response.json())
				.then(data => {
					resolve(data);
				}
			);
		});
	}

	public async getProduct(id: number): Promise<Product> {
		return new Promise<Product>(resolve => {
			fetch( environment.domainUrl + 'api/products/' + id )
				.then(response => response.json())
				.then(data => {
					resolve(data);
				}
			);
		});
	}
}
