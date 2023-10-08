import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/product/product-model/product.model';
import { ProductService } from 'src/app/product/product-service/product.service';
import { integer } from 'src/app/shared/integer';

@Component({
	selector: 'add-product',
	templateUrl: './add-product.component.html',
	styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

	public name = '';
	public description = '';
	public price = 0 as integer;
	public stock = 0 as integer;
	public files: File[] = [];

	public get fileTypes(): string { return 'image/jpeg;image/png'; }


	constructor(
		private productService: ProductService, 
		private router: Router
	) { }


	public submitProduct = async () => {
		const product = {
			id : 0 as integer, // This is a dummy value, it will be replaced by the server
			name: this.name,
			description: this.description,
			price: this.price,
			stock: this.stock,
			images: [] // this will be ignored in favor of the files passed to the service
		};

		this.productService.addProduct(product, this.files)
			.subscribe(result => {
				this.router.navigate(['/products', result.id]);
			}
		);
	}

	public onFilesSelected = (event: any) => {
		this.files = [];
		for (let i = 0; i < event.target.files.length; i++) {
			this.files.push(event.target.files[i]);
		}
	}

}
