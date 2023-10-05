import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductPreviewStoreComponent } from './product/product-preview-store/product-preview-store.component';
import { ProductPreviewCartComponent } from './cart/product-preview-cart/product-preview-cart.component';
import { ProductSingleComponent } from './pages/product-single/product-single.component';
import { ProductService } from './product/product-service/product.service';
import { ProductTextFilterPipe } from './shared/product-text-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RegisterComponent } from './pages/register/register.component';
import { CartService } from './cart/cart-service/cart.service';
import { CartComponent } from './cart/cart-component/cart.component';
import { StockFilterPipe } from './shared/stock-filter.pipe';
import { SortByPipe } from './shared/sort-by.pipe';
import { ClampPricePipe } from './shared/clamp-price.pipe';

@NgModule({
	declarations: [
		AppComponent,
		CartComponent,
		HomeComponent,
		LoginComponent,
		RegisterComponent,
		NotFoundComponent,
		ProductTextFilterPipe,
		StockFilterPipe,
		SortByPipe,
		ClampPricePipe,
		ProductPreviewStoreComponent,
		ProductPreviewCartComponent,
		ProductSingleComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		FontAwesomeModule,
		SlickCarouselModule,
		ReactiveFormsModule,
	],
	providers: [
		ProductService, 
		CartService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
