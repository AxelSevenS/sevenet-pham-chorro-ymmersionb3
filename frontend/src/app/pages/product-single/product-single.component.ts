import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../product/product-model/product.model';
import { ProductService } from '../../product/product-service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { integer, parseInteger } from '../../shared/integer';
import { environment } from '../../shared/environment';

@Component({
  selector: 'product-single',
  templateUrl: './product-single.component.html',
  styleUrls: ['./product-single.component.scss']
})
export class ProductSingleComponent implements OnInit {

	private _productId: integer | null = null;
	product$: Promise<Product> | null = null;


	@Input() set productId(productId: integer) { this._productId = productId; }
	get productId() { return this._productId as integer; }

	get urlBase() { return environment.domainUrl }


	public constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) {
	}


	ngOnInit(): void {
		if (this._productId === null) {
			// Get the product ID from the URL, if it's not provided as an input
			let idParam = this.route.snapshot.queryParamMap.get('id');
			if (idParam !== null) {
				this.productId = parseInteger( idParam );
			} else {
				this.router.navigate(['/404']);
			}
		}
		this.product$ = this.productService.getProduct(this.productId);
	}
	

}
