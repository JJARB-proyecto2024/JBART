import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRole, IRoleType } from './interfaces';
import { BrandSignupComponent } from './pages/auth/brand-signup/brand-signup.component';
import { BrandUserListComponent } from './components/brand-user/brand-user-list/brand-user-list.component';
import { BuyerSignupComponent } from './pages/auth/buyer-signup/buyer-signup.component';
import { BrandUsersComponent } from './pages/brandUsers/brand-users.component';
import { DisableAccountComponent } from './pages/auth/disable-account/disable-account.component';
import { ResetPasswordSendEmailComponent } from './pages/auth/reset-password/reset-password-send-email/reset-password-send-email.component';
import { ResetPasswordValidateComponent } from './pages/auth/reset-password/reset-password-validate/reset-password-validate.component';
import { BuyerProfileComponent } from './pages/profile/buyer-profile/buyer-profile.component';
import { BrandProfileComponent } from './pages/profile/brand-profile/brand-profile.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { BrandUsersAvaliableComponent } from './pages/brandUsersAvaliable/brand-users-avaliable.component';
import { ProductsRecommendedComponent } from './pages/productsRecommended/productsRecommended.component';
import { ProductTypesComponent } from './pages/product-types/product-types.component';
import { NgModule } from '@angular/core';
import { PaymentComponent } from './pages/store/payment/payment.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { BrandOrdersComponent } from './pages/brandOrders/brand-orders.component';
import { UserOrdersComponent } from './pages/userOrders/user-orders.component';
import { SalesComponent } from './pages/sales/sales.component';
import { BrandOrderDetailsComponent } from './pages/brand-order-details/brand-order-details.component';
import { BuyerOrderDetails } from './pages/buyer-order-details/buyer-order-details.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { LandingTeamComponent } from './pages/landingTeam/landingTeam.component';
import { LandingProductComponent } from './pages/landingProduct/landingProduct.component';
import { RegisterOptionsComponent } from './pages/register-options/register-options.component';
import { ViewOptionsComponent } from './pages/product-options/product-options.component';
import { ProductsRecommendedCategoriesComponent } from './pages/productsRecommendedCategories/productsRecommendedCategories.component';
import { ProductsRecommendedBrandsComponent } from './pages/productsRecommendedBrands/productsRecommendedBrands.component';
import { UserBrandRoleGuard } from './guards/user-brand-role.guard';
import { EarningsComponent } from './pages/earnings/earnings.component';
import { ActivateAccountSendEmailComponent } from './pages/auth/activate-account/activate-account-send-email/activate-account-send-email.component';
import { ActivateAccountValidateComponent } from './pages/auth/activate-account/activate-account-validate/activate-account-validate.component';
import { AdminChatbotComponent } from './pages/admin-chatbot/admin-chatbot.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { AvatarCreateComponent } from './pages/avatar/avatar-create/avatar-create.component';
import { AvatarViewComponent } from './pages/avatar/avatar-view/avatar-view.component';
import { UserBuyerRoleGuard } from './guards/user-buyer-role.guard';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  {
    path: 'landingTeam',
    component: LandingTeamComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'landingProduct',
    component: LandingProductComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },

  {
    path: 'signup/brand',
    component: BrandSignupComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup/buyer',
    component: BuyerSignupComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'disableaccount',
    component: DisableAccountComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset/email',
    component: ResetPasswordSendEmailComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset/validate',
    component: ResetPasswordValidateComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'landingTeam',
    pathMatch: 'full',
  },
  {
    path: 'reset/status/email',
    component: ActivateAccountSendEmailComponent
  },
  {
    path: "reset/status/validate",
    component: ActivateAccountValidateComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRole.admin,
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Usuarios'
        }
      },
      {
        path: 'brands',
        component: BrandUsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRole.admin,
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Solicitudes de nuevas marcas'
        }
      },
      {
        path: 'account',
        component: DisableAccountComponent,
        canActivate: [UserBuyerRoleGuard],
        data: {
          authorities: [
            IRole.user
          ],
          showInSidebar: true,
          name: 'Desactivación de cuenta'
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          authorities: [
            IRole.admin,
            IRole.superAdmin,
            IRole.user
          ],
          name: 'Dashboard'
        }
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: {
          authorities: [
            IRole.admin,
            IRole.user
          ],
          name: 'Notificationes'
        }
      },
      {
        path: 'cart',
        component: CartComponent,
        data: {
          authorities: [
            IRole.user
          ],
          name: 'Cart'
        }
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRole.admin,
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Categorias'
        }
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [UserBrandRoleGuard],
        data: {
          authorities: [
            IRole.userBrand
          ],
          showInSidebar: true,
          name: 'Lista de Productos'
        }
      },
      {
        path: 'avatarCreate',
        component: AvatarCreateComponent,
        canActivate: [UserBuyerRoleGuard],
        data: {
          authorities: [
            IRole.user,
          ],
          showInSidebar: true,
          name: 'Crear Avatar'
        }
      },
      {
        path: 'avatarView',
        component: AvatarViewComponent,
        canActivate: [UserBuyerRoleGuard],
        data: {
          authorities: [
            IRole.user,
          ],
          showInSidebar: true,
          name: 'Ver Avatar'
        }
      },
      {
        path: 'product-details/:id',
        component: ProductDetailsComponent,
        canActivate: [UserBuyerRoleGuard],
        data: {
          authorities: [
            IRole.user,
          ],
          showInSidebar: false,
          name: 'Detalles del Producto'
        }
      },
      {
        path: 'products-recommended',
        component: ProductsRecommendedComponent,
        data: {
          authorities: [
            IRole.superAdmin,
            IRole.user
          ],
          showInSidebar: false,
          name: 'Productos Recomendados'
        }
      },
      {
        path: 'products-recommended-categories/:id',
        component: ProductsRecommendedCategoriesComponent,
        data: {
          authorities: [
            IRole.superAdmin,
            IRole.user
          ],
          showInSidebar: false,
          name: 'Productos por Categoria'
        }
      },
      {
        path: 'products-recommended-brands/:id',
        component: ProductsRecommendedBrandsComponent,
        data: {
          authorities: [
            IRole.superAdmin,
            IRole.user
          ],
          showInSidebar: false,
          name: 'Productos por Marcas'
        }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Ordenes'
        }
      },
      {
        path: 'brand-orders',
        component: BrandOrdersComponent,
        canActivate: [UserBrandRoleGuard],
        data: {
          authorities: [
            IRole.userBrand
          ],
          showInSidebar: true,
          name: 'Ordenes de Marca'
        }
      },
      {
        path: 'brand-order-details/:id',
        component: BrandOrderDetailsComponent,
        canActivate: [UserBrandRoleGuard],
        data: {
          authorities: [
            IRole.userBrand
          ],
          name: 'Brand Order Details'
        }
      },
      {
        path: 'buyer-order-details/:id',
        component: BuyerOrderDetails,
        canActivate: [UserBuyerRoleGuard],
        data: {
          authorities: [
            IRole.user
          ],
          name: 'Brand Order Details'
        }
      },
      {
        path: 'user-orders',
        component: UserOrdersComponent,
        canActivate: [UserBuyerRoleGuard],
        data: {
          authorities: [
            IRole.user
          ],
          showInSidebar: true,
          name: 'Ordenes de Usuario'
        }
      },
      {
        path: 'brands-avaliable',
        component: BrandUsersAvaliableComponent,
        data: {
          authorities: [
            IRole.superAdmin,
            IRole.user
          ],
          showInSidebar: true,
          name: 'Marcas Disponibles'
        }
      },
      {
        path: 'buyer-profile',
        component: BuyerProfileComponent,
        canActivate: [UserBuyerRoleGuard],
        data: {
          authorities: [
            IRole.user
          ],
          showInSidebar: false,
          name: 'Perfil'
        }
      },
      {
        path: 'brand-profile',
        component: BrandProfileComponent,
        canActivate: [UserBrandRoleGuard],
        data: {
          authorities: [
            IRole.userBrand
          ],
          showInSidebar: false,
          name: 'Perfil'
        }
      },
      {
        path: 'product-types',
        component: ProductTypesComponent,
        data: {
          authorities: [
            IRole.user,
            IRole.userBrand
          ],
          showInSidebar: true,
          name: 'Categorias'
        }
      },
      {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [UserBuyerRoleGuard],
        data: {
          autorities: [
            IRole.user
          ],
          showInSidebar: false,
          name: 'Pago'
        }
      },
      {
        path: 'sales',
        component: SalesComponent,
        canActivate: [UserBrandRoleGuard],
        data: {
          authorities: [
            IRole.userBrand
          ],
          showInSidebar: true,
          name: 'Ventas'
        }
      },
      {
        path: 'admin-chatbot',
        component: AdminChatbotComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Chatbot'
        }
      },
      {
        path: 'BuyerProducts',
        component: ViewOptionsComponent,
        data: {
          authorities: [
            IRole.user,
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Productos'
        }
      },
      {
        path: 'earnings',
        component: EarningsComponent,
        canActivate: [AdminRoleGuard],
        data: { 
          authorities: [
            IRole.admin,
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Ganacias por Marca'
        }
      },
    ],
  },
  {
    path: 'register-options',
    component: RegisterOptionsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
