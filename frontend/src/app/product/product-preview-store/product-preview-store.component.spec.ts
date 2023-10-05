import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPreviewStoreComponent } from './product-preview-store.component';

describe('ItemPreviewStoreComponent', () => {
	let component: ProductPreviewStoreComponent;
	let fixture: ComponentFixture<ProductPreviewStoreComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ProductPreviewStoreComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(ProductPreviewStoreComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
