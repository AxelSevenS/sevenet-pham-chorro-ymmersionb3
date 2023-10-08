import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPreviewCartComponent } from './product-preview-cart.component';

describe('ProductPreviewCartComponent', () => {
  let component: ProductPreviewCartComponent;
  let fixture: ComponentFixture<ProductPreviewCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPreviewCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPreviewCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
