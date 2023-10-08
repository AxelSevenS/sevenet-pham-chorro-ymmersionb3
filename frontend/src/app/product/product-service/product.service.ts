import { Injectable } from '@angular/core';
import { Product } from '../product-model/product.model';
import { environment } from '../../../../../environment';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	constructor(
		private http: HttpClient
	) {}

	private _products: Map<number, Product> = new Map<number, Product>();


	/**
	 * @description Get all products
	 * @returns {Observable<Product[]>}
	 * @memberof ProductService
	 * @example
	 * ```ts
	 * getProducts().subscribe((products: Product[]) => {
	 * 	// Do something with products
	 * });
	 * ```
	 */
	public getProducts = (): Observable<Product[]> => {
		return this.http.get<Product[]>(environment.domainUrl + 'api/products');
	}

	/**
	 * @description Get a product by id
	 * @param {number} id
	 * @returns {Observable<Product | HttpErrorResponse>}
	 * @memberof ProductService
	 * @example
	 * ```ts
	 * getProduct(1).subscribe((product: Product) => {
	 * 	// Do something with product
	 * });
	 * ```
	 */
	public getProduct = (id: number): Observable<Product | HttpErrorResponse> => {
		return this.http.get<Product>(environment.domainUrl + 'api/products/' + id);
	}

	/**
	 * @description Add a product to the database
	 * @param {Product} product
	 * @param {File[]} files
	 * @returns {Observable<Product>} The product that was added
	 * @memberof ProductService
	 * @example
	 * ```ts
	 * addProduct(product, files).subscribe((product: Product) => {
	 * 	// Do something with product
	 * });
	 */
	public addProduct = (product: Product, files: File[]): Observable<Product> => {
		let body = new FormData();
		body.append('name', product.name);
		body.append('description', product.description);
		body.append('price', product.price.toString());
		body.append('stock', product.stock.toString());
		for (let i = 0; i < files.length; i++) {
			body.append(`image${i}`, files[i], files[i].name);
		}

		let queryResponse = this.http.post<Product>(environment.domainUrl + 'api/products', body);
		queryResponse.subscribe(response => {
			if (response instanceof HttpErrorResponse) {
				return;
			}
			this._products.set(response.id, response);
		});
		return queryResponse;
	}

	/**
	 * @description Update a product in the database
	 * @param {number} id
	 * @param {Product} product
	 * @returns {Observable<Product | HttpErrorResponse>} The product that was updated
	 * @memberof ProductService
	 * @example
	 * ```ts
	 * updateProduct(1, product).subscribe((product: Product) => {
	 * 	// Do something with product
	 * });
	 */
	public setStock = (id: number, quantity: number): Observable<Product | HttpErrorResponse> => {
		let body = new FormData();
		body.append('stock', quantity.toString());
		
		let queryResponse = this.http.put<Product | HttpErrorResponse>(environment.domainUrl + 'api/products/' + id, body);
		queryResponse.subscribe(response => {
			if (response instanceof HttpErrorResponse) {
				return;
			}
			this._products.set(id, response);
		});
		return queryResponse;
	}


	/**
	 * @description Get a product from the cache, or fetch it from the server and cache it
	 * @param {number} index
	 * @returns {(Promise<Product | null>)}
	 * @memberof ProductService
	 * @example
	 * ```ts
	 * let product = await this.productService.getCachedProduct(1);
	 * ```
	 */
	public getOrCacheProduct = async (index: number): Promise<Product | null> => {
		let result = this._products.get(index);
		if (result === undefined) {
			let queryResponse = await lastValueFrom(this.getProduct(index));
			if (queryResponse instanceof HttpErrorResponse) {
				return null;
			}

			this._products.set(index, queryResponse);
			result = queryResponse;
		}
		return result;
	}
}
