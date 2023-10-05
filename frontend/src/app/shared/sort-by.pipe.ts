import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../product/product-model/product.model';


@Pipe({
 	name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
	transform(items: Product[] | null, method: string): Product[] {
		if(!items) return [];
		
		switch (method) {
			case 'nameAsc':
				return items.sort((a, b) => a.name.localeCompare(b.name));
			case 'nameDesc':
				return items.sort((a, b) => b.name.localeCompare(a.name));
			case 'priceAsc':
				return items.sort((a, b) => a.price - b.price);
			case 'priceDesc':
				return items.sort((a, b) => b.price - a.price);
			case 'stockAsc':
				return items.sort((a, b) => a.stock - b.stock);
			case 'stockDesc':
				return items.sort((a, b) => b.stock - a.stock);
			default:
				return items;
		}
	}
}