import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../product/product-model/product.model';
import { ProductService } from '../../product/product-service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { integer, parseInteger } from '../../shared/integer';
import { environment } from '../../../../../environment';
import { CartService } from 'src/app/cart/cart-service/cart.service';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss']
})
export class ProductSingleComponent implements OnInit {

	private _productId: integer | null = null;
	product: Product | null = null;


	@Input() set productId(productId: integer) { this._productId = productId; }
	get productId() { return this._productId as integer; }

	get urlBase() { return environment.domainUrl }

	get cartIcon() { return faCartShopping; }


	public constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute, private router: Router) {}


	ngOnInit(): void {
		
		// Get the product ID from the URL body, if it's not provided as an input
		if (this._productId === null) {
			const idParam = this.route.snapshot.paramMap.get('id');
			if (idParam !== null) {
				this.productId = parseInteger( idParam );
			}
		}
		
		this.productService.getProduct(this.productId)
			.subscribe(product => {
				if (product instanceof HttpErrorResponse) {
					this.router.navigate(['/404']);
					return;
				}

				this.product = product;
			}
		);
	}


	addToCart = async () => {
		if (this.product === null) {
			return;
		}
		await this.cartService.addItem(this.product);
	}
	

}
