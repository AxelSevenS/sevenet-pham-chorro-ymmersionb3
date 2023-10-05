import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../product/product-model/product.model';


@Pipe({
 	name: 'clampPrice'
})
export class ClampPricePipe implements PipeTransform {
	transform(items: Product[] | null, minPrice: number | boolean, maxPrice: number | boolean): Product[] {
		if(!items) return [];
        
        if (typeof minPrice === 'number') {
            items = items.filter(item => item.price >= minPrice);
        }

        if (typeof maxPrice === 'number') {
            items = items.filter(item => item.price <= maxPrice);
        }

        return items;
	}
}