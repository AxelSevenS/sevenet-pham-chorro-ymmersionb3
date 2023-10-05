import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../product/product-model/product.model';


@Pipe({
 	name: 'stockFilter'
})
export class StockFilterPipe implements PipeTransform {
	transform(items: Product[] | null, doCull: boolean): Product[] {
		if(!items) return [];
		if(!doCull) return items;
        
        return items.filter( it => {
            return it.stock > 0;
        });
	}
}