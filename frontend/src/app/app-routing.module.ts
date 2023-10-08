import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent} from './pages/not-found/not-found.component';
import { ProductSingleComponent } from './pages/product-single/product-single.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AddProductComponent } from './pages/add-product/add-product.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', redirectTo: '', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'addProduct', component: AddProductComponent },
	{ path: 'products/:id', component: ProductSingleComponent},
	{ path: 'checkout', component: CheckoutComponent },
	{ path: '404' , component: NotFoundComponent },
	{ path: '**', component: NotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
