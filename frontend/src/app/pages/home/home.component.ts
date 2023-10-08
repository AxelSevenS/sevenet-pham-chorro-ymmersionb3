import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../product/product-model/product.model';
import { ProductService } from '../../product/product-service/product.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent {

	products: Product[] = [];
	
	searchText: string = '';
	sortingMethod: string = 'default';
	cullOutOfStock: boolean = false;
	minPrice: number | boolean = false;
	maxPrice: number | boolean = false;
	
	public constructor(private productService: ProductService) {	
		this.productService.getProducts()
			.subscribe(products => {
				this.products = products;
			});
	}
}
