import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../product/product-model/product.model';


@Pipe({
 	name: 'productTextFilter'
})
export class ProductTextFilterPipe implements PipeTransform {
	
	transform(items: Product[] | null, searchText: string): Product[] {
		if(!items) return [];
		if(!searchText) return items;

		searchText = searchText.toLowerCase();

		return items.filter( it => {
			return it.name.toLowerCase().includes(searchText) || it.description.toLowerCase().includes(searchText);
		});
	}
}