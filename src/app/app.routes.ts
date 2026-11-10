import { Routes } from '@angular/router';

import { LoginComponent } from './core/auth/component/login/login.component';
import { RegisterComponent } from './core/auth/component/register/register.component';
import { HomeComponent } from './features/home/component/home/home.component';
import { CategoryComponent } from './features/category/component/category/category.component';
import { NotFoundComponent } from './core/auth/component/not-found/not-found.component';
import { AuthlayoutComponent } from './core/layouts/authlayout/authlayout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { ShopComponent } from './features/product/component/shop/shop.component';
import { BrandsListComponent } from './features/brands/component/brands-list/brands-list.component';
import { ProductDeatilsComponent } from './features/product/component/product-deatils/product-deatils.component';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { CartListComponent } from './features/cart/component/cart-list/cart-list.component';
import { CheckoutComponent } from './features/order/component/checkout/checkout.component';
import { OrderComponent } from './features/order/component/order/order.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthlayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        component: LoginComponent,
        pathMatch: 'full',
        title: 'Login',
      },
    ],
  },

  {
    path: 'register',
    component: AuthlayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        component: RegisterComponent,
        pathMatch: 'full',
        title: 'Register',
      },
    ],
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],

    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },

      {
        path: 'category',
        component: CategoryComponent,
        title: 'Categories',
      },

      {
        path: 'products',
        component: ShopComponent,
        title: 'Shop',
      },

      {
        path: 'product-details/:id',
        component: ProductDeatilsComponent,
        title: 'Product Details',
      },

      {
        path: 'brands',
        component: BrandsListComponent,
        title: 'Brands',
      },

      {
        path: 'cart',
        component: CartListComponent,
        title: 'Cart',
      },
      { 
        path: 'Checkout/:id',
        component: CheckoutComponent,
        title: 'Checkout',
      },
      { 
        path: 'allorders',
        component: OrderComponent,
        title: 'My Orders',
      },
    ],
  },

  {
    path: '**',
    component: NotFoundComponent,
    title: 'Page not found',
  },
];
